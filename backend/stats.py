from fastapi import APIRouter
from sqlalchemy import text
from datetime import datetime
from database import engine

router = APIRouter()

# ==========================================
# API LẤY SỐ LIỆU THỐNG KÊ THẬT CHO ADMIN DASHBOARD
# ==========================================
@router.get("/api/admin/stats")
def get_admin_stats():
    try:
        with engine.connect() as conn:
            # 1. Tính tổng doanh thu
            revenue_query = text("""
                SELECT COALESCE(SUM(r.Price), 0) as TotalRevenue 
                FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE b.PaymentStatus = N'Đã thanh toán'
            """)
            total_revenue = conn.execute(revenue_query).scalar()

            # 2. Đếm tổng số đơn đặt phòng 
            bookings_query = text("""
                SELECT 
                    COUNT(*) as TotalBookings,
                    SUM(CASE WHEN PaymentStatus = N'Đã thanh toán' THEN 1 ELSE 0 END) as PaidBookings
                FROM Bookings
            """)
            bookings_result = conn.execute(bookings_query).mappings().first()
            total_bookings = bookings_result["TotalBookings"] or 0
            paid_bookings = bookings_result["PaidBookings"] or 0

            # 3. Tính hiệu suất phòng 
            rooms_query = text("""
                SELECT 
                    (SELECT COUNT(*) FROM Rooms) as TotalRooms,
                    (SELECT COUNT(DISTINCT RoomID) FROM Bookings WHERE Status = N'Đã xác nhận') as RentedRooms
            """)
            rooms_result = conn.execute(rooms_query).mappings().first()
            total_rooms = rooms_result["TotalRooms"] or 0
            rented_rooms = rooms_result["RentedRooms"] or 0

            # 4. Gom nhóm doanh thu theo tháng
            chart_query = text("""
                SELECT 
                    FORMAT(b.BookingDate, 'MM') as MonthNum,
                    COALESCE(SUM(r.Price), 0) as MonthlyRevenue
                FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE b.PaymentStatus = N'Đã thanh toán'
                  AND b.BookingDate >= DATEADD(month, -6, GETDATE())
                GROUP BY FORMAT(b.BookingDate, 'MM')
                ORDER BY MonthNum ASC
            """)
            chart_result = conn.execute(chart_query)
            
            chart_data = []
            for row in chart_result:
                chart_data.append({
                    "name": f"Tháng {row._mapping['MonthNum']}",
                    "DoanhThu": float(row._mapping['MonthlyRevenue'])
                })

            if not chart_data:
                current_month = datetime.now().strftime('%m')
                chart_data = [{"name": f"Tháng {current_month}", "DoanhThu": 0}]

            return {
                "total_revenue": float(total_revenue),
                "total_bookings": total_bookings,
                "paid_bookings": paid_bookings,
                "total_rooms": total_rooms,
                "rented_rooms": rented_rooms,
                "chart_data": chart_data
            }
    except Exception as e:
        return {"error": str(e)}
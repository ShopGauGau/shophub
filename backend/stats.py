from fastapi import APIRouter, Header, HTTPException
from sqlalchemy import text
from datetime import datetime
from database import engine
from typing import Optional

router = APIRouter()

@router.get("/api/admin/stats")
def get_admin_stats(room_title: Optional[str] = None):
    try:
        with engine.connect() as conn:
            # --- TRƯỜNG HỢP 1: DASHBOARD CHI TIẾT CHO TỪNG PHÒNG RIÊNG BIỆT ---
            if room_title:
                # 1. Lấy thông tin cơ bản và tổng doanh thu của phòng này
                room_info_query = text("""
                    SELECT r.RoomID, r.Price,
                           (SELECT COUNT(*) FROM Bookings b WHERE b.RoomID = r.RoomID) as TotalBookings,
                           (SELECT COALESCE(SUM(r2.Price), 0) FROM Bookings b2 JOIN Rooms r2 ON b2.RoomID = r2.RoomID 
                            WHERE b2.RoomID = r.RoomID AND b2.PaymentStatus = N'Đã thanh toán') as PaidRevenue
                    FROM Rooms r
                    WHERE r.Title = :room_title
                """)
                room_info = conn.execute(room_info_query, {"room_title": room_title}).mappings().first()
                
                if not room_info:
                    return {"error": "Không tìm thấy phòng này ní ơi!"}

                # 2. Thống kê doanh thu theo ngày của riêng phòng này (30 ngày qua)
                daily_query = text("""
                    SELECT 
                        FORMAT(b.BookingDate, 'dd/MM') as DayStr,
                        COALESCE(SUM(r.Price), 0) as DailyRevenue
                    FROM Bookings b
                    JOIN Rooms r ON b.RoomID = r.RoomID
                    WHERE b.PaymentStatus = N'Đã thanh toán'
                      AND r.Title = :room_title
                      AND b.BookingDate >= DATEADD(day, -30, GETDATE())
                    GROUP BY FORMAT(b.BookingDate, 'dd/MM'), CAST(b.BookingDate AS DATE)
                    ORDER BY CAST(b.BookingDate AS DATE) ASC
                """)
                daily_result = conn.execute(daily_query, {"room_title": room_title})
                daily_chart = [{"name": row._mapping['DayStr'], "DoanhThu": float(row._mapping['DailyRevenue'])} for row in daily_result]
                
                # SỬA LỖI Ở ĐÂY: Thêm phòng vệ chống sập nếu phòng chưa có doanh thu ngày nào
                if not daily_chart:
                    daily_chart = [{"name": datetime.now().strftime('%d/%m'), "DoanhThu": 0}]

                # 3. Lịch sử đặt phòng của riêng phòng này
                recent_query = text("""
                    SELECT b.FullName, b.BookingDate, b.StartTime, b.EndTime, b.Status, b.PaymentStatus
                    FROM Bookings b
                    JOIN Rooms r ON b.RoomID = r.RoomID
                    WHERE r.Title = :room_title
                    ORDER BY b.BookingDate DESC
                """)
                recent_result = conn.execute(recent_query, {"room_title": room_title})
                recent_bookings = [{
                    "FullName": row._mapping['FullName'],
                    "BookingDate": row._mapping['BookingDate'].strftime("%d/%m/%Y %H:%M") if row._mapping['BookingDate'] else "",
                    "TimeFrame": f"{row._mapping['StartTime'].strftime('%d/%m %H:%M')} - {row._mapping['EndTime'].strftime('%d/%m %H:%M')}",
                    "Status": row._mapping['Status'],
                    "PaymentStatus": row._mapping['PaymentStatus']
                } for row in recent_result]

                return {
                    "is_single_room": True,
                    "room_title": room_title,
                    "total_revenue": float(room_info["PaidRevenue"] or 0),
                    "total_bookings": room_info["TotalBookings"] or 0,
                    "room_price": float(room_info["Price"] or 0),
                    "chart_data": daily_chart,
                    "recent_bookings": recent_bookings
                }

            # --- TRƯỜNG HỢP 2: DASHBOARD TỔNG QUAN HỆ THỐNG ---
            revenue_query = text("SELECT COALESCE(SUM(r.Price), 0) FROM Bookings b JOIN Rooms r ON b.RoomID = r.RoomID WHERE b.PaymentStatus = N'Đã thanh toán'")
            total_revenue = conn.execute(revenue_query).scalar() or 0

            bookings_query = text("SELECT COUNT(*) as TotalBookings, SUM(CASE WHEN PaymentStatus = N'Đã thanh toán' THEN 1 ELSE 0 END) as PaidBookings FROM Bookings")
            bookings_result = bookings_query_res = conn.execute(bookings_query).mappings().first()
            total_bookings = bookings_result["TotalBookings"] or 0
            paid_bookings = bookings_result["PaidBookings"] or 0

            rooms_query = text("SELECT (SELECT COUNT(*) FROM Rooms) as TotalRooms, (SELECT COUNT(DISTINCT RoomID) FROM Bookings WHERE Status = N'Đã xác nhận') as RentedRooms")
            rooms_result = conn.execute(rooms_query).mappings().first()
            total_rooms = rooms_result["TotalRooms"] or 0
            rented_rooms = rooms_result["RentedRooms"] or 0

            daily_query = text("""
                SELECT FORMAT(b.BookingDate, 'dd/MM') as DayStr, COALESCE(SUM(r.Price), 0) as DailyRevenue
                FROM Bookings b JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE b.PaymentStatus = N'Đã thanh toán' AND b.BookingDate >= DATEADD(day, -30, GETDATE())
                GROUP BY FORMAT(b.BookingDate, 'dd/MM'), CAST(b.BookingDate AS DATE) ORDER BY CAST(b.BookingDate AS DATE) ASC
            """)
            daily_chart = [{"name": row._mapping['DayStr'], "DoanhThu": float(row._mapping['DailyRevenue'])} for row in conn.execute(daily_query)]
            if not daily_chart: 
                daily_chart = [{"name": datetime.now().strftime('%d/%m'), "DoanhThu": 0}]

            room_stats_query = text("""
                SELECT r.Title, COUNT(b.BookingID) as BookingCount,
                       COALESCE(SUM(CASE WHEN b.PaymentStatus = N'Đã thanh toán' THEN r.Price ELSE 0 END), 0) as RoomRevenue
                FROM Rooms r LEFT JOIN Bookings b ON r.RoomID = b.RoomID
                GROUP BY r.RoomID, r.Title ORDER BY RoomRevenue DESC
            """)
            room_stats = [{"Title": row._mapping['Title'], "BookingCount": row._mapping['BookingCount'], "RoomRevenue": float(row._mapping['RoomRevenue'])} for row in conn.execute(room_stats_query)]

            recent_query = text("""
                SELECT TOP 10 b.FullName, r.Title as RoomTitle, b.BookingDate, b.StartTime, b.EndTime, b.Status, b.PaymentStatus
                FROM Bookings b JOIN Rooms r ON b.RoomID = r.RoomID ORDER BY b.BookingDate DESC
            """)
            recent_bookings = [{
                "FullName": row._mapping['FullName'], "RoomTitle": row._mapping['RoomTitle'],
                "BookingDate": row._mapping['BookingDate'].strftime("%d/%m/%Y %H:%M") if row._mapping['BookingDate'] else "",
                "TimeFrame": f"{row._mapping['StartTime'].strftime('%d/%m %H:%M')} - {row._mapping['EndTime'].strftime('%d/%m %H:%M')}",
                "Status": row._mapping['Status'], "PaymentStatus": row._mapping['PaymentStatus']
            } for row in conn.execute(recent_query)]

            return {
                "is_single_room": False,
                "total_revenue": float(total_revenue),
                "total_bookings": total_bookings,
                "paid_bookings": paid_bookings,
                "total_rooms": total_rooms,
                "rented_rooms": rented_rooms,
                "chart_data": daily_chart,
                "room_stats": room_stats,
                "recent_bookings": recent_bookings
            }
    except Exception as e:
        return {"error": str(e)}


# ==========================================
# API THỐNG KÊ CHI TIẾT DÀNH RIÊNG CHO SALER
# ==========================================
@router.get("/api/saler/stats")
def get_saler_stats(role: Optional[str] = Header(None), user_id: Optional[str] = Header(None)):
    try:
        current_role = str(role).strip() if role else None
        
        if current_role != "2" or not user_id:
            raise HTTPException(status_code=403, detail="Ủa ní không phải Saler hoặc thiếu UserID rồi kìa!")
            
        saler_id = int(user_id)
        
        with engine.connect() as conn:
            revenue_query = text("""
                SELECT SUM(r.Price) as TotalRevenue
                FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE r.SalerID = :saler_id AND b.PaymentStatus = N'Đã thanh toán' AND b.Status = N'Đã xác nhận'
            """)
            total_revenue = conn.execute(revenue_query, {"saler_id": saler_id}).scalar() or 0

            rooms_query = text("SELECT COUNT(*) FROM Rooms WHERE SalerID = :saler_id")
            total_rooms = conn.execute(rooms_query, {"saler_id": saler_id}).scalar() or 0

            bookings_query = text("""
                SELECT COUNT(*) FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE r.SalerID = :saler_id
            """)
            total_bookings = conn.execute(bookings_query, {"saler_id": saler_id}).scalar() or 0

            status_query = text("""
                SELECT b.Status, COUNT(*) as Count
                FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE r.SalerID = :saler_id
                GROUP BY b.Status
            """)
            status_result = conn.execute(status_query, {"saler_id": saler_id}).mappings().all()
            status_data = {row["Status"]: row["Count"] for row in status_result}

            top_rooms_query = text("""
                SELECT TOP 3 r.Title, COALESCE(SUM(r.Price), 0) as RoomRevenue, COUNT(b.BookingID) as TotalBookings
                FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE r.SalerID = :saler_id AND b.PaymentStatus = N'Đã thanh toán' AND b.Status = N'Đã xác nhận'
                GROUP BY r.Title
                ORDER BY RoomRevenue DESC
            """)
            top_rooms_result = conn.execute(top_rooms_query, {"saler_id": saler_id}).mappings().all()
            top_rooms = [dict(row) for row in top_rooms_result]

       # SỬA LẠI KHÚC NÀY NÈ NÍ (Khoảng dòng cuối cùng của file stats.py)
        return {
            "totalRevenue": total_revenue,
            "totalRooms": total_rooms,
            "totalBookings": total_bookings,
            "statusStats": status_data,  # <--- Sửa chữ statusStatus thành statusStats
            "topRooms": top_rooms
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
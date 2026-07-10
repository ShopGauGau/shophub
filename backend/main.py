from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from pydantic import BaseModel
from database import engine  
from auth import router as auth_router 
from rooms import router as rooms_router
from datetime import datetime 
from favorites import router as favorites_router

# Import cái vnpay.py 
from vnpay import router as vnpay_router 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend-xq4z.onrender.com"], # Dán link frontend vào đây nè ní
    allow_methods=["*"],
    allow_headers=["*"],
)

# ĐĂNG KÝ ROUTER
app.include_router(auth_router)
app.include_router(rooms_router)
app.include_router(favorites_router)

# Đăng ký router cho VNPAY hoạt động
app.include_router(vnpay_router)

# ==========================================
# PHẦN ROOMS: Route lấy danh sách phòng
# ==========================================
@app.get("/api/rooms")
def get_rooms():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM Rooms"))
            data = []
            for row in result:
                row_dict = dict(row._mapping)
                if isinstance(row_dict.get('Title'), str):
                    row_dict['Title'] = row_dict['Title'].strip()
                data.append(row_dict)
            return data
    except Exception as e:
        return {"loi_ket_noi_la": str(e)}

@app.get("/api/rooms/{id}")
def get_room_details(id: int):
    try:
        with engine.connect() as conn:
            query = text("SELECT * FROM Rooms WHERE RoomID = :id")
            result = conn.execute(query, {"id": id}).mappings().first()
            if result:
                return dict(result)
            return {"error": "Không tìm thấy phòng này ní ơi!"}
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# PHẦN BOOKINGS (ĐẶT PHÒNG)
# ==========================================
@app.get("/api/bookings")
def get_all_bookings():
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT b.*, r.Title as RoomTitle 
                FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                ORDER BY b.BookingID DESC
            """)
            result = conn.execute(query) 
            return [dict(row._mapping) for row in result]
    except Exception as e:
        return {"error": f"Lỗi lấy đơn đặt: {str(e)}"}
      
@app.put("/api/bookings/update/{id}")
def update_booking_status(id: int, data: dict):
    new_status = data.get("status")
    with engine.connect() as conn:
        conn.execute(text("UPDATE Bookings SET Status = :status WHERE BookingID = :id"), {"status": new_status, "id": id})
        conn.commit()
    return {"message": "Cập nhật thành công!"}

@app.put("/api/bookings/payment-success/{booking_id}")
def update_payment_success(booking_id: int):
    try:
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE Bookings SET PaymentStatus = N'Đã thanh toán' WHERE BookingID = :id"), 
                {"id": booking_id}
            )
            conn.commit()
        return {"message": "Đã cập nhật tiền nong sòng phẳng!"}
    except Exception as e:
        return {"error": str(e)}

class BookingData(BaseModel):
    RoomID: int
    UserID: int
    FullName: str
    StartTime: str
    EndTime: str
    PaymentMethod: str = "Tiền mặt" 

@app.post("/api/bookings/add")
def create_booking(data: BookingData):
    try:
        start_time = datetime.fromisoformat(data.StartTime)
        end_time = datetime.fromisoformat(data.EndTime)
        current_time = datetime.now() 
        
        with engine.connect() as conn:
            check_query = text("""
                SELECT COUNT(*) FROM Bookings 
                WHERE RoomID = :RoomID 
                  AND Status IN (N'Chờ xác nhận', N'Đã xác nhận') 
                  AND StartTime < :NewEndTime 
                  AND EndTime > :NewStartTime
            """)
            
            overlap_count = conn.execute(check_query, {
                "RoomID": data.RoomID,
                "NewStartTime": start_time,
                "NewEndTime": end_time
            }).scalar()
            
            if overlap_count > 0:
                return {
                    "status": "error", 
                    "message": f"Phòng này đã có người xí chỗ trong khoảng thời gian đó rồi Thiên ơi, chọn ngày khác nha!"
                }

            # Lấy lại BookingID vừa chèn bằng cách dùng OUTPUT inserted.BookingID 
            insert_query = text("""
                INSERT INTO Bookings (RoomID, UserID, FullName, BookingDate, StartTime, EndTime, Status, PaymentMethod, PaymentStatus) 
                OUTPUT inserted.BookingID
                VALUES (:RoomID, :UserID, :FullName, :BookingDate, :StartTime, :EndTime, N'Chờ xác nhận', :PaymentMethod, N'Chưa thanh toán')
            """)
            
            new_booking_id = conn.execute(insert_query, {
                "RoomID": data.RoomID,
                "UserID": data.UserID,
                "FullName": data.FullName,
                "BookingDate": current_time,  
                "StartTime": start_time,
                "EndTime": end_time,
                "PaymentMethod": data.PaymentMethod 
            }).scalar()
            
            conn.commit()
            
        return {"status": "success", "message": "Đặt phòng thành công rực rỡ!", "booking_id": new_booking_id}
    except Exception as e:
        print("=========================================")
        print("LỖI DATABASE KHI ĐẶT PHÒNG:")
        print(str(e))
        print("=========================================")
        return {"status": "error", "message": str(e)}

# ==========================================
# API LẤY LỊCH SỬ ĐẶT PHÒNG CỦA RIÊNG KHÁCH HÀNG
# ==========================================
@app.get("/api/bookings/user/{user_id}")
def get_user_bookings(user_id: int):
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT b.*, r.Title as RoomTitle, r.ImageURL 
                FROM Bookings b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE b.UserID = :user_id
                ORDER BY b.BookingID DESC
            """)
            result = conn.execute(query, {"user_id": user_id}) 
            return [dict(row._mapping) for row in result]
    except Exception as e:
        return {"error": f"Lỗi lấy lịch sử: {str(e)}"}
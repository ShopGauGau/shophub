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

# 1. THÊM DÒNG NÀY ĐỂ KÉO FILE STATS.PY VÀO
from stats import router as stats_router 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Trả về localhost nè
    allow_methods=["*"],
    allow_headers=["*"],
)

# ĐĂNG KÝ ROUTER
app.include_router(auth_router)
app.include_router(rooms_router)
app.include_router(favorites_router)

# Đăng ký router cho VNPAY hoạt động
app.include_router(vnpay_router)

# 2. ĐĂNG KÝ ROUTER CHO STATS HOẠT ĐỘNG TẠI ĐÂY NÈ
app.include_router(stats_router)


# ==========================================
# PHẦN USERS: LẤY VÀ CẬP NHẬT THÔNG TIN TÀI KHOẢN
# ==========================================
class UserUpdateSchema(BaseModel):
    FullName: str
    Email: str
    Phone: str

class PasswordChangeSchema(BaseModel):
    OldPassword: str
    NewPassword: str

@app.get("/api/users/{user_id}")
def get_user_profile(user_id: int):
    try:
        with engine.connect() as conn:
            # Code mới xịn xò: Nối bảng Users và Profiles lại để lấy đủ thông tin
            query = text("""
                SELECT u.UserID, u.Username, p.FullName, p.Email, p.Phone 
                FROM Users u
                LEFT JOIN Profiles p ON u.UserID = p.UserID
                WHERE u.UserID = :id
            """)
            result = conn.execute(query, {"id": user_id}).mappings().first()
            
            if not result:
                raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản!")
            return dict(result)
    except Exception as e:
        return {"error": str(e)}

@app.put("/api/users/{user_id}/update")
def update_user_profile(user_id: int, data: UserUpdateSchema):
    try:
        with engine.begin() as conn:
            # Kiểm tra xem đã có thông tin trong bảng Profiles chưa
            check_query = text("SELECT ProfileID FROM Profiles WHERE UserID = :user_id")
            profile = conn.execute(check_query, {"user_id": user_id}).fetchone()
            
            if profile:
                # Nếu có rồi thì UPDATE vào bảng Profiles (chứ không phải Users nha!)
                update_query = text("""
                    UPDATE Profiles 
                    SET FullName = :fullname, Email = :email, Phone = :phone 
                    WHERE UserID = :user_id
                """)
                conn.execute(update_query, {
                    "fullname": data.FullName,
                    "email": data.Email,
                    "phone": data.Phone,
                    "user_id": user_id
                })
            else:
                # Nếu chưa có thì INSERT mới vào
                insert_query = text("""
                    INSERT INTO Profiles (UserID, FullName, Email, Phone) 
                    VALUES (:user_id, :fullname, :email, :phone)
                """)
                conn.execute(insert_query, {
                    "user_id": user_id,
                    "fullname": data.FullName,
                    "email": data.Email,
                    "phone": data.Phone
                })
        return {"status": "success", "message": "Cập nhật thành công!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.put("/api/users/{user_id}/change-password")
def change_user_password(user_id: int, data: PasswordChangeSchema):
    try:
        with engine.connect() as conn:
            check_query = text("SELECT Password FROM Users WHERE UserID = :user_id")
            user = conn.execute(check_query, {"user_id": user_id}).mappings().first()
            
            if not user or user["Password"] != data.OldPassword:
                return {"status": "error", "message": "Mật khẩu cũ không chính xác!"}
                
        # Riêng mật khẩu thì vẫn nằm bên bảng Users
        with engine.begin() as conn:
            update_query = text("UPDATE Users SET Password = :new_password WHERE UserID = :user_id")
            conn.execute(update_query, {
                "new_password": data.NewPassword,
                "user_id": user_id
            })
        return {"status": "success", "message": "Đổi mật khẩu thành công!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


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
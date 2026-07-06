from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from pydantic import BaseModel
from database import engine  
from auth import router as auth_router 
from rooms import router as rooms_router
from datetime import datetime # Dùng để xử lý ngày giờ
from favorites import router as favorites_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ĐĂNG KÝ ROUTER
app.include_router(auth_router)
app.include_router(rooms_router)
app.include_router(favorites_router)

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
# PHẦN ADMIN: Rooms
# ==========================================
@app.delete("/api/rooms/delete/{id}")
def delete_room(id: int, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới có quyền xóa phòng nha ní!")
        
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM Rooms WHERE RoomID = :id"), {"id": id})
            conn.commit()
        return {"message": "Đã xóa phòng thành công khỏi hệ thống!"}
    except Exception as e:
        return {"error": f"Lỗi rùi ní ơi: {str(e)}"}

class RoomData(BaseModel):
    Title: str
    Price: float
    Area: float = 0.0            
    District: str = ""           
    Address: str = ""            
    ImageURL: str = ""           
    Description: str = ""        

@app.post("/api/rooms/add")
def add_room(room: RoomData, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới được thêm phòng!")
        
    try:
        with engine.connect() as conn:
            query = text("""
                INSERT INTO Rooms (Title, Price, Area, District, Address, ImageURL, Description) 
                VALUES (:Title, :Price, :Area, :District, :Address, :ImageURL, :Description)
            """)
            conn.execute(query, {
                "Title": room.Title, 
                "Price": room.Price, 
                "Area": room.Area,
                "District": room.District,
                "Address": room.Address,
                "ImageURL": room.ImageURL,
                "Description": room.Description
            })
            conn.commit()
        return {"message": "Đã thêm phòng mới full thông tin thành công rực rỡ!"}
    except Exception as e:
        return {"error": f"Lỗi rùi ní ơi: {str(e)}"}

@app.put("/api/rooms/edit/{id}")
def edit_room(id: int, room: RoomData, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới được sửa phòng!")
        
    try:
        with engine.connect() as conn:
            query = text("""
                UPDATE Rooms 
                SET Title = :Title, Price = :Price, Area = :Area, 
                    District = :District, Address = :Address, 
                    ImageURL = :ImageURL, Description = :Description
                WHERE RoomID = :id
            """)
            conn.execute(query, {
                "Title": room.Title, 
                "Price": room.Price, 
                "Area": room.Area,
                "District": room.District,
                "Address": room.Address,
                "ImageURL": room.ImageURL,
                "Description": room.Description,
                "id": id
            })
            conn.commit()
        return {"message": "Đã cập nhật phòng thành công!"}
    except Exception as e:
        return {"error": f"Lỗi rùi ní ơi: {str(e)}"}
 
# ==========================================
# PHẦN BOOKINGS (ĐẶT PHÒNG)
# ==========================================

# ---> TUI ĐÃ SỬA KHÚC NÀY NÈ NÍ <---
@app.get("/api/bookings")
def get_all_bookings():
    try:
        with engine.connect() as conn:
            # Dùng JOIN để móc thêm cái Title từ bảng Rooms ra
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

class BookingData(BaseModel):
    RoomID: int
    UserID: int
    FullName: str
    StartTime: str
    EndTime: str
    
@app.post("/api/bookings/add")
def create_booking(data: BookingData):
    try:
        # Ép kiểu dữ liệu thời gian cho chuẩn
        start_time = datetime.fromisoformat(data.StartTime)
        end_time = datetime.fromisoformat(data.EndTime)
        
        # Lấy giờ hiện tại chèn thẳng vào BookingDate để SQL khỏi báo lỗi
        current_time = datetime.now() 
        
        with engine.connect() as conn:
            # ==========================================
            # BƯỚC 1: KIỂM TRA TRÙNG LỊCH TRƯỚC KHI LƯU
            # ==========================================
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

            # ==========================================
            # BƯỚC 2: TIẾN HÀNH LƯU
            # ==========================================
            query = text("""
                INSERT INTO Bookings (RoomID, UserID, FullName, BookingDate, StartTime, EndTime, Status) 
                VALUES (:RoomID, :UserID, :FullName, :BookingDate, :StartTime, :EndTime, 'Chờ xác nhận')
            """)
            
            conn.execute(query, {
                "RoomID": data.RoomID,
                "UserID": data.UserID,
                "FullName": data.FullName,
                "BookingDate": current_time,  
                "StartTime": start_time,
                "EndTime": end_time
            })
            conn.commit()
            
        return {"status": "success", "message": "Đặt phòng thành công rực rỡ!"}
    except Exception as e:
        # In lỗi ra Terminal to rõ ràng
        print("=========================================")
        print("LỖI DATABASE KHI ĐẶT PHÒNG:")
        print(str(e))
        print("=========================================")
        return {"status": "error", "message": str(e)}
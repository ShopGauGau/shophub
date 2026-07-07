from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from database import engine

router = APIRouter()

# ==========================================
# 1. KHAI BÁO FORM DATA (Nhớ có MapURL nha ní)
# ==========================================
class RoomData(BaseModel):
    Title: str
    Price: float
    Area: float = 0.0            
    District: str = ""           
    Address: str = ""            
    ImageURL: str = ""           
    Description: str = ""   
    MapURL: str = ""  # <--- Cột bản đồ mới toanh nằm đây nè

# ==========================================
# 2. HÀM THÊM PHÒNG MỚI (Admin)
# ==========================================
@router.post("/api/rooms/add")
def add_room(room: RoomData, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới được thêm phòng!")
        
    try:
        with engine.connect() as conn:
            query = text("""
                INSERT INTO Rooms (Title, Price, Area, District, Address, ImageURL, Description, MapURL) 
                VALUES (:Title, :Price, :Area, :District, :Address, :ImageURL, :Description, :MapURL)
            """)
            conn.execute(query, {
                "Title": room.Title, 
                "Price": room.Price, 
                "Area": room.Area,
                "District": room.District,
                "Address": room.Address,
                "ImageURL": room.ImageURL,
                "Description": room.Description,
                "MapURL": room.MapURL if room.MapURL else "" # Nếu trống thì lưu chuỗi rỗng
            })
            conn.commit()
        return {"status": "success", "message": "Đã thêm phòng mới thành công rực rỡ!"}
    except Exception as e:
        return {"status": "error", "message": f"Lỗi thêm phòng: {str(e)}"}

# ==========================================
# 3. HÀM SỬA PHÒNG (Admin)
# ==========================================
@router.put("/api/rooms/edit/{id}")
def edit_room(id: int, room: RoomData, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới được sửa phòng!")
        
    try:
        with engine.connect() as conn:
            query = text("""
                UPDATE Rooms 
                SET Title = :Title, Price = :Price, Area = :Area, 
                    District = :District, Address = :Address, 
                    ImageURL = :ImageURL, Description = :Description, MapURL = :MapURL
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
                "MapURL": room.MapURL if room.MapURL else "",
                "id": id
            })
            conn.commit()
        return {"status": "success", "message": "Đã cập nhật thông tin phòng thành công!"}
    except Exception as e:
        return {"status": "error", "message": f"Lỗi sửa phòng: {str(e)}"}

# ==========================================
# 4. HÀM XÓA PHÒNG (Đã fix lỗi liên kết bảng)
# ==========================================
@router.delete("/api/rooms/delete/{id}")
def delete_room(id: int, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới có quyền xóa phòng nha ní!")
        
    try:
        with engine.connect() as conn:
            # Bước 1: Xóa lịch sử đặt phòng trong bảng Bookings trước để tránh lỗi ràng buộc
            conn.execute(text("DELETE FROM Bookings WHERE RoomID = :id"), {"id": id})
            
            # Bước 2: Xóa lượt thả tim lưu phòng trong bảng Favorites
            conn.execute(text("DELETE FROM Favorites WHERE RoomID = :id"), {"id": id})
            
            # Bước 3: Đã sạch sẽ nợ nần, tiến hành trảm cái phòng!
            conn.execute(text("DELETE FROM Rooms WHERE RoomID = :id"), {"id": id})
            conn.commit()
        return {"status": "success", "message": "Đã dọn dẹp sạch sẽ và xóa phòng khỏi hệ thống!"}
    except Exception as e:
        return {"status": "error", "message": f"Lỗi xóa phòng: {str(e)}"}
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from database import engine
from typing import Optional

router = APIRouter()

# ==========================================
# 1. KHAI BÁO FORM DATA (Đã thêm cột SalerID)
# ==========================================
class RoomData(BaseModel):
    Title: str
    Price: float
    Area: float = 0.0            
    District: str = ""           
    Address: str = ""            
    ImageURL: str = ""           
    Description: str = ""   
    MapURL: str = ""  
    SalerID: Optional[int] = None # <-- Cột mới để lưu mã nhân viên quản lý phòng này

# ==========================================
# 2. HÀM THÊM PHÒNG MỚI (Admin & Saler)
# ==========================================
@router.post("/api/rooms/add")
def add_room(room: RoomData, role: str = Header(None), user_id: str = Header(None)):
    # Phân quyền: Cả Admin (1) và Saler (2) đều được quyền thêm phòng mới
    if role not in ["1", "2"]:
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin hoặc Saler mới được thêm phòng!")
        
    try:
        # Nếu là Saler thêm phòng, tự động lấy luôn UserID của chính họ làm SalerID cho phòng đó
        assigned_saler = int(user_id) if role == "2" else room.SalerID

        with engine.connect() as conn:
            query = text("""
                INSERT INTO Rooms (Title, Price, Area, District, Address, ImageURL, Description, MapURL, SalerID) 
                VALUES (:Title, :Price, :Area, :District, :Address, :ImageURL, :Description, :MapURL, :SalerID)
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
                "SalerID": assigned_saler # Gán ID thực tế lấy từ database vô đây ní ơi
            })
            conn.commit()
        return {"status": "success", "message": "Đã thêm phòng mới thành công rực rỡ!"}
    except Exception as e:
        return {"status": "error", "message": f"Lỗi thêm phòng: {str(e)}"}

# ==========================================
# 3. HÀM SỬA PHÒNG (Admin & Saler)
# ==========================================
@router.put("/api/rooms/edit/{id}")
def edit_room(id: int, room: RoomData, role: str = Header(None), user_id: str = Header(None)):
    if role not in ["1", "2"]:
        raise HTTPException(status_code=403, detail="Cảnh báo: Không có quyền sửa phòng nha ní!")
        
    try:
        with engine.connect() as conn:
            # BẢO MẬT: Nếu là Saler, phải kiểm tra xem phòng này có đúng là của họ quản lý không
            if role == "2":
                check_owner = text("SELECT SalerID FROM Rooms WHERE RoomID = :id")
                current_saler = conn.execute(check_owner, {"id": id}).scalar()
                if current_saler != int(user_id):
                    raise HTTPException(status_code=403, detail="Bạn không được phép sửa phòng của người khác!")

            # Xác định ai sẽ quản lý tiếp (Admin sửa có thể đổi Saler khác, Saler sửa thì giữ nguyên của họ)
            assigned_saler = room.SalerID if role == "1" else int(user_id)

            query = text("""
                UPDATE Rooms 
                SET Title = :Title, Price = :Price, Area = :Area, 
                    District = :District, Address = :Address, 
                    ImageURL = :ImageURL, Description = :Description, 
                    MapURL = :MapURL, SalerID = :SalerID
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
                "SalerID": assigned_saler,
                "id": id
            })
            conn.commit()
        return {"status": "success", "message": "Đã cập nhật thông tin phòng thành công!"}
    except HTTPException as he:
        raise he
    except Exception as e:
        return {"status": "error", "message": f"Lỗi sửa phòng: {str(e)}"}

# ==========================================
# 4. HÀM XÓA PHÒNG (Đã tích hợp phân quyền Saler)
# ==========================================
@router.delete("/api/rooms/delete/{id}")
def delete_room(id: int, role: str = Header(None), user_id: str = Header(None)):
    if role not in ["1", "2"]:
        raise HTTPException(status_code=403, detail="Cảnh báo: Bạn không có quyền xóa phòng trên hệ thống!")
        
    try:
        with engine.connect() as conn:
            # BẢO MẬT: Nếu là Saler, cũng phải check xem có sở hữu phòng này để xóa không
            if role == "2":
                check_owner = text("SELECT SalerID FROM Rooms WHERE RoomID = :id")
                current_saler = conn.execute(check_owner, {"id": id}).scalar()
                if current_saler != int(user_id):
                    raise HTTPException(status_code=403, detail="Bạn không được phép xóa phòng của Saler khác quản lý!")

            # Bước 1: Xóa lịch sử đặt phòng trong bảng Bookings trước để tránh lỗi ràng buộc
            conn.execute(text("DELETE FROM Bookings WHERE RoomID = :id"), {"id": id})
            
            # Bước 2: Xóa lượt thả tim lưu phòng trong bảng Favorites
            conn.execute(text("DELETE FROM Favorites WHERE RoomID = :id"), {"id": id})
            
            # Bước 3: Đã sạch sẽ nợ nần, tiến hành trảm cái phòng!
            conn.execute(text("DELETE FROM Rooms WHERE RoomID = :id"), {"id": id})
            conn.commit()
        return {"status": "success", "message": "Đã dọn dẹp sạch sẽ và xóa phòng khỏi hệ thống!"}
    except HTTPException as he:
        raise he
    except Exception as e:
        return {"status": "error", "message": f"Lỗi xóa phòng: {str(e)}"}
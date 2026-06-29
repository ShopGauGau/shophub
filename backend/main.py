from fastapi import FastAPI, Header, HTTPException # Thêm Header và HTTPException vô nha
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from pydantic import BaseModel # Thêm thư viện này để nhận dữ liệu phòng gửi lên nè ní
from database import engine  # Lấy engine từ file database.py
from auth import router as auth_router # Import router từ auth.py
from rooms import router as rooms_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ĐĂNG KÝ ROUTER AUTH (Cực kỳ quan trọng để hết lỗi 404)
app.include_router(auth_router)
# Tui đã xóa bớt 1 dòng auth bị dư ở đây nha ní
app.include_router(rooms_router)

# Route lấy danh sách phòng
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

# Route lấy chi tiết 1 phòng theo ID
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
# PHẦN ADMIN: Route Xóa phòng
# ==========================================
@app.delete("/api/rooms/delete/{id}")
def delete_room(id: int, role: str = Header(None)):
    # Block ngay nếu không phải Admin (Role = "1")
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới có quyền xóa phòng nha ní!")
        
    try:
        with engine.connect() as conn:
            # Thực thi lệnh xóa
            conn.execute(text("DELETE FROM Rooms WHERE RoomID = :id"), {"id": id})
            conn.commit()
        return {"message": "Đã xóa phòng thành công khỏi hệ thống!"}
    except Exception as e:
        return {"error": f"Lỗi rùi ní ơi: {str(e)}"}

# ==========================================
# PHẦN ADMIN: Route Thêm phòng mới
# ==========================================
# Khai báo cấu trúc dữ liệu phòng gửi lên (Nhiều trường hơn)
class RoomData(BaseModel):
    Title: str
    Price: float
    Area: float = 0.0             # Diện tích
    District: str = ""            # Quận/Huyện
    Address: str = ""             # Địa chỉ chi tiết
    ImageURL: str = ""            # Link hình ảnh
    Description: str = ""         # Mô tả

@app.post("/api/rooms/add")
def add_room(room: RoomData, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới được thêm phòng!")
        
    try:
        with engine.connect() as conn:
            # Câu lệnh Insert vô Database cập nhật thêm các cột mới
            query = text("""
                INSERT INTO Rooms (Title, Price, Area, District, Address, ImageURL, Description) 
                VALUES (:Title, :Price, :Area, :District, :Address, :ImageURL, :Description)
            """)
            
            # Truyền dữ liệu vô
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
    # ==========================================
# PHẦN ADMIN: Route Sửa phòng
# ==========================================
@app.put("/api/rooms/edit/{id}")
def edit_room(id: int, room: RoomData, role: str = Header(None)):
    if role != "1":
        raise HTTPException(status_code=403, detail="Cảnh báo: Chỉ Admin mới được sửa phòng!")
        
    try:
        with engine.connect() as conn:
            # Câu lệnh UPDATE cập nhật lại dữ liệu
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
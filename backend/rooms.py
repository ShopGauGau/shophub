# rooms.py
from fastapi import APIRouter, HTTPException, Header
from sqlalchemy import text
from database import engine

router = APIRouter()

# Route lấy danh sách phòng
@router.get("/api/rooms")
def get_rooms():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM Rooms"))
        return [dict(row._mapping) for row in result]

# Route xóa phòng (Chỉ Admin mới dùng được)
@router.delete("/api/rooms/delete/{id}")
def delete_room(id: int, role: str = Header(None)):
    # Kiểm tra quyền: Chỉ role == "1" (Admin) mới cho xóa
    if role != "1":
        raise HTTPException(status_code=403, detail="Ní không phải Admin, cấm vô đây nha!")
    
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM Rooms WHERE RoomID = :id"), {"id": id})
        conn.commit()
    return {"message": "Xóa phòng thành công!"}
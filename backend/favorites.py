from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from database import engine

# Khởi tạo router riêng cho phần Yêu thích
router = APIRouter()

class FavoriteData(BaseModel):
    UserID: int
    RoomID: int

# 1. API thả tim / hủy tim
@router.post("/api/favorites/toggle")
def toggle_favorite(data: FavoriteData):
    try:
        with engine.connect() as conn:
            check_query = text("SELECT COUNT(*) FROM Favorites WHERE UserID = :UserID AND RoomID = :RoomID")
            is_saved = conn.execute(check_query, {"UserID": data.UserID, "RoomID": data.RoomID}).scalar()

            if is_saved > 0:
                conn.execute(text("DELETE FROM Favorites WHERE UserID = :UserID AND RoomID = :RoomID"), 
                             {"UserID": data.UserID, "RoomID": data.RoomID})
                conn.commit()
                return {"status": "removed", "message": "Đã bỏ lưu phòng!"}
            else:
                conn.execute(text("INSERT INTO Favorites (UserID, RoomID) VALUES (:UserID, :RoomID)"), 
                             {"UserID": data.UserID, "RoomID": data.RoomID})
                conn.commit()
                return {"status": "added", "message": "Đã lưu vô danh sách yêu thích!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# 2. API kiểm tra lúc vô phòng xem đã tim chưa
@router.get("/api/favorites/check")
def check_favorite(user_id: int, room_id: int):
    try:
        with engine.connect() as conn:
            query = text("SELECT COUNT(*) FROM Favorites WHERE UserID = :user_id AND RoomID = :room_id")
            is_saved = conn.execute(query, {"user_id": user_id, "room_id": room_id}).scalar()
            return {"is_favorite": is_saved > 0}
    except Exception as e:
        return {"error": str(e)}

# 3. API lấy toàn bộ phòng đã lưu (để dành mốt làm trang Danh sách)
@router.get("/api/favorites/user/{user_id}")
def get_user_favorites(user_id: int):
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT r.* FROM Rooms r
                JOIN Favorites f ON r.RoomID = f.RoomID
                WHERE f.UserID = :user_id
            """)
            result = conn.execute(query, {"user_id": user_id})
            return [dict(row._mapping) for row in result]
    except Exception as e:
        return {"error": str(e)}
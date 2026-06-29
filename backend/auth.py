# auth.py
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from database import engine

router = APIRouter()

class UserAuth(BaseModel):
    username: str
    password: str

@router.post("/api/login")
async def login(user: UserAuth):
    with engine.connect() as conn:
        query = text("SELECT Password, RoleID FROM Users WHERE Username = :u")
        result = conn.execute(query, {"u": user.username}).fetchone()
        
        if result:
            stored_password, role_id = result
            if user.password == stored_password:
                return {"message": "Đăng nhập thành công!", "role": role_id}
        
        return {"message": "Sai tên đăng nhập hoặc mật khẩu!"}

@router.post("/api/register")
async def register(user: UserAuth):
    with engine.connect() as conn:
        # Kiểm tra xem user đã tồn tại chưa
        check_query = text("SELECT Username FROM Users WHERE Username = :u")
        exists = conn.execute(check_query, {"u": user.username}).fetchone()
        
        if exists:
            return {"message": "Tên này có người lấy rồi ní ơi!"}
        
        # Thêm user mới (RoleID = 2 là User thường)
        insert_query = text("INSERT INTO Users (Username, Password, RoleID) VALUES (:u, :p, 2)")
        conn.execute(insert_query, {"u": user.username, "p": user.password})
        conn.commit() 
        
        return {"message": "Đăng ký thành công! Ní đăng nhập luôn đi!"}
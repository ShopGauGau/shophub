from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from database import engine

router = APIRouter()

class UserAuth(BaseModel):
    username: str
    password: str

# Khai báo thêm model mới cho Saler (Có Email, SĐT)
class SalerRegister(BaseModel):
    username: str
    password: str
    email: str
    phone: str

# ==========================================
# 1. API ĐĂNG NHẬP (Chặn tài khoản đang chờ duyệt & Bị khóa)
# ==========================================
@router.post("/api/login")
async def login(user: UserAuth):
    with engine.connect() as conn:
        # Tui thêm cột Status vô đây để lấy dưới Database lên nè ní
        query = text("SELECT UserID, Password, RoleID, Status FROM Users WHERE Username = :u")
        result = conn.execute(query, {"u": user.username}).fetchone()
        
        if result:
            # Nhớ bung thêm biến status ra để hứng dữ liệu
            user_id, stored_password, role_id, status = result
            if user.password == stored_password:
                
                # CHẶN ĐỨNG TÀI KHOẢN BỊ KHÓA TẠI ĐÂY LUN
                if status == "locked":
                    return {"message": "Tài khoản của bạn đã bị khóa !"}
                
                # NẾU ROLE = 4 THÌ BÁO LỖI ĐANG CHỜ DUYỆT
                if role_id == 4:
                    return {"message": "Tài khoản của bạn đang chờ Admin duyệt, ráng đợi xíu nha!"}
                
                return {
                    "message": "Đăng nhập thành công!", 
                    "role": role_id, 
                    "UserID": user_id,
                    "username": user.username
                }
        
        return {"message": "Sai tên đăng nhập hoặc mật khẩu!"}

# ==========================================
# 2. API ĐĂNG KÝ CHO KHÁCH HÀNG (MẶC ĐỊNH ROLEID = 3)
# ==========================================
@router.post("/api/register")
async def register(user: UserAuth):
    with engine.connect() as conn:
        check_query = text("SELECT Username FROM Users WHERE Username = :u")
        exists = conn.execute(check_query, {"u": user.username}).fetchone()
        if exists:
            return {"message": "Tên này có người lấy rồi ní ơi!"}
        
        insert_query = text("INSERT INTO Users (Username, Password, RoleID) VALUES (:u, :p, 3)")
        conn.execute(insert_query, {"u": user.username, "p": user.password})
        conn.commit() 
        return {"message": "Đăng ký thành công! Ní đăng nhập luôn đi!"}

# ==========================================
# 3. API ĐĂNG KÝ SALER (ÉP CỨNG ROLEID = 4 VÀ LƯU THÊM PROFILE)
# ==========================================
@router.post("/api/auth/register-saler")
async def register_saler(user: SalerRegister):
    with engine.begin() as conn:
        # 1. Kiểm tra username
        check_query = text("SELECT Username FROM Users WHERE Username = :u")
        exists = conn.execute(check_query, {"u": user.username}).fetchone()
        if exists:
            return {"message": "Tên này có người lấy rồi ní ơi!"}
        
        # 2. Thêm User với RoleID = 4 (Đang chờ duyệt) và lấy về UserID mới tạo
        insert_user = text("""
            INSERT INTO Users (Username, Password, RoleID) 
            OUTPUT inserted.UserID 
            VALUES (:u, :p, 4)
        """)
        new_user_id = conn.execute(insert_user, {"u": user.username, "p": user.password}).scalar()
        
        # 3. Lưu Email và SĐT vào bảng Profiles luôn
        insert_profile = text("""
            INSERT INTO Profiles (UserID, Email, Phone, FullName) 
            VALUES (:uid, :email, :phone, N'Chưa cập nhật')
        """)
        conn.execute(insert_profile, {"uid": new_user_id, "email": user.email, "phone": user.phone})
        
        return {"message": "Đăng ký thành công! Hồ sơ của bạn đã được gửi cho Admin duyệt."}
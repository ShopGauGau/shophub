import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 1. Import Link từ react-router-dom

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
        const res = await axios.post('http://127.0.0.1:8000/api/login', { username, password });
        
        if (res.data.role) {
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("username", username);
            
            // THAY VÌ LƯU LẦM TẦM BẬY, NÍ PHẢI DÙNG DỮ LIỆU TỪ BACKEND TRẢ VỀ
            // Ní check cái console.log(res.data) xem ID của nó nằm ở đâu
            // Thường nó sẽ là res.data.UserID hoặc res.data.id
            const realId = res.data.UserID || res.data.id; 
            localStorage.setItem("userId", realId); 
            
            window.location.href = "/";
        } else {
            alert(res.data.message); 
        }
    } catch (err) {
        alert("Lỗi kết nối rồi ní ơi!");
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">Đăng nhập RoomHub</h2>
        
        <input 
          className="w-full p-3 mb-4 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)} 
        />
        
        <input 
          className="w-full p-3 mb-4 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
          type="password" 
          placeholder="Mật khẩu" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <button 
          onClick={handleLogin} 
          className="w-full bg-teal-600 text-white p-3 rounded-xl font-bold hover:bg-teal-700 transition"
        >
          Đăng nhập
        </button>

        {/* 2. Thêm link chuyển hướng sang trang đăng ký */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản? 
          <Link to="/register" className="text-teal-600 font-bold ml-1 hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
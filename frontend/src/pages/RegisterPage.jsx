import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post('https://shophub-qxpt.onrender.com/api/register', { username, password });
      
      // Kiểm tra xem đăng ký thành công chưa (dựa vào message từ backend)
      if (res.data.message === "Đăng ký thành công! Ní đăng nhập luôn đi!") {
        window.location.href = "/login"; // Vô thẳng trang Đăng nhập luôn
      } else {
        alert(res.data.message); // Nếu trùng tên thì báo lỗi cho người ta biết
      }
    } catch (err) {
      alert("Lỗi kết nối rồi ní ơi!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">Đăng ký tài khoản</h2>
        <input className="w-full p-3 mb-4 border rounded-xl" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full p-3 mb-4 border rounded-xl" type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister} className="w-full bg-teal-600 text-white p-3 rounded-xl font-bold hover:bg-teal-700 transition">Đăng ký</button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản? <a href="/login" className="text-teal-600 font-bold">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;
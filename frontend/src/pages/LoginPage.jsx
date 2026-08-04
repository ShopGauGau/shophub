import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://roomhub-api.onrender.com/api/login', formData)
      .then((res) => {
        const data = res.data;

        if (data.role) {
          // Lưu dữ liệu đăng nhập vào LocalStorage
          localStorage.setItem('userId', data.UserID);
          localStorage.setItem('role', data.role);
          localStorage.setItem('username', data.username);

          alert("Đăng nhập thành công!");

          // Chuyển hướng thông minh dựa vào RoleID
          if (data.role === 1 || data.role === "1") {
            window.location.href = '/admin-dashboard';
          } else if (data.role === 2 || data.role === "2") {
            window.location.href = '/saler-dashboard';
          } else {
            window.location.href = '/';
          }
        } else {
          alert(data.message || "Đăng nhập thất bại!");
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Lỗi hệ thống đăng nhập!");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-6">Đăng nhập RoomHub</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Username" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Mật khẩu" />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-teal-200">
            Đăng nhập
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản? <Link to="/register" className="text-teal-600 font-bold hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
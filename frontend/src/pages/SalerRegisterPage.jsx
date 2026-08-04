import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SalerRegisterPage = () => {
  // Thêm email và phone vào State
  const [formData, setFormData] = useState({ 
    username: '', password: '', confirmPassword: '', email: '', phone: '' 
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp kìa ní!");
      return;
    }

    // Truyền đủ 4 trường qua Backend
    axios.post('https://roomhub-api.onrender.com/api/auth/register-saler', {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: formData.phone
    })
    .then((res) => {
      alert(res.data.message); // Báo thành công, chờ duyệt
      navigate('/login');
    })
    .catch(err => alert(err.response?.data?.detail || "Lỗi đăng ký saler!"));
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-indigo-50 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-indigo-600">
        <div className="text-center mb-8">
          <span className="text-5xl">💼</span>
          <h2 className="text-3xl font-black text-indigo-900 mt-4">Trở Thành Saler</h2>
          <p className="text-gray-500 mt-2 text-sm">Điền thông tin bên dưới để gửi hồ sơ xét duyệt tài khoản bán hàng.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tên đăng nhập Saler"
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Địa chỉ Email (Bắt buộc)"
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Số điện thoại liên hệ"
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 mt-2 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]">
            Gửi Hồ Sơ Xét Duyệt
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Đã có tài khoản saler? <Link to="/login" className="text-indigo-600 font-bold">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
};

export default SalerRegisterPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Trạng thái đóng/mở Modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // State cho form Cập nhật thông tin
  const [updateForm, setUpdateForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  // State cho form Đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const userId = localStorage.getItem('userId');

  // 1. Lấy thông tin user khi vào trang
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/users/${userId}`)
      .then(res => {
        setUserInfo(res.data);
        setUpdateForm({
          fullName: res.data.FullName || '',
          email: res.data.Email || '',
          phone: res.data.Phone || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy thông tin user:", err);
        setLoading(false);
      });
  }, [userId]);

  // 2. Xử lý lưu Cập nhật thông tin
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/users/${userId}/update`, {
        FullName: updateForm.fullName,
        Email: updateForm.email,
        Phone: updateForm.phone
      });

      if (res.data.status === 'success') {
        alert("Cập nhật thông tin thành công rồi ní ơi! 🎉");
        setUserInfo({
          ...userInfo,
          FullName: updateForm.fullName,
          Email: updateForm.email,
          Phone: updateForm.phone
        });
        setShowUpdateModal(false);
      } else {
        alert("Có lỗi xảy ra: " + res.data.message);
      }
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  // 3. Xử lý Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới nhập lại không khớp nha ní!");
      return;
    }

    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/users/${userId}/change-password`, {
        OldPassword: passwordForm.oldPassword,
        NewPassword: passwordForm.newPassword
      });

      if (res.data.status === 'success') {
        alert("Đổi mật khẩu thành công rực rỡ! 🔐");
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
      } else {
        alert("Lỗi: " + res.data.message);
      }
    } catch (error) {
      alert("Mật khẩu cũ không chính xác hoặc lỗi kết nối!");
    }
  };

  if (loading) return <div className="text-center py-10 font-bold text-gray-600">Đang tải thông tin cá nhân...</div>;
  if (!userId) return (
    <div className="text-center py-10">
      <p className="text-red-500 font-bold text-lg">Ní chưa đăng nhập tài khoản nha!</p>
      <Link to="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Đăng nhập ngay</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Thông tin tài khoản</h2>

      {/* Thẻ hiển thị thông tin */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">Tên đăng nhập</p>
            <p className="font-bold text-lg text-gray-800">{userInfo?.Username}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">Họ và tên</p>
            <p className="font-bold text-lg text-gray-800">{userInfo?.FullName || 'Chưa cập nhật'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">Địa chỉ Email</p>
            <p className="font-bold text-lg text-gray-800">{userInfo?.Email || 'Chưa cập nhật'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">Số điện thoại</p>
            <p className="font-bold text-lg text-gray-800">{userInfo?.Phone || 'Chưa cập nhật'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 md:col-span-2">
            <p className="text-gray-500 text-sm">Mật khẩu tài khoản</p>
            <p className="font-bold text-lg text-gray-800">••••••••</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowUpdateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
          >
            ✏️ Cập nhật thông tin
          </button>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all"
          >
            🔐 Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* Điều hướng nhanh */}
      <div className="flex gap-4">
        <Link to="/favorites" className="flex-1 text-center p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold hover:bg-red-100 transition">
          ❤️ Phòng đã lưu
        </Link>
        <Link to="/my-bookings" className="flex-1 text-center p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600 font-bold hover:bg-blue-100 transition">
          📅 Lịch sử đặt phòng
        </Link>
      </div>

      {/* ================= MODAL CẬP NHẬT THÔNG TIN ================= */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold">Cập nhật thông tin</h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-3xl font-bold hover:text-red-200 leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdateInfo} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  value={updateForm.fullName} 
                  onChange={(e) => setUpdateForm({...updateForm, fullName: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={updateForm.email} 
                  onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                <input 
                  type="text" 
                  value={updateForm.phone} 
                  onChange={(e) => setUpdateForm({...updateForm, phone: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-md mt-2">
                💾 Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL ĐỔI MẬT KHẨU ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-red-500 p-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold">Đổi mật khẩu</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-3xl font-bold hover:text-red-200 leading-none">&times;</button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Mật khẩu cũ</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nhập lại mật khẩu mới</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-md mt-2">
                🔑 Xác nhận đổi mật khẩu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
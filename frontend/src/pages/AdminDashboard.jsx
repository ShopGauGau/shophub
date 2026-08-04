import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPage from './AdminPage';
import AdminBookingsPage from './AdminBookingsPage';
// 1. IMPORT CÁI COMPONENT THỐNG KÊ CHI TIẾT VÀO ĐÂY NÈ NÍ
import DashboardStats from './DashboardStats'; 
// IMPORT THÊM CÁI TRANG QUẢN LÝ TÀI KHOẢN MỚI LÀM NÈ
import AdminUsersPage from './AdminUsersPage';

const AdminDashboard = () => {
  // Đổi trạng thái mặc định thành 'stats' để vừa vào là hiện thống kê liền
  const [activeTab, setActiveTab] = useState('stats');
  const [pendingSalers, setPendingSalers] = useState([]);
  const userRole = localStorage.getItem('role') || '1';

  const fetchPendingSalers = () => {
    axios.get('https://roomhub-api.onrender.com/api/admin/pending-salers', { headers: { role: userRole } })
      .then(res => setPendingSalers(res.data))
      .catch(err => console.error("Lỗi lấy danh sách saler:", err));
  };

  useEffect(() => {
    fetchPendingSalers();
  }, []);

  const handleApprove = (userId) => {
    if (window.confirm("Ní có chắc muốn cấp quyền Saler cho tài khoản này không?")) {
      axios.put(`https://roomhub-api.onrender.com/api/admin/approve-saler/${userId}`, {}, { headers: { role: userRole } })
        .then(res => {
          alert(res.data.message);
          fetchPendingSalers();
        })
        .catch(err => alert("Lỗi duyệt: " + (err.response?.data?.detail || err.message)));
    }
  };

  return (
    <div className="flex min-h-[85vh] bg-gray-50 border-t border-gray-200">
      
      {/* SIDEBAR DÀNH CHO ADMIN TỐI CAO */}
      <div className="w-64 bg-blue-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 text-center border-b border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300">Admin Panel</h2>
          <p className="text-sm text-gray-400 mt-1">Quản trị toàn hệ thống</p>
        </div>

        <div className="flex-1 py-6 px-4 space-y-3">
          {/* NÚT 1: TỔNG QUAN THỐNG KÊ MỚI QUAY TRỞ LẠI */}
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'stats' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-blue-800'
            }`}
          >
            📊 Tổng Quan Thống Kê
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'rooms' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-blue-800'
            }`}
          >
            🏠 Quản lý Phòng
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'bookings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-blue-800'
            }`}
          >
            📋 Quản lý Đơn Đặt
          </button>

          <button
            onClick={() => setActiveTab('salers')}
            className={`w-full flex justify-between items-center px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'salers' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:bg-blue-800'
            }`}
          >
            <div className="flex items-center gap-3">💼 Duyệt Saler</div>
            {pendingSalers.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">{pendingSalers.length}</span>
            )}
          </button>

          {/* NÚT MỚI THÊM: QUẢN LÝ TÀI KHOẢN */}
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'users' ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-400 hover:bg-blue-800'
            }`}
          >
            👥 Quản Lý Tài Khoản
          </button>
        </div>
      </div>

      {/* NỘI DUNG HIỂN THỊ BIẾN HÌNH THEO TAB */}
      <div className="flex-1 overflow-x-hidden relative p-4">
        {/* TAB 1: GỌI LẠI HỒN CỦA THỐNG KÊ CHI TIẾT */}
        {activeTab === 'stats' && <DashboardStats />}

        {activeTab === 'rooms' && <AdminPage />}
        {activeTab === 'bookings' && <AdminBookingsPage />}
        
        {/* HIỆN TRANG QUẢN LÝ TÀI KHOẢN KHI BẤM NÚT */}
        {activeTab === 'users' && <AdminUsersPage />}
        
        {/* KHU VỰC DUYỆT SALER */}
        {activeTab === 'salers' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Duyệt Hồ Sơ Saler Mới</h2>
              <p className="text-gray-500">Phê duyệt cấp quyền đăng phòng cho các đối tác mới đăng ký.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Tên đăng nhập</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Số điện thoại</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingSalers.map((saler) => (
                    <tr key={saler.UserID} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-gray-500">#{saler.UserID}</td>
                      <td className="p-4 font-bold text-gray-800">{saler.Username}</td>
                      <td className="p-4 text-blue-600">{saler.Email}</td>
                      <td className="p-4 font-mono">{saler.Phone}</td>
                      <td className="p-4">
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Chờ duyệt</span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleApprove(saler.UserID)}
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-700 shadow transition-colors"
                        >
                          ✅ Duyệt Ngay
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingSalers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">Hiện tại không có hồ sơ Saler nào cần duyệt! 🎉</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
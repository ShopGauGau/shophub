import React, { useState } from 'react';
import AdminPage from './AdminPage';
import AdminBookingsPage from './AdminBookingsPage';
// 1. IMPORT TRANG THỐNG KÊ MỚI VÀO ĐÂY NÈ
import DashboardStats from './DashboardStats';

const AdminDashboard = () => {
  // Tui đổi mặc định khi vừa vào là hiện tab thống kê luôn cho nó ngầu
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="flex min-h-[85vh] bg-gray-50 border-t border-gray-200">
      
      {/* CỘT MENU BÊN TRÁI (SIDEBAR) */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-blue-400">Admin Panel</h2>
          <p className="text-sm text-gray-400 mt-1">Trung tâm điều hành</p>
        </div>

        <div className="flex-1 py-6 px-4 space-y-3">
          
          {/* NÚT THỐNG KÊ (MỚI THÊM) */}
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'stats'
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 transform scale-105'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">📊</span>
            Thống kê tổng quan
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'rooms'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 transform scale-105'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">🏠</span>
            Quản lý Phòng trọ
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'bookings'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 transform scale-105'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">📅</span>
            Quản lý Đơn đặt
          </button>
        </div>
        
        <div className="p-4 text-center text-xs text-gray-600 border-t border-gray-800">
          RoomHub © 2026
        </div>
      </div>

      {/* VÙNG HIỂN THỊ NỘI DUNG BÊN PHẢI */}
      <div className="flex-1 overflow-x-hidden relative">
        {/* LOGIC HIỂN THỊ 3 TRANG */}
        {activeTab === 'stats' && (
          <div className="animate-fade-in-up">
            <DashboardStats />
          </div>
        )}
        {activeTab === 'rooms' && (
          <div className="animate-fade-in-up">
            <AdminPage />
          </div>
        )}
        {activeTab === 'bookings' && (
          <div className="animate-fade-in-up">
            <AdminBookingsPage />
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AdminDashboard;
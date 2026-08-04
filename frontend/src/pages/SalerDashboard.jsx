import React, { useState } from 'react';
import AdminPage from './AdminPage';
import AdminBookingsPage from './AdminBookingsPage';
// 1. IMPORT COMPONENT THỐNG KÊ VÀO ĐÂY NÈ NÍ
import SalerStats from './SalerStats'; 

const SalerDashboard = () => {
  // 2. SET MẶC ĐỊNH VÀO LÀ HIỆN THỐNG KÊ DOANH THU LIỀN
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="flex min-h-[85vh] bg-gray-50 border-t border-gray-200">
      {/* SIDEBAR TÍM LỊM TÌM SIM DÀNH RIÊNG CHO SALER */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 text-center border-b border-slate-800">
          <h2 className="text-2xl font-bold text-purple-400">Saler Panel</h2>
          <p className="text-sm text-gray-400 mt-1">Hỗ trợ & Chăm sóc khách hàng</p>
        </div>

        <div className="flex-1 py-6 px-4 space-y-3">
          {/* TAB THỐNG KÊ MỚI THÊM VÀO LÊN ĐẦU TIÊN */}
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 transform scale-105'
                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">📊</span>
            Tổng Quan Thống Kê
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'rooms'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 transform scale-105'
                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">🏠</span>
            Phòng Phụ Trách
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 'bookings'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transform scale-105'
                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">📋</span>
            Xử Lý Đơn Đặt
          </button>
        </div>
      </div>

      {/* NỘI DUNG THAO TÁC BÊN PHẢI */}
      <div className="flex-1 overflow-x-hidden relative p-4">
        {activeTab === 'stats' && (
          <div className="animate-fade-in">
            <SalerStats />
          </div>
        )}
        
        {activeTab === 'rooms' && (
          <div className="animate-fade-in">
            <AdminPage />
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div className="animate-fade-in">
            <AdminBookingsPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalerDashboard;
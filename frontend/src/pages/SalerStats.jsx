import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalerStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userRole = localStorage.getItem('role') || '2';
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    axios.get('https://roomhub-api.onrender.com/api/saler/stats', {
      headers: { 'role': userRole, 'user-id': userId }
    })
    .then(res => {
      setStats(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi lấy thống kê saler:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-purple-600 animate-pulse">Đang tính toán doanh thu và tối ưu hóa dữ liệu cho ní...</p>
      </div>
    </div>
  );
  
  if (!stats) return <div className="p-8 text-center text-gray-500">Chưa có dữ liệu thống kê nào hết trơn á ní!</div>;

  // Tính phần trăm đơn hàng để vẽ biểu đồ trực quan
  const total = stats.totalBookings || 1; 
  const confirmedPct = Math.round(((stats.statusStats["Đã xác nhận"] || 0) / total) * 100);
  const pendingPct = Math.round(((stats.statusStats["Chờ xác nhận"] || 0) / total) * 100);
  const canceledPct = Math.round(((stats.statusStats["Đã hủy"] || 0) / total) * 100);

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen font-sans">
      
      {/* TIÊU ĐỀ CHÀ BÁ ẤN TƯỢNG */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>✨</span> Khoang Lái Kinh Doanh <span className="text-purple-600">Saler Pro</span>
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Báo cáo hiệu suất phòng trọ và dòng tiền thời gian thực của ní.</p>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm w-max">
          Cập nhật: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 3 HỘP THÔNG SỐ GRID ĐƯỢC THIẾT KẾ LẠI SIÊU ĐẸP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Doanh Thu Bứt Phá */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden group hover:shadow-purple-500/10 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-9xl text-purple-600/10 font-black select-none group-hover:scale-110 transition-transform">₫</div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-widest bg-purple-950/60 w-max px-3 py-1 rounded-lg border border-purple-800/50">
            <span>💰</span> Dòng tiền thực tế
          </div>
          <p className="text-4xl font-black mt-4 tracking-tight">
            {Number(stats.totalRevenue).toLocaleString('vi-VN')} <span className="text-sm font-medium text-slate-400">VNĐ</span>
          </p>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Trạng thái thanh toán:</span>
            <span className="text-emerald-400 font-bold">● Sòng phẳng</span>
          </div>
        </div>

        {/* Card Quản Lý Phòng */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-purple-300 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-9xl text-slate-100 font-black select-none">🏠</div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest bg-slate-50 w-max px-3 py-1 rounded-lg border border-slate-200">
            <span>🏬</span> Tài sản vận hành
          </div>
          <p className="text-4xl font-black text-slate-900 mt-4 tracking-tight">
            {stats.totalRooms} <span className="text-sm font-medium text-slate-400">Căn phòng</span>
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Tình trạng kho phòng:</span>
            <span className="text-blue-600 font-bold">Hoạt động tốt</span>
          </div>
        </div>

        {/* Card Lượt Đặt Phòng */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-indigo-300 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 text-9xl text-slate-100 font-black select-none">📋</div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest bg-slate-50 w-max px-3 py-1 rounded-lg border border-slate-200">
            <span>📊</span> Nhu cầu thị trường
          </div>
          <p className="text-4xl font-black text-slate-900 mt-4 tracking-tight">
            {stats.totalBookings} <span className="text-sm font-medium text-slate-400">Lượt đặt</span>
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Tần suất tương tác:</span>
            <span className="text-indigo-600 font-bold">Tăng trưởng tốt</span>
          </div>
        </div>
      </div>

      {/* HAI KHỐI BIỂU ĐỒ VÀ TOP PHÒNG BÊN DƯỚI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BÊN TRÁI: BIỂU ĐỒ PHẦN TRĂM TIẾN TRÌNH CỰC ĐỈNH KHÔNG CẦN THƯ VIỆN NẶNG */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-md font-black text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2">
            <span>📊</span> Tỷ lệ đơn hàng
          </h3>
          
          <div className="space-y-6">
            {/* Đơn đã xác nhận */}
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-bold">
                <span className="text-slate-700">✅ Đã xác nhận ({stats.statusStats["Đã xác nhận"] || 0})</span>
                <span className="text-emerald-600 font-mono">{confirmedPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${confirmedPct}%` }}></div>
              </div>
            </div>

            {/* Đơn chờ xác nhận */}
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-bold">
                <span className="text-slate-700">⏳ Chờ xác nhận ({stats.statusStats["Chờ xác nhận"] || 0})</span>
                <span className="text-amber-600 font-mono">{pendingPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${pendingPct}%` }}></div>
              </div>
            </div>

            {/* Đơn đã hủy */}
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-bold">
                <span className="text-slate-700">❌ Đã hủy ({stats.statusStats["Đã hủy"] || 0})</span>
                <span className="text-red-600 font-mono">{canceledPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${canceledPct}%` }}></div>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-400 font-medium mt-8 leading-relaxed text-center">
            💡 Gợi ý: Hãy gọi điện xác nhận nhanh với khách ở trạng thái chờ để tăng tốc dòng tiền doanh thu ní nhé!
          </p>
        </div>

        {/* BÊN PHẢI: BẢNG XẾP HẠNG TOP PHÒNG VIP DẠNG THẺ DÀY DẶN */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-md font-black text-slate-900 mb-5 uppercase tracking-wider flex items-center gap-2">
            <span>👑</span> Phòng mang lại doanh thu cao nhất
          </h3>
          
          <div className="space-y-3.5">
            {stats.topRooms.map((room, index) => {
              const bgMedal = index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-slate-400 text-white' : 'bg-amber-700 text-white';
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-purple-50/40 hover:border-purple-200 transition-all duration-300">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`w-8 h-8 rounded-xl ${bgMedal} text-sm flex items-center justify-center font-black shadow-sm flex-shrink-0`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-800 text-base truncate">{room.Title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">Hiệu suất: {room.TotalBookings} lượt thuê hoàn tất</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-4">
                    <p className="font-black text-purple-700 text-lg tracking-tight">
                      {Number(room.RoomRevenue).toLocaleString('vi-VN')} <span className="text-xs font-bold text-purple-400">₫</span>
                    </p>
                  </div>
                </div>
              );
            })}
            
            {stats.topRooms.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed">
                🏜️ Chưa có dữ liệu hóa đơn nào hoàn tất thanh toán để xếp hạng.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalerStats;
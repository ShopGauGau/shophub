import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState(null);

  // --- HÀM TỰ ĐỘNG TÍNH MỐC THỜI GIAN THỐNG KÊ 30 NGÀY ---
  const getTimeRangeString = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    return `Dữ liệu thống kê từ ngày ${formatDate(thirtyDaysAgo)} đến ngày ${formatDate(today)}`;
  };

  useEffect(() => {
    setLoading(true);
    let url = 'http://localhost:8000/api/admin/stats';
    if (selectedRoomTitle) {
      url += `?room_title=${encodeURIComponent(selectedRoomTitle)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không kết nối được tới server Backend!");
        setLoading(false);
      });
  }, [selectedRoomTitle]);

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div></div>;
  if (error) return <div className="p-6 text-red-600 font-bold">Lỗi: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* KHU VỰC TIÊU ĐỀ KÈM MỐC THỜI GIAN THỐNG KÊ CHI TIẾT */}
      <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            {stats.is_single_room ? `Dashboard chi tiết: ${stats.room_title}` : "Báo cáo hoạt động tổng quan"}
          </h2>
          {/* DÒNG THỜI GIAN HIỂN THỊ Ở ĐÂY NÈ NÍ */}
          <p className="text-sm font-semibold text-teal-600 mt-2 flex items-center gap-1.5">
            📅 {getTimeRangeString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.is_single_room ? "* Số liệu doanh thu và lịch sử đặt phòng được lọc riêng cho căn hộ này" : "* Dữ liệu tổng hợp toàn bộ các phòng trọ trên hệ thống RoomHub"}
          </p>
        </div>
        
        {stats.is_single_room && (
          <button 
            onClick={() => setSelectedRoomTitle(null)}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm"
          >
            ⬅️ Quay lại Tổng Quan
          </button>
        )}
      </div>

      {/* 1. THẺ TÓM TẮT SỐ LIỆU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <h3 className="text-gray-500 font-semibold mb-1">Tổng Doanh Thu thực tế</h3>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(stats.total_revenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
          <h3 className="text-gray-500 font-semibold mb-1">Số lượt khách đặt</h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.total_bookings} Lượt {stats.is_single_room ? "" : <span className="text-sm font-normal text-gray-400">({stats.paid_bookings} đã TT)</span>}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-teal-500">
          <h3 className="text-gray-500 font-semibold mb-1">{stats.is_single_room ? "Giá thuê gốc/Tháng" : "Hiệu Suất Phòng"}</h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.is_single_room ? formatCurrency(stats.room_price) : `${stats.rented_rooms} / ${stats.total_rooms}`}
          </p>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ DIỄN BIẾN DOANH THU THEO NGÀY */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {stats.is_single_room ? `Biến động doanh thu của phòng (30 ngày qua)` : "Biến động doanh thu toàn hệ thống theo ngày (30 ngày qua)"}
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}Tr`} tick={{fontSize: 12}}/>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="DoanhThu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. PHẦN CHI TIẾT PHÍA DƯỚI */}
      {!stats.is_single_room ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">Hiệu suất kinh doanh từng phòng (Click tên để xem chi tiết)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-4 font-semibold">Tên phòng</th>
                    <th className="p-4 font-semibold text-center">Số lượt đặt</th>
                    <th className="p-4 font-semibold text-right">Tổng mang về</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.room_stats.map((room, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition">
                      <td className="p-4 font-bold">
                        <button 
                          onClick={() => setSelectedRoomTitle(room.Title)}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                        >
                          🏢 {room.Title}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{room.BookingCount}</span>
                      </td>
                      <td className="p-4 text-right font-bold text-teal-600">{formatCurrency(room.RoomRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">Lịch sử giao dịch gần đây hệ thống</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-4 font-semibold">Khách hàng & Phòng</th>
                    <th className="p-4 font-semibold">Thời gian thuê</th>
                    <th className="p-4 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recent_bookings.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{log.FullName}</p>
                        <p className="text-xs text-gray-500">{log.RoomTitle}</p>
                        <p className="text-xs text-gray-400 mt-1">🕒 Đặt lúc: {log.BookingDate}</p>
                      </td>
                      <td className="p-4 text-gray-600 text-xs">{log.TimeFrame}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold block w-max mb-1 ${log.Status === 'Đã xác nhận' ? 'bg-green-100 text-green-700' : log.Status === 'Đã hủy' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {log.Status}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-bold block w-max ${log.PaymentStatus === 'Đã thanh toán' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {log.PaymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Toàn bộ lịch sử khách thuê của phòng này</h3>
            <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">Tổng cộng {stats.recent_bookings.length} lượt giao dịch</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 font-semibold">Tên Khách Hàng</th>
                  <th className="p-4 font-semibold">Ngày Đặt Giao Dịch</th>
                  <th className="p-4 font-semibold">Khung Thời Gian Thuê</th>
                  <th className="p-4 font-semibold">Duyệt Đơn</th>
                  <th className="p-4 font-semibold">Thanh Toán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recent_bookings.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-800">👤 {log.FullName}</td>
                    <td className="p-4 text-gray-600">{log.BookingDate}</td>
                    <td className="p-4 text-gray-700 font-medium">{log.TimeFrame}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${log.Status === 'Đã xác nhận' ? 'bg-green-100 text-green-700' : log.Status === 'Đã hủy' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {log.Status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${log.PaymentStatus === 'Đã thanh toán' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {log.PaymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recent_bookings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Phòng này chưa có lịch sử đặt phòng nào hết ní ơi!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default DashboardStats;
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API lấy dữ liệu thật khi vừa mở trang lên
  useEffect(() => {
    fetch('http://localhost:8000/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setStats(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Không kết nối được tới server Backend rồi ní ơi!");
        setLoading(false);
      });
  }, []);

  // Format định dạng tiền tệ VNĐ cho chuẩn và đẹp
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Màn hình chờ trong lúc đợi tải dữ liệu từ mây về
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <span className="text-gray-500 font-bold">Đang kéo dữ liệu thật từ SQL Server về, đợi xíu nha bấy bì...</span>
      </div>
    );
  }

  // Hiện thông báo lỗi nếu kết nối database bị oằn tà là ngoằn
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-sm">
          <p className="font-bold text-lg">⚠️ Lỗi hệ thống thống kê:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Thống kê tổng quan</h2>

      {/* Cụm thẻ tóm tắt (Summary Cards) hiển thị SỐ LIỆU THẬT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-blue-100 font-semibold mb-2">Tổng Doanh Thu</h3>
          <p className="text-3xl font-bold">{formatCurrency(stats.total_revenue)}</p>
          <p className="text-sm mt-2 text-blue-200">Áp dụng cho đơn "Đã thanh toán"</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-orange-100 font-semibold mb-2">Tổng Đơn Đặt Phòng</h3>
          <p className="text-3xl font-bold">{stats.total_bookings} Đơn</p>
          <p className="text-sm mt-2 text-orange-200">{stats.paid_bookings} đơn đã thanh toán xong</p>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-teal-100 font-semibold mb-2">Hiệu Suất Cho Thuê</h3>
          <p className="text-3xl font-bold">{stats.rented_rooms} / {stats.total_rooms} Phòng</p>
          <p className="text-sm mt-2 text-teal-200">
            Lấp đầy: {stats.total_rooms > 0 ? ((stats.rented_rooms / stats.total_rooms) * 100).toFixed(0) : 0}% công suất
          </p>
        </div>
      </div>

      {/* Biểu đồ cột tự động co giãn theo số tháng có dữ liệu thực */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-6">Biểu đồ doanh thu 6 tháng gần nhất</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.chart_data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}Tr`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                cursor={{fill: '#f3f4f6'}}
              />
              <Legend />
              <Bar dataKey="DoanhThu" name="Doanh Thu (VNĐ)" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
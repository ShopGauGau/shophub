import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bookings');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/bookings/update/${id}`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      alert("Lỗi cập nhật trạng thái rùi ní ơi!");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Đơn Đặt Phòng (Admin)</h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-orange-600 text-white">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Tên khách</th>
              <th className="p-4">Phòng đặt</th>
              <th className="p-4">Thời gian đặt</th>
              <th className="p-4">Hình thức</th>
              
              {/* CỘT MỚI THÊM VÔ NÈ: ĐỂ XEM KHÁCH TRẢ TIỀN CHƯA */}
              <th className="p-4">Tiền nong</th>
              
              <th className="p-4">Trạng thái duyệt</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.BookingID} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{b.BookingID}</td>
                <td className="p-4 font-medium">{b.FullName}</td>
                <td className="p-4 font-bold text-teal-600">{b.RoomTitle || "Không xác định"}</td>
                <td className="p-4 text-sm">
                    {b.StartTime ? new Date(b.StartTime).toLocaleString('vi-VN') : "Chưa có"}
                    <div className="text-gray-400">đến</div>
                    {b.EndTime ? new Date(b.EndTime).toLocaleString('vi-VN') : "Chưa có"}
                </td>
                
                {/* Cột hiển thị: VNPAY / Tiền mặt */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block text-center min-w-[100px]
                    ${b.PaymentMethod === 'VNPAY' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      b.PaymentMethod === 'Chuyển khoản' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                      'bg-gray-50 text-gray-700 border-gray-200'}`}
                  >
                    {b.PaymentMethod || 'Tiền mặt'}
                  </span>
                </td>

                {/* CỘT HIỂN THỊ TRẠNG THÁI "ĐÃ THANH TOÁN" ĐÂY RỒI! */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border inline-block text-center min-w-[110px] shadow-sm
                    ${b.PaymentStatus === 'Đã thanh toán' ? 'bg-green-500 text-white border-green-600' : 'bg-red-50 text-red-500 border-red-200'}`}
                  >
                    {b.PaymentStatus || 'Chưa thanh toán'}
                  </span>
                </td>

                {/* Cột trạng thái xác nhận đơn */}
                <td className="p-4">
                  <select 
                    value={b.Status} 
                    onChange={(e) => updateStatus(b.BookingID, e.target.value)}
                    className={`p-2 rounded-lg font-bold border-2 cursor-pointer transition-all duration-200 outline-none
                      ${b.Status === 'Đã xác nhận' ? 'bg-green-100 text-green-700 border-green-200' : 
                        b.Status === 'Đã hủy' ? 'bg-red-100 text-red-700 border-red-200' : 
                        'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                  >
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
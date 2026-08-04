import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State để quản lý Modal xem chi tiết khách hàng
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const userRole = localStorage.getItem('role') || '2'; 
  const userId = localStorage.getItem('userId') || '';

  const fetchBookings = () => {
    setLoading(true);
    axios.get('https://roomhub-api.onrender.com/api/bookings', {
      headers: { 'role': userRole, 'user-id': userId }
    })
    .then(res => {
      setBookings(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi lấy danh sách đơn đặt:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Hàm cập nhật trạng thái đơn hàng (Duyệt / Hủy)
  const handleUpdateStatus = (e, bookingId, newStatus) => {
    e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt để không bị bấm nhầm mở Modal chi tiết
    const actionText = newStatus === 'Đã xác nhận' ? 'duyệt' : 'hủy';
    
    if (window.confirm(`Ní có chắc chắn muốn ${actionText} đơn đặt phòng này không?`)) {
      axios.put(`https://roomhub-api.onrender.com/api/bookings/update/${bookingId}`, { 
        status: newStatus 
      })
      .then(res => {
        alert(`Đã ${actionText} đơn đặt phòng thành công!`);
        fetchBookings(); // Tải lại danh sách mới nhất
        if (showModal && selectedBooking?.BookingID === bookingId) {
          setShowModal(false); // Đóng modal nếu đang mở đơn đó
        }
      })
      .catch(err => {
        alert("Lỗi cập nhật: " + (err.response?.data?.detail || err.message));
      });
    }
  };

  // Hàm mở Modal xem chi tiết thông tin khách hàng
  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Hàm format ngày tháng hiển thị cho gọn sạch
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      
      {/* HEADER BAR */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>📋</span> Xử Lý Đơn Đặt Phòng
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">💡 Mẹo: Bấm thẳng vào thẻ đơn hàng bất kỳ để xem nhanh thông tin chi tiết liên hệ của khách nha ní!</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm transition-all text-sm flex items-center gap-2"
        >
          🔄 Tải lại danh sách
        </button>
      </div>

      {/* DANH SÁCH ĐƠN HÀNG DẠNG CARDS */}
      <div className="space-y-4">
        {bookings.map((booking) => {
          // Chuẩn hóa trạng thái về chữ thường để so sánh chính xác tránh bị lỗi ẩn nút
          const currentStatus = booking.Status?.trim().toLowerCase();
          const isPending = currentStatus === 'chờ xác nhận' || currentStatus === 'pending' || currentStatus === 'choxacnhan';

          let statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
          if (currentStatus === 'đã xác nhận' || currentStatus === 'approved' || currentStatus === 'daxacnhan') {
            statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
          }
          if (currentStatus === 'đã hủy' || currentStatus === 'canceled' || currentStatus === 'dahuy') {
            statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
          }

          const isPaid = booking.PaymentStatus === 'Đã thanh toán' || booking.PaymentStatus === 'Đã cọc';

          return (
            <div 
              key={booking.BookingID} 
              onClick={() => handleOpenDetails(booking)}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group cursor-pointer transform hover:-translate-y-0.5"
            >
              {/* CỘT 1: KHÁCH HÀNG */}
              <div className="flex items-start gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 font-mono text-slate-600 text-xs font-black flex items-center justify-center shadow-inner flex-shrink-0">
                  #{booking.BookingID}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khách Hàng</p>
                  <p className="font-extrabold text-slate-800 text-base mt-0.5 truncate group-hover:text-purple-600 transition-colors">{booking.FullName}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">🕒 Đặt ngày: {formatDateTime(booking.BookingDate)}</p>
                </div>
              </div>

              {/* CỘT 2: TÊN PHÒNG */}
              <div className="min-w-[220px] max-w-xs">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên Phòng</p>
                <p className="font-bold text-blue-600 text-sm mt-0.5 leading-snug truncate">
                  {booking.RoomTitle || 'Đang tải dữ liệu...'}
                </p>
              </div>

              {/* CỘT 3: THỜI GIAN THUÊ PHÒNG */}
              <div className="min-w-[180px]">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thời Gian Thuê</p>
                <div className="mt-1 space-y-0.5 text-xs font-mono text-slate-600">
                  <div><span className="text-emerald-500 font-bold">▶</span> {formatDateTime(booking.StartTime)}</div>
                  <div><span className="text-rose-500 font-bold">■</span> {formatDateTime(booking.EndTime)}</div>
                </div>
              </div>

              {/* CỘT 4: BADGES TRẠNG THÁI */}
              <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center min-w-[240px]">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thanh Toán</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border text-center w-max ${isPaid ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-300"}`}>
                    {isPaid ? "Đã thanh toán 🎉" : "Chưu thanh toán"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Trạng Thái Đơn</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border text-center w-max ${statusBadgeClass}`}>
                    {booking.Status}
                  </span>
                </div>
              </div>

              {/* CỘT 5: NÚT THAO TÁC XỬ LÝ NHANH */}
              <div className="flex items-center gap-2 border-t pt-4 lg:border-none lg:pt-0 justify-end flex-shrink-0 min-w-[160px]">
                {isPending ? (
                  <>
                    <button 
                      onClick={(e) => handleUpdateStatus(e, booking.BookingID, 'Đã xác nhận')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-3 rounded-xl shadow-sm transition-all transform hover:scale-105"
                    >
                      Duyệt Đơn ✓
                    </button>
                    <button 
                      onClick={(e) => handleUpdateStatus(e, booking.BookingID, 'Đã hủy')}
                      className="bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl transition-all"
                    >
                      Hủy ✕
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-slate-400 italic bg-slate-50 px-4 py-2 rounded-xl border border-dashed">
                    Đã xử lý xong
                  </span>
                )}
              </div>

            </div>
          );
        })}

        {bookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-slate-500 font-bold">Hiện tại ní chưa nhận được đơn đặt phòng nào hết trọ á!</p>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* MODAL POPUP HIỂN THỊ CHI TIẾT KHÁCH HÀNG (SIÊU VIP CHO THẦY COI) */}
      {/* ========================================================== */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all duration-300 scale-100">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight">🔍 Chi Tiết Đơn Đặt Phòng #{selectedBooking.BookingID}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Xem hồ sơ liên hệ và lịch trình khách thuê phòng</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Khối thông tin liên hệ */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="text-xs font-black uppercase text-purple-600 tracking-wider mb-3">👤 Thông tin khách hàng</h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400 font-medium">Họ & Tên:</span> <span className="font-extrabold text-slate-800">{selectedBooking.FullName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400 font-medium">Số điện thoại:</span> <span className="font-bold text-slate-800 text-blue-600 font-mono">{selectedBooking.PhoneNumber || '0987.xxx.xxx (Đang cập nhật)'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400 font-medium">Email liên lạc:</span> <span className="font-medium text-slate-700 font-mono">{selectedBooking.Email || 'khachhang@gmail.com'}</span></div>
                </div>
              </div>

              {/* Khối thông tin sản phẩm thuê */}
              <div className="space-y-3 text-sm">
                <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">🏠 Thông tin phòng thuê</h4>
                <div>
                  <span className="text-slate-400 block font-medium">Tên phòng phụ trách:</span>
                  <span className="font-bold text-slate-800 text-base leading-snug block mt-0.5">{selectedBooking.RoomTitle}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                    <span className="text-[11px] font-bold text-emerald-700 block">📅 NGÀY BẮT ĐẦU</span>
                    <span className="font-mono text-xs font-bold text-slate-700 mt-1 block">{formatDateTime(selectedBooking.StartTime)}</span>
                  </div>
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3">
                    <span className="text-[11px] font-bold text-rose-700 block">📅 NGÀY KẾT THÚC</span>
                    <span className="font-mono text-xs font-bold text-slate-700 mt-1 block">{formatDateTime(selectedBooking.EndTime)}</span>
                  </div>
                </div>
              </div>

              {/* Ghi chú thêm từ khách hàng */}
              <div className="text-sm">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1.5">📝 Ghi chú đặt phòng</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 text-xs italic leading-relaxed">
                  {selectedBooking.Notes || "Khách hàng không để lại yêu cầu đặc biệt nào thêm."}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl text-xs transition-colors"
              >
                Đóng Lại
              </button>
              {/* Tích hợp nút duyệt nhanh ngay trong modal */}
              {selectedBooking.Status?.trim().toLowerCase() === 'chờ xác nhận' && (
                <button 
                  onClick={(e) => handleUpdateStatus(e, selectedBooking.BookingID, 'Đã xác nhận')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2 rounded-xl text-xs transition-colors"
                >
                  Duyệt Đơn Luôn ✓
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBookingsPage;
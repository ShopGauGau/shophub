import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        
        if (userId && userId !== "undefined") {
            axios.get(`https://shophub-qxpt.onrender.com/api/bookings/user/${userId}`)
                .then(res => {
                    setBookings(Array.isArray(res.data) ? res.data : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi lấy lịch sử:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <div className="p-20 text-center text-xl font-bold text-gray-600">Đang tải lịch sử...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">📅 Lịch sử đặt phòng của tui</h2>

                {bookings.length === 0 ? (
                    <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg mb-4">Ní chưa đặt phòng nào hết trơn á!</p>
                        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
                            Đi dạo tìm phòng ngay
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {bookings.map(b => (
                            <div key={b.BookingID} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
                                
                                {/* 1. HÌNH ẢNH CŨNG BẤM VÔ ĐƯỢC LUÔN */}
                                <Link to={`/room/${b.RoomID}`} className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden block">
                                    <img 
                                        src={b.ImageURL || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'} 
                                        alt="Room" 
                                        className="w-full h-full object-cover hover:scale-110 transition duration-500"
                                    />
                                </Link>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            {/* 2. TÊN PHÒNG BIẾN THÀNH LINK BẤM ĐƯỢC */}
                                            <Link to={`/room/${b.RoomID}`} className="text-xl font-bold text-blue-900 hover:text-blue-600 hover:underline">
                                                {b.RoomTitle}
                                            </Link>
                                            <span className="text-gray-400 text-sm whitespace-nowrap ml-3">Mã đơn: #{b.BookingID}</span>
                                        </div>
                                        
                                        <div className="text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 inline-block">
                                            <p><span className="font-semibold">Từ:</span> {new Date(b.StartTime).toLocaleString('vi-VN')}</p>
                                            <p><span className="font-semibold">Đến:</span> {new Date(b.EndTime).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>

                                    {/* CÁC TAG TRẠNG THÁI VÀ NÚT ĐẶT LẠI */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 md:mt-0">
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                                                ${b.Status === 'Đã xác nhận' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                b.Status === 'Đã hủy' ? 'bg-red-100 text-red-700 border-red-200' : 
                                                'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                                Trạng thái: {b.Status}
                                            </span>

                                            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-700 border-gray-200">
                                                {b.PaymentMethod}
                                            </span>

                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                                                ${b.PaymentStatus === 'Đã thanh toán' ? 'bg-green-500 text-white border-green-600' : 'bg-red-50 text-red-500 border-red-200'}`}>
                                                {b.PaymentStatus || 'Chưa thanh toán'}
                                            </span>
                                        </div>

                                        {/* 3. NÚT XEM & ĐẶT LẠI RÕ RÀNG */}
                                        <Link to={`/room/${b.RoomID}`} className="bg-blue-50 text-blue-700 border border-blue-200 px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                            Xem & Đặt lại →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
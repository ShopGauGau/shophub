import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RoomDetailsPage = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [timeRange, setTimeRange] = useState({ start: '', end: '' });
    const [customerName, setCustomerName] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    
    const [isFavorite, setIsFavorite] = useState(false); 
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt'); 
    
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem('username'); 
        const savedId = localStorage.getItem('userId'); 
        
        const finalUserId = (savedId && savedId !== "undefined" && savedId !== "null") ? parseInt(savedId) : null;

        if (savedName) {
            setCustomerName(savedName);
            setCurrentUserId(finalUserId);
            
            const checkId = finalUserId || 2; 
            axios.get(`http://127.0.0.1:8000/api/favorites/check?user_id=${checkId}&room_id=${id}`)
                .then(res => {
                    if (res.data.is_favorite) setIsFavorite(true);
                })
                .catch(err => console.error("Lỗi check tim:", err));
        }

        axios.get(`http://127.0.0.1:8000/api/rooms/${id}`)
            .then(res => {
                setRoom(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy chi tiết:", err);
                setLoading(false);
            });
    }, [id]);

    const handleToggleFavorite = async () => {
        if (!customerName) {
            alert("Ní phải đăng nhập tài khoản thì mới lưu phòng được nha!");
            return;
        }
        const finalUserId = currentUserId || 2; 
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/favorites/toggle', { UserID: finalUserId, RoomID: parseInt(id) });
            if (res.data.status === 'added') setIsFavorite(true); 
            else if (res.data.status === 'removed') setIsFavorite(false); 
        } catch (error) {
            alert("Lỗi kết nối khi lưu phòng!");
        }
    };

    const handleInitialBooking = () => {
        if (!timeRange.start || !timeRange.end) {
            alert("Ní chọn đủ ngày giờ đi nha!");
            return;
        }
        setShowPaymentModal(true);
    };

    // ==========================================
    // BƯỚC 2: CHỐT ĐƠN VÀ CHUYỂN HƯỚNG VNPAY
    // ==========================================
    const handleFinalBooking = async () => {
        try {
            const bookingData = {
                RoomID: parseInt(id),
                UserID: currentUserId || 2, 
                FullName: customerName,
                StartTime: timeRange.start,
                EndTime: timeRange.end,
                PaymentMethod: paymentMethod 
            };
            
            // 1. Tạo đơn đặt phòng trước để lấy ID
            const response = await axios.post('http://127.0.0.1:8000/api/bookings/add', bookingData);
            
            if (response.data.status === 'error') {
                alert("Úi, Database báo lỗi rồi: " + response.data.message);
                return;
            }

            const newBookingId = response.data.booking_id; 

            // 2. Nếu khách chọn VNPAY thì gọi API tạo link thanh toán
            if (paymentMethod === 'VNPAY') {
                // Tạm thời ẩn Modal đi cho đẹp trong lúc chờ API
                setShowPaymentModal(false); 
                
                const vnPayRes = await axios.post('http://127.0.0.1:8000/api/payment/vnpay', {
                    BookingID: newBookingId,
                    Amount: room.Price 
                });

                if (vnPayRes.data.status === 'success') {
                    // CHUYỂN HƯỚNG TỚI TRANG THANH TOÁN
                    window.location.href = vnPayRes.data.payment_url;
                } else {
                    alert("Lỗi tạo link VNPAY: " + vnPayRes.data.message);
                }
            } else {
                // Nếu là Tiền mặt hoặc Chuyển khoản QR
                alert(`Ní đã đặt phòng thành công rực rỡ bằng hình thức: ${paymentMethod}!`);
                setShowPaymentModal(false); 
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        }
    };

    if (loading) return <div className="p-20 text-center text-xl">Đang tải thông tin phòng...</div>;
    if (!room || room.error) return <div className="p-20 text-center text-red-500">Không tìm thấy phòng này ní ơi!</div>;

    const bankBin = "MB"; 
    const bankAccount = "0987654321"; // Nhớ đổi thành STK thật nha
    const qrInfo = `Thanh toan phong ${room.RoomID}`;
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.png?amount=${room.Price}&addInfo=${qrInfo}&accountName=LE THANH THIEN`;

    return (
        <div className="container mx-auto p-6 md:p-10 max-w-6xl relative">
            <Link to="/" className="text-blue-600 font-bold mb-6 block hover:underline">← Quay lại trang chủ</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="overflow-hidden rounded-2xl">
                    <img src={room.ImageURL || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'} alt={room.Title} className="w-full h-[400px] object-cover hover:scale-105 transition duration-500" />
                </div>
                
                <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">{room.Title}</h1>
                        <button onClick={handleToggleFavorite} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition shadow-sm border ${isFavorite ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                            <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
                            {isFavorite ? 'Đã lưu' : 'Lưu phòng'}
                        </button>
                    </div>
                    
                    <p className="text-3xl text-red-600 font-bold mb-6">{room.Price ? room.Price.toLocaleString() : "Liên hệ"} VNĐ/tháng</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-gray-500 text-sm">Diện tích</p><p className="font-bold text-lg">{room.Area} m²</p></div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-gray-500 text-sm">Địa chỉ</p><p className="font-bold text-lg">{room.Address || 'Đang cập nhật'}</p></div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-lg mb-4 text-blue-900">Thông tin đặt phòng:</h3>
                        {customerName ? (
                            <>
                                <p className="text-gray-700 mb-4">Người đặt: <span className="font-bold text-blue-700 uppercase">{customerName}</span></p>
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <input type="datetime-local" onChange={(e) => setTimeRange({...timeRange, start: e.target.value})} className="p-3 rounded-lg border border-gray-300" />
                                    <input type="datetime-local" onChange={(e) => setTimeRange({...timeRange, end: e.target.value})} className="p-3 rounded-lg border border-gray-300" />
                                </div>
                                
                                <button onClick={handleInitialBooking} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-lg">
                                    Tiếp tục thanh toán →
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-600 mb-4 font-medium">Ní phải đăng nhập tài khoản thì mới đặt phòng được nha!</p>
                                <Link to="/login" className="inline-block bg-orange-500 text-white py-3 px-8 rounded-xl font-bold hover:bg-orange-600 transition shadow-md">Đăng nhập ngay</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MÀN HÌNH POPUP THANH TOÁN */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
                            <h3 className="text-2xl font-bold">Xác nhận thanh toán</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-white hover:text-red-200 text-3xl font-bold leading-none">&times;</button>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">Chọn phương thức thanh toán:</h4>
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 transition">
                                        <input type="radio" name="payment" value="Tiền mặt" checked={paymentMethod === 'Tiền mặt'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
                                        <span className="font-bold text-gray-700">💵 Tiền mặt (Thanh toán khi nhận phòng)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 transition">
                                        <input type="radio" name="payment" value="Chuyển khoản" checked={paymentMethod === 'Chuyển khoản'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
                                        <span className="font-bold text-gray-700">🏦 Chuyển khoản (Quét mã QR)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 transition">
                                        <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
                                        <span className="font-bold text-gray-700">💳 Cổng thanh toán VNPAY</span>
                                    </label>
                                </div>
                            </div>

                            {paymentMethod === 'Chuyển khoản' && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl flex flex-col items-center justify-center border border-blue-200 border-dashed">
                                    <p className="text-sm font-bold text-blue-800 mb-2">Mở app Ngân hàng để quét mã QR:</p>
                                    <img src={qrUrl} alt="QR Code Thanh Toán" className="w-48 h-48 rounded-lg shadow-sm border border-gray-200" />
                                    <p className="text-xs text-gray-500 mt-2 text-center">Nội dung CK: <span className="font-bold text-gray-900">{qrInfo}</span></p>
                                </div>
                            )}

                            <button onClick={handleFinalBooking} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg text-lg flex justify-center items-center gap-2">
                                ✅ Hoàn tất đặt phòng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetailsPage;
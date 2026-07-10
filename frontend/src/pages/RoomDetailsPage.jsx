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

    const [bookedSlots, setBookedSlots] = useState([]);
    const [dateError, setDateError] = useState('');
    
    const [totalPrice, setTotalPrice] = useState(0);
    const [durationText, setDurationText] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem('username'); 
        const savedId = localStorage.getItem('userId'); 
        
        const finalUserId = (savedId && savedId !== "undefined" && savedId !== "null") ? parseInt(savedId) : null;

        if (savedName) {
            setCustomerName(savedName);
            setCurrentUserId(finalUserId);
            
            const checkId = finalUserId || 2; 
            axios.get(`https://shophub-qxpt.onrender.com/api/favorites/check?user_id=${checkId}&room_id=${id}`)
                .then(res => {
                    if (res.data && res.data.is_favorite) setIsFavorite(true);
                })
                .catch(err => console.error("Lỗi check tim:", err));
        }

        // Tải thông tin phòng
        axios.get(`https://shophub-qxpt.onrender.com/api/rooms/${id}`)
            .then(res => {
                setRoom(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy chi tiết:", err);
                setLoading(false);
            });

        // Tải lịch đặt phòng
        axios.get('https://shophub-qxpt.onrender.com/api/bookings')
            .then(res => {
                if (Array.isArray(res.data)) {
                    const roomBookings = res.data.filter(
                        b => b.RoomID === parseInt(id) && (b.Status === 'Chờ xác nhận' || b.Status === 'Đã xác nhận')
                    );
                    setBookedSlots(roomBookings);
                }
            })
            .catch(err => console.error("Lỗi lấy lịch:", err));

    }, [id]);

    const handleToggleFavorite = async () => {
        if (!customerName) {
            alert("Ní phải đăng nhập tài khoản thì mới lưu phòng được nha!");
            return;
        }
        const finalUserId = currentUserId || 2; 
        try {
            const res = await axios.post('https://shophub-qxpt.onrender.com/api/favorites/toggle', { UserID: finalUserId, RoomID: parseInt(id) });
            if (res.data.status === 'added') setIsFavorite(true); 
            else if (res.data.status === 'removed') setIsFavorite(false); 
        } catch (error) {
            alert("Lỗi kết nối khi lưu phòng!");
        }
    };

    const validateAndCalculate = (start, end) => {
        if (!start || !end) {
            setDateError('');
            setTotalPrice(0);
            setDurationText('');
            return false;
        }

        const sTime = new Date(start).getTime();
        const eTime = new Date(end).getTime();

        if (isNaN(sTime) || isNaN(eTime)) return false;

        if (sTime >= eTime) {
            setDateError("Giờ trả phòng phải sau giờ nhận nha ní!");
            setTotalPrice(0);
            setDurationText('');
            return false;
        }

        const isOverlap = bookedSlots.some(slot => {
            const slotStart = new Date(slot.StartTime).getTime();
            const slotEnd = new Date(slot.EndTime).getTime();
            return sTime < slotEnd && eTime > slotStart;
        });

        if (isOverlap) {
            setDateError("⚠️ Thời gian này đã có người đặt");
            setTotalPrice(0);
            setDurationText('');
            return false;
        }

        setDateError('');

        // TÍNH TIỀN
        let diffTime = eTime - sTime;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) diffDays = 1; 

        const safePrice = Number(room?.Price) || 0;
        const dailyPrice = Math.round(safePrice / 30);
        const weeklyPrice = Math.round(safePrice / 4);

        let calcTotal = 0;
        let dText = [];

        const m = Math.floor(diffDays / 30);
        const w = Math.floor((diffDays % 30) / 7);
        const d = (diffDays % 30) % 7;

        if (m > 0) {
            calcTotal += m * safePrice;
            dText.push(`${m} tháng`);
        }
        if (w > 0) {
            calcTotal += w * weeklyPrice;
            dText.push(`${w} tuần`);
        }
        if (d > 0) {
            calcTotal += d * dailyPrice;
            dText.push(`${d} ngày`);
        }

        setTotalPrice(calcTotal);
        setDurationText(dText.join(' '));
        return true;
    };

    const handleDateChange = (type, value) => {
        const newRange = { ...timeRange, [type]: value };
        setTimeRange(newRange);
        validateAndCalculate(newRange.start, newRange.end);
    };

    const handleInitialBooking = () => {
        if (!timeRange.start || !timeRange.end) {
            setDateError("Ní chọn đủ ngày giờ đi nha!");
            return;
        }
        if (dateError) return; 

        setShowPaymentModal(true);
    };

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
            
            const response = await axios.post('https://shophub-qxpt.onrender.com/api/bookings/add', bookingData);
            
            if (response.data.status === 'error') {
                alert(response.data.message);
                return;
            }

            const newBookingId = response.data.booking_id; 

            if (paymentMethod === 'VNPAY') {
                setShowPaymentModal(false); 
                
                const vnPayRes = await axios.post('https://shophub-qxpt.onrender.com/api/payment/vnpay', {
                    BookingID: newBookingId,
                    Amount: totalPrice > 0 ? totalPrice : (Number(room?.Price) || 0) 
                });

                if (vnPayRes.data.status === 'success') {
                    window.location.href = vnPayRes.data.payment_url;
                } else {
                    alert("Lỗi tạo link VNPAY: " + vnPayRes.data.message);
                }
            } else {
                alert(`Ní đã đặt phòng thành công rực rỡ bằng hình thức: ${paymentMethod}!`);
                setShowPaymentModal(false); 
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        }
    };

    if (loading) return <div className="p-20 text-center text-xl font-bold text-gray-600">Đang tải thông tin phòng...</div>;
    if (!room || room.error) return <div className="p-20 text-center text-red-500 font-bold">Không tìm thấy phòng này ní ơi!</div>;

    const safePrice = Number(room?.Price) || 0;
    const showDailyPrice = Math.round(safePrice / 30).toLocaleString();
    const showWeeklyPrice = Math.round(safePrice / 4).toLocaleString();

    const bankBin = "MB"; 
    const bankAccount = "0932002923"; 
    const qrInfo = `Thanh toan phong ${room?.RoomID || id}`;
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.png?amount=${totalPrice > 0 ? totalPrice : safePrice}&addInfo=${qrInfo}&accountName=LE THANH THIEN`;

    return (
        <div className="container mx-auto p-6 md:p-10 max-w-6xl relative">
            <Link to="/" className="text-blue-600 font-bold mb-6 block hover:underline">← Quay lại trang chủ</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                
                {/* CỘT TRÁI: HÌNH ẢNH VÀ BẢN ĐỒ MỚI THÊM VÔ ĐÂY NÈ NÍ */}
                <div className="flex flex-col gap-6">
                    <div className="overflow-hidden rounded-2xl">
                        <img src={room?.ImageURL || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'} alt={room?.Title || 'Phòng'} className="w-full h-[400px] object-cover hover:scale-105 transition duration-500" />
                    </div>
                    
                    {/* KHÚC NÀY LÀ GOOGLE MAPS NÈ */}
                    {room?.MapURL && room.MapURL.trim() !== "" && (
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                📍 Vị trí trên bản đồ
                            </h3>
                            <div className="w-full h-[250px] rounded-xl overflow-hidden shadow-inner border border-gray-200">
                                <iframe 
                                    src={room.MapURL} 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy"
                                    title="Google Maps"
                                    onError={(e) => e.target.style.display = 'none'}
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* CỘT PHẢI: THÔNG TIN VÀ ĐẶT PHÒNG GIỮ NGUYÊN */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-4xl font-bold text-gray-900">{room?.Title || 'Chưa có tên'}</h1>
                        
                        <button onClick={handleToggleFavorite} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition shadow-sm border ${isFavorite ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                            <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
                            {isFavorite ? 'Đã lưu' : 'Lưu phòng'}
                        </button>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-3xl text-red-600 font-bold">{safePrice > 0 ? safePrice.toLocaleString() : "Liên hệ"} VNĐ/tháng</p>
                        <div className="flex gap-3 mt-3">
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-bold border border-orange-200">
                                Tuần: {showWeeklyPrice} VNĐ
                            </span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold border border-green-200">
                                Ngày: {showDailyPrice} VNĐ
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-gray-500 text-sm">Diện tích</p><p className="font-bold text-lg">{room?.Area || 0} m²</p></div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-gray-500 text-sm">Địa chỉ</p><p className="font-bold text-lg">{room?.Address || 'Đang cập nhật'}</p></div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-lg mb-4 text-blue-900">Thông tin đặt phòng:</h3>
                        {customerName ? (
                            <>
                                <p className="text-gray-700 mb-4">Người đặt: <span className="font-bold text-blue-700 uppercase">{customerName}</span></p>
                                
                                <div className="grid grid-cols-1 gap-4 mb-2">
                                    <input 
                                        type="datetime-local" 
                                        onChange={(e) => handleDateChange('start', e.target.value)} 
                                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    />
                                    <input 
                                        type="datetime-local" 
                                        onChange={(e) => handleDateChange('end', e.target.value)} 
                                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>

                                {dateError && (
                                    <p className="text-red-500 font-bold text-sm mb-2 bg-red-50 p-2 rounded-lg">
                                        {dateError}
                                    </p>
                                )}

                                {!dateError && totalPrice > 0 && (
                                    <div className="bg-white p-4 rounded-xl border border-blue-200 mb-4 shadow-sm">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600 font-medium">Thời gian thuê:</span>
                                            <span className="font-bold text-gray-800">{durationText}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="text-gray-800 font-bold text-lg">Tổng tiền:</span>
                                            <span className="font-bold text-xl text-red-600">{totalPrice.toLocaleString()} VNĐ</span>
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={handleInitialBooking} 
                                    disabled={!!dateError || totalPrice === 0}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg text-lg transition-all mt-2
                                        ${(dateError || totalPrice === 0)
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
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

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
                            <h3 className="text-2xl font-bold">Xác nhận thanh toán</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-white hover:text-red-200 text-3xl font-bold leading-none">&times;</button>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-center border border-red-100">
                                <p className="text-sm font-medium">Số tiền cần thanh toán</p>
                                <p className="text-3xl font-bold">{totalPrice > 0 ? totalPrice.toLocaleString() : safePrice.toLocaleString()} VNĐ</p>
                            </div>

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
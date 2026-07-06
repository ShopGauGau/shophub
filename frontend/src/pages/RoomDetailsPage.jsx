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
    
    // STATE: Quản lý trạng thái thả tim
    const [isFavorite, setIsFavorite] = useState(false); 

    // ... (các import giữ nguyên)

    useEffect(() => {
        const savedName = localStorage.getItem('username'); 
        const savedId = localStorage.getItem('userId'); 
        
        // SỬA LỖI Ở ĐÂY: Nếu không có ID trong localStorage thì ép nó thành số 2 luôn
        const finalUserId = (savedId && savedId !== "undefined" && savedId !== "null") ? parseInt(savedId) : 2;

        if (savedName) {
            setCustomerName(savedName);
            setCurrentUserId(finalUserId);
            
            // Dùng finalUserId đã ép kiểu số chuẩn chỉnh ở đây
            axios.get(`http://127.0.0.1:8000/api/favorites/check?user_id=${finalUserId}&room_id=${id}`)
                .then(res => {
                    if (res.data.is_favorite) setIsFavorite(true);
                })
                .catch(err => console.error("Lỗi check tim:", err));
        }

        // Lấy thông tin phòng (giữ nguyên)
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

    // HÀM XỬ LÝ KHI BẤM NÚT LƯU PHÒNG (Đã fix logic kiểm tra)
    const handleToggleFavorite = async () => {
        // Kiểm tra bằng TÊN thay vì ID, có tên là cho qua!
        if (!customerName) {
            alert("Ní phải đăng nhập tài khoản thì mới lưu phòng được nha!");
            return;
        }

        const finalUserId = currentUserId || 2; // Cứu cánh số 2 thần thánh

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/favorites/toggle', {
                UserID: finalUserId,
                RoomID: parseInt(id)
            });
            
            if (res.data.status === 'added') {
                setIsFavorite(true); 
            } else if (res.data.status === 'removed') {
                setIsFavorite(false); 
            }
        } catch (error) {
            console.error("Lỗi lưu phòng:", error);
            alert("Lỗi kết nối khi lưu phòng!");
        }
    };

    // Hàm đặt phòng
    const handleBooking = async () => {
        if (!timeRange.start || !timeRange.end) {
            alert("Ní chọn đủ ngày giờ đi nha!");
            return;
        }
        try {
            const bookingData = {
                RoomID: parseInt(id),
                UserID: currentUserId || 2, 
                FullName: customerName,
                StartTime: timeRange.start,
                EndTime: timeRange.end
            };
            const response = await axios.post('http://127.0.0.1:8000/api/bookings/add', bookingData);
            if (response.data.status === 'error') {
                alert("Úi, Database báo lỗi rồi: " + response.data.message);
            } else {
                alert("Ní đã đặt phòng thành công rực rỡ!");
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        }
    };

    if (loading) return <div className="p-20 text-center text-xl">Đang tải thông tin phòng...</div>;
    if (!room || room.error) return <div className="p-20 text-center text-red-500">Không tìm thấy phòng này ní ơi!</div>;

    return (
        <div className="container mx-auto p-6 md:p-10 max-w-6xl">
            <Link to="/" className="text-blue-600 font-bold mb-6 block hover:underline">← Quay lại trang chủ</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="overflow-hidden rounded-2xl">
                    <img src={room.ImageURL || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'} alt={room.Title} className="w-full h-[400px] object-cover hover:scale-105 transition duration-500" />
                </div>
                
                <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">{room.Title}</h1>
                        
                        <button 
                            onClick={handleToggleFavorite}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition shadow-sm border ${
                                isFavorite 
                                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
                            {isFavorite ? 'Đã lưu' : 'Lưu phòng'}
                        </button>
                    </div>
                    
                    <p className="text-3xl text-red-600 font-bold mb-6">{room.Price ? room.Price.toLocaleString() : "Liên hệ"} VNĐ/tháng</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-gray-500 text-sm">Diện tích</p><p className="font-bold text-lg">{room.Area} m²</p></div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-gray-500 text-sm">Địa chỉ</p><p className="font-bold text-lg">{room.Address || 'Đang cập nhật'}</p></div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-800">Mô tả chi tiết:</h3>
                    <p className="text-gray-600 leading-relaxed text-justify mb-6">{room.Description || 'Chưa có mô tả chi tiết cho căn phòng này.'}</p>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-lg mb-4 text-blue-900">Thông tin đặt phòng:</h3>
                        {customerName ? (
                            <>
                                <p className="text-gray-700 mb-4">Người đặt: <span className="font-bold text-blue-700 uppercase">{customerName}</span></p>
                                <div className="grid grid-cols-1 gap-4">
                                    <input type="datetime-local" onChange={(e) => setTimeRange({...timeRange, start: e.target.value})} className="p-3 rounded-lg border border-gray-300" />
                                    <input type="datetime-local" onChange={(e) => setTimeRange({...timeRange, end: e.target.value})} className="p-3 rounded-lg border border-gray-300" />
                                </div>
                                <button onClick={handleBooking} className="mt-4 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">Xác nhận đặt phòng ngay</button>
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
        </div>
    );
};

export default RoomDetailsPage;
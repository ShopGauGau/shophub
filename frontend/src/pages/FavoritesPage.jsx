import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FavoritesPage = () => {
    const [savedRooms, setSavedRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Lấy ID an toàn tuyệt đối
    const rawUserId = localStorage.getItem('userId'); 
    const userId = (rawUserId && rawUserId !== "undefined" && rawUserId !== "null") ? parseInt(rawUserId) : null;

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        // Gọi API lấy danh sách phòng
        axios.get(`https://shophub-qxpt.onrender.com/api/favorites/user/${userId}`)
            .then(res => {
                if (res.data && !res.data.error) {
                    setSavedRooms(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy danh sách yêu thích:", err);
                setLoading(false);
            });
    }, [userId]);

    // HÀM XỬ LÝ KHI BẤM "BỎ LƯU"
    const handleRemoveFavorite = async (roomId) => {
        if (!userId) return;

        try {
            const res = await axios.post('https://shophub-qxpt.onrender.com/api/favorites/toggle', {
                UserID: userId,
                RoomID: roomId
            });
            
            // Nếu Backend báo đã xóa (removed) thì mình loại phòng đó khỏi danh sách trên màn hình luôn
            if (res.data.status === 'removed') {
                setSavedRooms(prevRooms => prevRooms.filter(room => room.RoomID !== roomId));
            }
        } catch (error) {
            console.error("Lỗi khi bỏ lưu phòng:", error);
            alert("Lỗi kết nối khi bỏ lưu!");
        }
    };

    if (loading) return <div className="p-20 text-center text-xl font-bold text-gray-600">Đang tải danh sách phòng yêu thích...</div>;

    if (!userId) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Ní chưa đăng nhập nè!</h2>
                <Link to="/login" className="text-blue-600 underline">Đăng nhập ngay để xem phòng đã lưu nha</Link>
            </div>
        );
    }

    if (savedRooms.length === 0) {
        return (
            <div className="container mx-auto p-10 text-center mt-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Phòng Yêu Thích ❤️</h2>
                <div className="bg-gray-50 p-16 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-xl text-gray-500 mb-6">Ní chưa lưu căn phòng nào hết trơn!</p>
                    <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Về trang chủ khám phá ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-10 max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Phòng Đã Lưu Của Ní ❤️</h1>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    {savedRooms.length} phòng
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedRooms.map(room => (
                    <div key={room.RoomID} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300 flex flex-col">
                        <img 
                            src={room.ImageURL || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'} 
                            alt={room.Title} 
                            className="w-full h-56 object-cover"
                        />
                        
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{room.Title}</h3>
                            <p className="text-red-600 font-bold text-lg mb-4">
                                {room.Price ? room.Price.toLocaleString() : "Liên hệ"} VNĐ/tháng
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                <Link to={`/room/${room.RoomID}`} className="text-blue-600 font-bold hover:underline">
                                    Xem chi tiết →
                                </Link>
                                
                                {/* NÚT BỎ LƯU NÈ NÍ */}
                                <button 
                                    onClick={() => handleRemoveFavorite(room.RoomID)}
                                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                    <span>❌</span> Bỏ lưu
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RoomDetailsPage = () => {
    const { id } = useParams(); // Lấy ID phòng từ URL
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API lấy chi tiết phòng dựa theo ID
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

    if (loading) return <div className="p-20 text-center text-xl">Đang tải thông tin phòng...</div>;
    if (!room || room.error) return <div className="p-20 text-center text-red-500">Không tìm thấy phòng này ní ơi!</div>;

    return (
        <div className="container mx-auto p-6 md:p-10 max-w-6xl">
            {/* Nút quay lại */}
            <Link to="/" className="text-blue-600 font-bold mb-6 block hover:underline">
                ← Quay lại trang chủ
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                {/* Cột trái: Hình ảnh */}
                <div className="overflow-hidden rounded-2xl">
                    <img 
                        src={room.ImageURL || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'} 
                        alt={room.Title} 
                        className="w-full h-[400px] object-cover hover:scale-105 transition duration-500" 
                    />
                </div>
                
                {/* Cột phải: Thông tin */}
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{room.Title}</h1>
                    <p className="text-3xl text-red-600 font-bold mb-6">
                        {room.Price ? room.Price.toLocaleString() : "Liên hệ"} VNĐ/tháng
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-gray-500 text-sm">Diện tích</p>
                            <p className="font-bold text-lg">{room.Area} m²</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-gray-500 text-sm">Địa chỉ</p>
                            <p className="font-bold text-lg">{room.Address || 'Đang cập nhật'}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-800">Mô tả chi tiết:</h3>
                    <p className="text-gray-600 leading-relaxed text-justify">
                        {room.Description || 'Chưa có mô tả chi tiết cho căn phòng này. Liên hệ chủ nhà để biết thêm thông tin nhé ní!'}
                    </p>

                    <button className="mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg">
                        Liên hệ chủ nhà ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsPage;
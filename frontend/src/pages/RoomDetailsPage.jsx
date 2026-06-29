import React from 'react';
import { useParams } from 'react-router-dom';

const RoomDetailsPage = () => {
  const { id } = useParams(); // Lấy ID phòng từ URL

  // Tạm thời để dữ liệu cứng, sau này mình fetch theo ID
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Hình ảnh */}
        <img 
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800" 
          alt="Phòng trọ" 
          className="rounded-3xl w-full h-96 object-cover shadow-xl"
        />
        
        {/* Thông tin */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-gray-800">Phòng trọ Quận 7 (ID: {id})</h1>
          <p className="text-2xl text-blue-600 font-semibold">3,500,000 VNĐ/tháng</p>
          <p className="text-gray-600">Phòng thoáng mát, có cửa sổ, an ninh tốt, gần chợ và siêu thị.</p>
          
          <div className="flex gap-6 py-4 border-y">
            <span>🛏 1 Phòng ngủ</span>
            <span>🚿 1 WC</span>
            <span>📏 25 m²</span>
          </div>
          
          <button className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Liên hệ thuê ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
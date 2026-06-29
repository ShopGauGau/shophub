import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ id, Title, Price, Area, ImageURL }) => {
  return (
    <Link to={`/room/${id}`} className="block transform transition-transform hover:scale-105">
      <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
        <img 
          className="w-full h-48 object-cover" 
          src={ImageURL || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'} 
          alt={Title} 
        />
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 truncate mb-2">{Title}</h2>
          <p className="text-blue-600 text-lg font-semibold mb-4">
            {/* Sử dụng dấu ? để tránh lỗi khi dữ liệu chưa kịp load */}
            {Price ? Price.toLocaleString() : "Liên hệ"} VNĐ/tháng
          </p>
          
          <div className="flex justify-between text-gray-500 border-t pt-4">
            <div className="flex items-center"><i className="fas fa-bed mr-2"></i> 1</div>
            <div className="flex items-center"><i className="fas fa-bath mr-2"></i> 1</div>
            <div className="flex items-center"><i className="fas fa-expand-arrows-alt mr-2"></i> {Area} m²</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
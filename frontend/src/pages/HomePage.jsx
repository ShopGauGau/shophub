import React, { useState } from 'react';
import RoomCard from '../components/RoomCard';

const HomePage = () => {
  // 1. Dữ liệu 20 phòng
  const roomsData = [
    { id: 1, district: "Quận 7", title: "Phòng trọ cao cấp Q7", price: 3500000, bedrooms: 1, bathrooms: 1, area: 25, image: "https://picsum.photos/id/10/500/300" },
    { id: 2, district: "Quận 7", title: "Căn hộ Studio Q7", price: 4500000, bedrooms: 1, bathrooms: 1, area: 30, image: "https://picsum.photos/id/11/500/300" },
    { id: 3, district: "Quận 7", title: "Phòng trọ SV tiện nghi Q7", price: 2500000, bedrooms: 1, bathrooms: 1, area: 20, image: "https://picsum.photos/id/12/500/300" },
    { id: 4, district: "Quận 7", title: "Nhà nguyên căn rộng Q7", price: 8000000, bedrooms: 2, bathrooms: 2, area: 60, image: "https://picsum.photos/id/13/500/300" },
    { id: 5, district: "Quận 1", title: "Căn hộ Studio Q1 trung tâm", price: 7000000, bedrooms: 1, bathrooms: 1, area: 35, image: "https://picsum.photos/id/20/500/300" },
    { id: 6, district: "Quận 1", title: "Phòng trọ cao cấp sang trọng", price: 6000000, bedrooms: 1, bathrooms: 1, area: 28, image: "https://picsum.photos/id/21/500/300" },
    { id: 7, district: "Quận 1", title: "Chung cư mini hiện đại Q1", price: 9000000, bedrooms: 2, bathrooms: 1, area: 45, image: "https://picsum.photos/id/22/500/300" },
    { id: 8, district: "Quận 1", title: "Phòng trọ giá tốt Quận 1", price: 4000000, bedrooms: 1, bathrooms: 1, area: 22, image: "https://picsum.photos/id/23/500/300" },
    { id: 9, district: "Bình Thạnh", title: "Phòng trọ giá rẻ BT", price: 2800000, bedrooms: 1, bathrooms: 1, area: 20, image: "https://picsum.photos/id/30/500/300" },
    { id: 10, district: "Bình Thạnh", title: "Căn hộ dịch vụ tiện nghi BT", price: 5000000, bedrooms: 1, bathrooms: 1, area: 32, image: "https://picsum.photos/id/31/500/300" },
    { id: 11, district: "Bình Thạnh", title: "Phòng trọ ban công rộng BT", price: 3800000, bedrooms: 1, bathrooms: 1, area: 25, image: "https://picsum.photos/id/32/500/300" },
    { id: 12, district: "Bình Thạnh", title: "Phòng trọ sân thượng thoáng", price: 4200000, bedrooms: 1, bathrooms: 1, area: 28, image: "https://picsum.photos/id/33/500/300" },
    { id: 13, district: "Thủ Đức", title: "Nhà nguyên căn rộng TĐ", price: 12000000, bedrooms: 3, bathrooms: 2, area: 80, image: "https://picsum.photos/id/40/500/300" },
    { id: 14, district: "Thủ Đức", title: "Phòng trọ sinh viên tiện giá rẻ TĐ", price: 2200000, bedrooms: 1, bathrooms: 1, area: 18, image: "https://picsum.photos/id/41/500/300" },
    { id: 15, district: "Thủ Đức", title: "Kí túc xá hiện đại TĐ", price: 1500000, bedrooms: 1, bathrooms: 1, area: 15, image: "https://picsum.photos/id/42/500/300" },
    { id: 16, district: "Thủ Đức", title: "Căn hộ Studio thoáng TĐ", price: 4000000, bedrooms: 1, bathrooms: 1, area: 30, image: "https://picsum.photos/id/43/500/300" },
    { id: 17, district: "Quận 3", title: "Căn hộ mini Quận 3", price: 5500000, bedrooms: 1, bathrooms: 1, area: 30, image: "https://picsum.photos/id/50/500/300" },
    { id: 18, district: "Quận 10", title: "Phòng trọ SV tiện lợi Q10", price: 2500000, bedrooms: 1, bathrooms: 1, area: 18, image: "https://picsum.photos/id/60/500/300" },
    { id: 19, district: "Quận 2", title: "Căn hộ dịch vụ tiện nghi Q2", price: 9000000, bedrooms: 2, bathrooms: 1, area: 50, image: "https://picsum.photos/id/70/500/300" },
    { id: 20, district: "Gò Vấp", title: "Phòng trọ giá mềm GV", price: 2600000, bedrooms: 1, bathrooms: 1, area: 20, image: "https://picsum.photos/id/80/500/300" },
  ];

  const districts = ["Tất cả", "Quận 7", "Quận 1", "Bình Thạnh", "Thủ Đức", "Quận 3", "Quận 10", "Quận 2", "Gò Vấp"];
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");

  const filteredRooms = selectedDistrict === "Tất cả" 
    ? roomsData 
    : roomsData.filter(room => room.district === selectedDistrict);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Banner chuyên nghiệp */}
      <div className="bg-gradient-to-r from-teal-700 to-blue-600 rounded-3xl p-10 text-white mb-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Tìm phòng trọ ưng ý dễ dàng</h1>
        <p className="opacity-90 mb-6">Hàng ngàn căn hộ và phòng trọ đang chờ đón bạn!</p>
      </div>

      {/* Grid chia 2 cột: Danh sách (3/4) - Sidebar (1/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Cột trái: Danh sách phòng */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6 italic">Tổng cộng {filteredRooms.length} phòng trọ...</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {districts.map(d => (
              <button key={d} onClick={() => setSelectedDistrict(d)}
                className={`px-4 py-1 rounded-full border ${selectedDistrict === d ? "bg-teal-800 text-white" : "bg-white text-gray-700"}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => <RoomCard key={room.id} id={room.id} {...room} />)}
          </div>
        </div>

        {/* Cột phải: Sidebar Features */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Features</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg"><span className="text-2xl">✅</span><p className="text-sm font-semibold text-gray-700">Căn phòng verified</p></div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg"><span className="text-2xl">🛡️</span><p className="text-sm font-semibold text-gray-700">Căn hộ riêng tư security</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';

// Hàm bỏ dấu tiếng Việt
const removeAccents = (str) => {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const HomePage = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  
  // BIẾN MỚI: Lưu trạng thái lọc theo giá tiền
  const [selectedPrice, setSelectedPrice] = useState("Tất cả");

  useEffect(() => {
    axios.get('https://shophub-qxpt.onrender.com/api/rooms')
      .then(res => {
        setRoomsData(res.data);
      })
      .catch(err => console.error("Lỗi rồi ní ơi:", err));
  }, []);

  const districts = [
    "Tất cả", "Quận 1","Quận 2",  "Quận 3", "Quận 4", "Quận 5", 
    "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", 
    "Quận 12", "Bình Tân", "Bình Thạnh", "Gò Vấp", 
    "Phú Nhuận", "Tân Bình", "Tân Phú", "TP. Thủ Đức", 
    "Bình Chánh", "Cần Giờ", "Củ Chi", "Hóc Môn", "Nhà Bè"
  ];
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");

  // LOGIC LỌC TỔNG HỢP (QUẬN + TÊN + GIÁ TIỀN)
  const filteredRooms = roomsData.filter(room => {
    // 1. Lọc theo Quận
    const matchDistrict = selectedDistrict === "Tất cả" || room.District === selectedDistrict;
    
    // 2. Lọc theo Từ khóa tìm kiếm
    const roomTitleNoAccent = removeAccents(room.Title || "").toLowerCase();
    const searchTermNoAccent = removeAccents(searchTerm).toLowerCase();
    const matchSearch = roomTitleNoAccent.includes(searchTermNoAccent);

    // 3. Lọc theo Giá tiền
    let matchPrice = true;
    const roomPrice = Number(room.Price) || 0; // Ép kiểu về số để so sánh

    if (selectedPrice === "Dưới 3 triệu") {
      matchPrice = roomPrice < 3000000;
    } else if (selectedPrice === "3 - 5 triệu") {
      matchPrice = roomPrice >= 3000000 && roomPrice <= 5000000;
    } else if (selectedPrice === "5 - 7 triệu") {
      matchPrice = roomPrice > 5000000 && roomPrice <= 7000000;
    } else if (selectedPrice === "Trên 7 triệu") {
      matchPrice = roomPrice > 7000000;
    }
    
    // Phải thỏa mãn cả 3 điều kiện mới được hiện ra
    return matchDistrict && matchSearch && matchPrice;
  });

  const visibleDistricts = showAllDistricts ? districts : districts.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-teal-700 to-blue-600 rounded-3xl p-10 text-white mb-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Tìm phòng trọ ưng ý dễ dàng</h1>
        <p className="opacity-90 mb-6">Hàng ngàn căn hộ và phòng trọ đang chờ đón bạn!</p>
        
        {/* KHU VỰC TÌM KIẾM & LỌC GIÁ */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Nhập tên phòng, ví dụ: Studio, Bình Thạnh..." 
              className="w-full py-3 px-5 rounded-full text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 top-2 bg-teal-600 hover:bg-teal-700 text-white p-1.5 px-4 rounded-full transition-colors">
              Tìm
            </button>
          </div>

          {/* Ô chọn giá (MỚI) */}
          <div className="w-full md:w-64">
            <select 
              className="w-full py-3 px-5 rounded-full text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer bg-white"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            >
              <option value="Tất cả">Mức giá: Tất cả</option>
              <option value="Dưới 3 triệu">Dưới 3 triệu</option>
              <option value="3 - 5 triệu">Từ 3 - 5 triệu</option>
              <option value="5 - 7 triệu">Từ 5 - 7 triệu</option>
              <option value="Trên 7 triệu">Trên 7 triệu</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6 italic">Tổng cộng {filteredRooms.length} phòng trọ...</h2>
          
          {/* Nút bấm các Quận */}
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            {visibleDistricts.map(d => (
              <button key={d} onClick={() => setSelectedDistrict(d)}
                className={`px-4 py-1 rounded-full border transition-all ${selectedDistrict === d ? "bg-teal-800 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"}`}>
                {d}
              </button>
            ))}
            
            {districts.length > 5 && (
              <button 
                onClick={() => setShowAllDistricts(!showAllDistricts)}
                className="px-4 py-1 rounded-full border border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100 font-medium transition-all"
              >
                {showAllDistricts ? "Thu gọn ⬆️" : "Xem thêm ⬇️"}
              </button>
            )}
          </div>

          {/* Danh sách phòng */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard 
                key={room.RoomID} 
                id={room.RoomID} 
                Title={room.Title} 
                Price={room.Price} 
                Area={room.Area} 
                ImageURL={room.ImageURL} 
              />
            ))}
          </div>
        </div>

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
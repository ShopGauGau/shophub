import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState('Tất cả');
  const [sortPrice, setSortPrice] = useState('default');
  
  // STATE CHO BANNER TỰ ĐỘNG CHẠY
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mảng chứa các Banner xịn xò tự chạy
  const banners = [
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      title: "Tìm Kiếm Phòng Trọ Nhanh Chóng",
      subtitle: "RoomHub giúp bạn kết nối và tìm được những không gian sống lý tưởng, tiện nghi nhất tại TP.HCM."
    },
    {
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      title: "Căn Hộ Dịch Vụ Cao Cấp Trung Tâm",
      subtitle: "Nơi an cư lý tưởng dành cho người đi làm và người nước ngoài với đầy đủ nội thất sang trọng."
    },
    {
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      title: "Phòng Trọ Sinh Viên Giá Rẻ Gần Trường",
      subtitle: "Bộ lọc thông minh giúp gom nhanh các phòng trọ chi phí thấp quanh khu vực các trường Đại học."
    }
  ];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error("Lỗi tải phòng:", err));

    // TIMER CHẠY BANNER TỰ ĐỘNG CỨ 3.5 GIÂY ĐỔI HÌNH
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => clearInterval(slideTimer);
  }, []);

  const districts = [
    'Tất cả', 
    'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12',
    'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Bình Tân',
    'TP. Thủ Đức', 'Bình Chánh', 'Hóc Môn', 'Củ Chi', 'Nhà Bè', 'Cần Giờ'
  ];

  // LOGIC LỌC DỮ LIỆU
  let filteredRooms = rooms.filter(room => {
    const matchSearch = room.Title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        room.District?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDistrict = selectedDistrict === 'Tất cả' || room.District === selectedDistrict;
    
    let matchPrice = true;
    const price = room.Price || 0;
    if (priceRange === 'under-3') {
      matchPrice = price < 3000000;
    } else if (priceRange === '3-5') {
      matchPrice = price >= 3000000 && price <= 5000000;
    } else if (priceRange === '5-10') {
      matchPrice = price > 5000000 && price <= 10000000;
    } else if (priceRange === 'over-10') {
      matchPrice = price > 10000000;
    }

    return matchSearch && matchDistrict && matchPrice;
  });

  // LOGIC SẮP XẾP GIÁ
  if (sortPrice === 'asc') {
    filteredRooms.sort((a, b) => a.Price - b.Price);
  } else if (sortPrice === 'desc') {
    filteredRooms.sort((a, b) => b.Price - a.Price);
  }

  const scrollToExplore = () => {
    const element = document.getElementById('explore-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      {/* 1. AUTO BANNER CAROUSEL CỰC KHỦNG MỚI THÊM VÀO */}
      <div className="relative h-[70vh] w-full overflow-hidden shadow-xl">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 flex items-center justify-center text-center px-4 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${banner.image}')` }}
          >
            <div className="max-w-3xl transform transition-transform duration-700">
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6 animate-fade-in">
                {banner.title.split(' ')[0]} <span className="text-blue-400">{banner.title.substring(banner.title.indexOf(' '))}</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 mb-8 font-medium max-w-2xl mx-auto">
                {banner.subtitle}
              </p>
              <button 
                onClick={scrollToExplore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95"
              >
                Khám Phá Ngay 🚀
              </button>
            </div>
          </div>
        ))}
        
        {/* Nút chấm chuyển slide nhỏ gọn dưới đáy banner */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* KHU VỰC CHÍNH BỘ LỌC VÀ TIN PHÒNG */}
      <div id="explore-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* BỘ LỌC TÌM KIẾM 4 CỘT DỌC THẲNG HÀNG */}
        <div className="bg-blue-600 rounded-3xl p-8 mb-12 shadow-xl shadow-blue-200 flex flex-col lg:flex-row gap-4 items-end justify-between">
          <div className="w-full lg:w-2/5">
            <h2 className="text-xl font-bold text-white mb-4">Bộ lọc tìm kiếm nhanh</h2>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-2xl">🔍</span>
              <input
                type="text"
                placeholder="Ví dụ: Studio, Bình Thạnh..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-blue-100 font-semibold mb-2 ml-1">Khu vực</label>
              <select 
                className="w-full p-4 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner cursor-pointer"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-blue-100 font-semibold mb-2 ml-1">Phân khúc giá</label>
              <select 
                className="w-full p-4 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner cursor-pointer"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="Tất cả">Tất cả khoảng giá</option>
                <option value="under-3">Dưới 3 triệu 💸</option>
                <option value="3-5">Từ 3 - 5 triệu 💵</option>
                <option value="5-10">Từ 5 - 10 triệu 💷</option>
                <option value="over-10">Trên 10 triệu 💎</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-blue-100 font-semibold mb-2 ml-1">Sắp xếp giá</label>
              <select 
                className="w-full p-4 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner cursor-pointer"
                value={sortPrice}
                onChange={(e) => setSortPrice(e.target.value)}
              >
                <option value="default">Mặc định (Mới nhất)</option>
                <option value="asc">Giá: Thấp đến Cao 📈</option>
                <option value="desc">Giá: Cao xuống Thấp 📉</option>
              </select>
            </div>
          </div>
        </div>

        {/* TIÊU ĐỀ HỨNG KẾT QUẢ */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Tổng cộng {filteredRooms.length} phòng trọ phù hợp tiêu chí...
          </h2>
        </div>

        {/* GRID KẾT QUẢ PHÒNG TRỌ */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {filteredRooms.map(room => (
              <div key={room.RoomID} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                <div className="relative h-56 overflow-hidden">
                  <img src={room.ImageURL || 'https://via.placeholder.com/400x300'} alt={room.Title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-blue-700 shadow-sm">
                    {room.District}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{room.Title}</h3>
                  <p className="text-2xl font-black text-teal-600 mb-4">{Number(room.Price).toLocaleString('vi-VN')} VNĐ<span className="text-sm text-gray-500 font-medium">/tháng</span></p>
                  <div className="flex items-center gap-4 text-gray-600 text-sm mb-6 font-medium">
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg">📏 {room.Area} m²</div>
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg truncate">📍 {room.Address || 'Đang cập nhật'}</div>
                  </div>
                  <Link to={`/room/${room.RoomID}`} className="block w-full text-center bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold py-3.5 rounded-xl transition-colors duration-300">Xem Chi Tiết Phòng</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mb-24">
            <span className="text-6xl mb-4 block">🏜️</span>
            <h3 className="text-2xl font-bold text-gray-800">Không tìm thấy phòng nào!</h3>
            <button onClick={() => { setSearchTerm(''); setSelectedDistrict('Tất cả'); setPriceRange('Tất cả'); setSortPrice('default'); }} className="mt-6 bg-blue-100 text-blue-700 font-bold px-6 py-2.5 rounded-full hover:bg-blue-200 transition">Xóa bộ lọc</button>
          </div>
        )}

        {/* THÔNG TIN SEO GIỚI THIỆU */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-wide">Kênh thông tin Phòng trọ hàng đầu Việt Nam</h2>
            <p className="text-gray-600 leading-relaxed mb-10 text-base">
              Chào mừng bạn đến với <strong className="text-blue-600">RoomHub</strong>, nền tảng công nghệ chuyên biệt hỗ trợ tìm kiếm phòng trọ, nhà nguyên căn, căn hộ dịch vụ tốt nhất hiện nay. Chúng tôi mang lại sự minh bạch, tin cậy tuyệt đối giúp kết nối trực tiếp giữa chủ nhà (Saler) và người thuê phòng, cắt giảm tối đa thời gian và chi phí trung gian.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">⚡</div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-lg mb-1">Chuyên môn hóa về phòng trọ</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Không giống những trang bất động sản hỗn tạp khác, RoomHub chỉ tập trung duy nhất vào ngách phòng trọ và căn hộ cho thuê, giúp dữ liệu luôn chính xác và tinh khiết.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">🔒</div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-lg mb-1">Thông tin minh bạch - Hạn chế rủi ro</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Mọi phòng trọ đều được kiểm duyệt kỹ lưỡng từ địa chỉ thực tế, giá cả công khai đến hình ảnh chân thực, loại bỏ hoàn toàn các tình trạng phòng "ảo", lừa đảo cọc.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">📊</div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-lg mb-1">Nguồn tin dồi dào, cập nhật liên tục</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Hệ thống ghi nhận hàng trăm lượt cập nhật mỗi ngày từ đội ngũ chủ phòng lớn tại khắp các quận huyện TP.HCM, đảm bảo đáp ứng mọi phân khúc ngân sách.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">🎯</div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-lg mb-1">Bộ lọc thông minh, dễ sử dụng</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Tích hợp sẵn bộ lọc theo tên, phân khúc giá tiền chi tiết và danh sách quận huyện gọn gàng giúp ní tìm kiếm căn phòng mơ ước chỉ sau vài cú click chuột.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THỐNG KÊ & PHẢN HỒI KHÁCH HÀNG */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-black text-gray-900">Tại sao lại lựa chọn RoomHub?</h3>
            <p className="text-gray-500 mt-2 font-medium">Con số biết nói và những phản hồi thực tế nhất từ khách hàng hệ thống</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
              <p className="text-3xl sm:text-4xl font-black text-blue-600">50.000+</p>
              <p className="text-xs sm:text-sm font-bold text-gray-500 mt-2 uppercase">Chủ nhà & Môi giới</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
              <p className="text-3xl sm:text-4xl font-black text-blue-600">95.000+</p>
              <p className="text-xs sm:text-sm font-bold text-gray-500 mt-2 uppercase">Phòng trọ sẵn sàng</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
              <p className="text-3xl sm:text-4xl font-black text-blue-600">1.200+</p>
              <p className="text-xs sm:text-sm font-bold text-gray-500 mt-2 uppercase">Tin đăng mới / ngày</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
              <p className="text-3xl sm:text-4xl font-black text-blue-600">2.5 Triệu+</p>
              <p className="text-xs sm:text-sm font-bold text-gray-500 mt-2 uppercase">Lượt xem / tháng</p>
            </div>
          </div>
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-3xl p-8 text-center max-w-3xl mx-auto">
            <p className="text-amber-500 text-xl font-bold mb-2">⭐⭐⭐⭐⭐</p>
            <p className="text-gray-700 italic font-medium text-base leading-relaxed">
              "Trước khi biết đến RoomHub, mình phải tốn rất nhiều công sức và chi phí chạy vạy khắp nơi để dán biển, phát tờ rơi tìm người thuê phòng nhưng hiệu quả mang lại rất thấp. Từ lúc đăng tin lên đây, nhờ cơ chế lọc khu vực Quận chuẩn chỉ, phòng mình luôn trong tình trạng kín chỗ, khách thuê lịch sự văn minh!"
            </p>
            <p className="text-gray-900 font-extrabold mt-4 text-sm">— Anh Khánh (Chủ chuỗi hệ thống phòng trọ cao cấp tại Quận 7)</p>
          </div>
        </div>

        {/* ĐĂNG TIN HỖ TRỢ */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex w-24 h-24 rounded-full bg-blue-50 items-center justify-center text-5xl shadow-inner">👩‍💻</div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Hỗ trợ đối tác & đăng tin</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">Ní có phòng trọ cần cho thuê gấp? Cần hỗ trợ kỹ thuật hoặc tư vấn duyệt đơn đặt phòng? Liên hệ hotline tổng đài 24/7 của RoomHub ngay nhé!</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <a href="tel:0909316890" className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all text-sm text-center">📞 ĐT: 0909316890</a>
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all text-sm text-center">💬 Zalo: 0909316890</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
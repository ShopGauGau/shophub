import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section - Thêm hiệu ứng màu Gradient và Background mờ ảo */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-24 overflow-hidden">
         {/* Bong bóng trang trí */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-200 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-300 opacity-30 blur-3xl"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-6 drop-shadow-sm">
            Về RoomHub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Nền tảng kết nối người thuê trọ và chủ nhà uy tín, minh bạch hàng đầu Việt Nam.
          </p>
        </div>
      </div>

      {/* Sứ mệnh & Tầm nhìn - Thêm khung ảnh lệch và hiệu ứng nẩy cho các con số */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Cột Hình ảnh */}
          <div className="lg:w-1/2 relative">
            {/* Khung viền lệch tạo điểm nhấn */}
            <div className="absolute inset-0 bg-blue-600 rounded-3xl transform translate-x-4 translate-y-4 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" 
              alt="Văn phòng RoomHub" 
              className="relative rounded-3xl shadow-2xl object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          
          {/* Cột Nội dung */}
          <div className="lg:w-1/2 flex flex-col gap-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                RoomHub ra đời với mục tiêu giải quyết nỗi lo tìm phòng trọ của sinh viên và người đi làm. 
                Chúng tôi cung cấp hệ thống tìm kiếm thông minh, thông tin xác thực và quy trình thuê phòng nhanh chóng.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl text-center hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
                <span className="block text-4xl font-extrabold text-blue-600 mb-2">5000+</span>
                <span className="font-semibold text-gray-600">Phòng trọ</span>
              </div>
              <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl text-center hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
                <span className="block text-4xl font-extrabold text-orange-500 mb-2">10000+</span>
                <span className="font-semibold text-gray-600">Người dùng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tại sao chọn chúng tôi - Đổi thành phong cách Dark Mode siêu ngầu kết hợp kính mờ (Glassmorphism) */}
      <div className="bg-gray-900 py-20 text-white relative overflow-hidden">
         {/* Ánh sáng nền */}
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-[100px]"></div>
         <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-16">Tại sao chọn RoomHub?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            
            <div className="p-8 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-3xl hover:-translate-y-2 hover:border-blue-500 transition-all duration-300 group cursor-default shadow-lg">
              <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-300">🛡️</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">Tin cậy</h3>
              <p className="text-gray-400 leading-relaxed text-lg">Mọi thông tin phòng đều được đội ngũ kiểm duyệt xác thực 100% trước khi đăng tải.</p>
            </div>

            <div className="p-8 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-3xl hover:-translate-y-2 hover:border-orange-400 transition-all duration-300 group cursor-default shadow-lg">
              <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-300">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Nhanh chóng</h3>
              <p className="text-gray-400 leading-relaxed text-lg">Giao diện tối ưu giúp bạn tìm được căn phòng ưng ý chỉ trong vài cú click chuột.</p>
            </div>

            <div className="p-8 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-3xl hover:-translate-y-2 hover:border-green-400 transition-all duration-300 group cursor-default shadow-lg">
              <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-300">💰</div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Tiết kiệm</h3>
              <p className="text-gray-400 leading-relaxed text-lg">Giá cả luôn công khai minh bạch, kết nối trực tiếp, tuyệt đối không phí môi giới.</p>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AboutPage;
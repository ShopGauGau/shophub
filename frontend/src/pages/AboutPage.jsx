import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-50 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4">Về RoomHub</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Nền tảng kết nối người thuê trọ và chủ nhà uy tín, minh bạch hàng đầu Việt Nam.
        </p>
      </div>

      {/* Sứ mệnh & Tầm nhìn */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" 
              alt="Văn phòng" 
              className="rounded-3xl shadow-2xl"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-gray-800">Sứ mệnh của chúng tôi</h2>
            <p className="text-gray-600 leading-relaxed">
              RoomHub ra đời với mục tiêu giải quyết nỗi lo tìm phòng trọ của sinh viên và người đi làm. 
              Chúng tôi cung cấp hệ thống tìm kiếm thông minh, thông tin xác thực và quy trình thuê phòng nhanh chóng.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <span className="block text-3xl font-bold text-blue-600">5000+</span>
                <span className="text-sm text-gray-500">Phòng trọ</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <span className="block text-3xl font-bold text-blue-600">10000+</span>
                <span className="text-sm text-gray-500">Người dùng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tại sao chọn chúng tôi */}
      <div className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Tại sao chọn RoomHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-2xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Tin cậy</h3>
              <p className="text-gray-400 text-sm">Mọi thông tin phòng đều được xác thực 100% trước khi đăng tải.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Nhanh chóng</h3>
              <p className="text-gray-400 text-sm">Tìm được phòng trọ ưng ý chỉ trong vài phút thao tác.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Tiết kiệm</h3>
              <p className="text-gray-400 text-sm">Giá cả luôn minh bạch, không phát sinh chi phí môi giới.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
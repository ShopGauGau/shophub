import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-20 relative overflow-hidden">
      {/* Hiệu ứng bong bóng màu mờ ảo ở background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Tiêu đề trang */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow-sm">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            RoomHub luôn sẵn sàng lắng nghe và hỗ trợ bạn. Đừng ngần ngại để lại lời nhắn cho chúng tôi nhé!
          </p>
        </div>

        {/* Khung giao diện chính (Chia 2 cột) */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
          
          {/* Cột Trái: Thông tin liên hệ (Nền xanh bóng bẩy) */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-900 to-blue-700 p-10 lg:p-14 text-white relative overflow-hidden">
            {/* Họa tiết trang trí góc */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500 opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-blue-400 opacity-20"></div>
            
            <h2 className="text-3xl font-bold mb-10 relative z-10">Thông tin liên hệ</h2>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-5">
                <div className="bg-blue-500/30 p-3 rounded-xl text-2xl border border-blue-400/30">📍</div>
                <div>
                  <h3 className="font-semibold text-blue-200 text-sm uppercase tracking-wider mb-1">Trụ sở chính</h3>
                  <p className="text-white text-lg font-medium leading-relaxed">300A Nguyễn Tất Thành,<br/>Phường 13, Quận 4, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-blue-500/30 p-3 rounded-xl text-2xl border border-blue-400/30">📞</div>
                <div>
                  <h3 className="font-semibold text-blue-200 text-sm uppercase tracking-wider mb-1">Đường dây nóng</h3>
                  <p className="text-white text-2xl font-bold tracking-wider">1900 8888</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-blue-500/30 p-3 rounded-xl text-2xl border border-blue-400/30">✉️</div>
                <div>
                  <h3 className="font-semibold text-blue-200 text-sm uppercase tracking-wider mb-1">Email hỗ trợ</h3>
                  <p className="text-white text-lg font-medium">support@roomhub.vn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Form nhập liệu */}
          <div className="lg:w-3/5 p-10 lg:p-14 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Gửi tin nhắn cho RoomHub</h3>
            <form className="flex flex-col gap-6">
              
              {/* Hàng 1: Tên & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    placeholder="email@example.com" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>

              {/* Hàng 2: Nội dung */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung cần hỗ trợ <span className="text-red-500">*</span></label>
                <textarea 
                  placeholder="Bạn đang gặp vấn đề gì? Hãy chia sẻ với chúng tôi..." 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* Nút Submit */}
              <button 
                type="button" 
                className="mt-4 bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto self-end flex items-center justify-center gap-2"
              >
                Gửi tin nhắn 🚀
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
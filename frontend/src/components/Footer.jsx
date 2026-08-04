import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-20 border-t-4 border-blue-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LỚP 1: DANH MỤC LINK PHÂN LOẠI KHU VỰC (SEO LINKS) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          <div>
            <h4 className="font-extrabold text-white mb-4 tracking-wider uppercase text-xs">Phòng trọ, nhà trọ</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Phòng trọ Hồ Chí Minh</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Phòng trọ Hà Nội</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Phòng trọ Đà Nẵng</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Phòng trọ Bình Dương</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Phòng trọ Vũng Tàu</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-4 tracking-wider uppercase text-xs">Thuê nhà nguyên căn</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Thuê nhà Hồ Chí Minh</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Thuê nhà Hà Nội</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Thuê nhà Bình Dương</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Thuê nhà Cần Thơ</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Thuê nhà Đà Nẵng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-4 tracking-wider uppercase text-xs">Cho thuê căn hộ</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Căn hộ dịch vụ HCM</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Căn hộ chung cư Hà Nội</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Căn hộ Bình Dương</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Căn hộ Nha Trang</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Căn hộ Hải Phòng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-4 tracking-wider uppercase text-xs">Cho thuê mặt bằng</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Mặt bằng kinh doanh HCM</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Mặt bằng Hà Nội</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Mặt bằng Đà Nẵng</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Mặt bằng Cần Thơ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-4 tracking-wider uppercase text-xs">Tìm người ở ghép</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Ở ghép giá rẻ Q7</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Tìm bạn ở ghép Quận 1</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Ở ghép Bình Thạnh</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Tìm phòng ở ghép Thủ Đức</a></li>
            </ul>
          </div>
        </div>

        {/* LỚP 2: THÔNG TIN HỆ THỐNG, SOCIAL & THANH TOÁN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-slate-800">
          <div>
            <h4 className="font-extrabold text-white mb-5 uppercase text-sm tracking-wide">Về RoomHub.com</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Giới thiệu công ty</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quy chế hoạt động</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-extrabold text-white mb-5 uppercase text-sm tracking-wide">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn đặt phòng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bảng giá dịch vụ Saler</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Giải quyết khiếu nại</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white mb-5 uppercase text-sm tracking-wide">Thanh toán an toàn</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 flex justify-center items-center hover:bg-slate-700 transition">
                <span className="text-blue-400 font-black text-xs italic">VISA</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 flex justify-center items-center hover:bg-slate-700 transition">
                <span className="text-red-500 font-black text-xs">MASTER</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 flex justify-center items-center hover:bg-slate-700 transition">
                <span className="text-amber-500 font-black text-xs">JCB</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 flex justify-center items-center hover:bg-slate-700 transition">
                <span className="text-pink-500 font-black text-xs">MoMo</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 flex justify-center items-center hover:bg-slate-700 transition">
                <span className="text-emerald-500 font-black text-xs">ZaloPay</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 flex justify-center items-center hover:bg-slate-700 transition">
                <span className="text-orange-500 font-black text-xs">SPay</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white mb-5 uppercase text-sm tracking-wide">Kết nối với chúng tôi</h4>
            <div className="flex gap-4">
              {/* Nút Facebook */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Nút YouTube */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* Nút TikTok */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* LỚP 3: THÔNG TIN PHÁP LÝ & BẢN QUYỀN */}
        <div className="pt-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="text-sm text-slate-400 leading-relaxed">
            <p className="font-extrabold text-white text-base uppercase mb-2 tracking-wide">Công ty TNHH Công nghệ RoomHub Việt Nam</p>
            <p>Trụ sở chính: Khu đô thị tri thức NTTU, Quận 4, Thành phố Hồ Chí Minh, Việt Nam.</p>
            <p className="mt-1">Tổng đài CSKH: <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded ml-1">0909 316 890</span> <span className="mx-2">|</span> Email: cskh.roomhub@gmail.com</p>
            <p className="mt-1">Giấy phép ĐKKD số 0313588502 do Sở Kế hoạch và Đầu tư TP.HCM cấp ngày 24/12/2015.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Badge Bộ Công Thương */}
            <div className="bg-red-600/10 border border-red-500/30 text-red-500 flex items-center gap-2 px-4 py-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold leading-none">ĐÃ ĐĂNG KÝ</span>
                <span className="text-[11px] font-black leading-tight uppercase">Bộ Công Thương</span>
              </div>
            </div>
            {/* Badge DMCA */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 px-4 py-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold leading-none">PROTECTED BY</span>
                <span className="text-[11px] font-black leading-tight uppercase">DMCA.COM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-slate-600 text-xs mt-10 pb-4 border-t border-slate-800 pt-6">
          © {new Date().getFullYear()} RoomHub. Tất cả các quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
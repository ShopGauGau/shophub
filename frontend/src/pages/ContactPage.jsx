import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Liên hệ với chúng tôi</h1>
      <form className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-4">
        <input type="text" placeholder="Họ và tên" className="w-full p-3 border rounded-lg" />
        <input type="email" placeholder="Email của bạn" className="w-full p-3 border rounded-lg" />
        <textarea placeholder="Nội dung cần hỗ trợ" className="w-full p-3 border rounded-lg h-32"></textarea>
        <button className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Gửi tin nhắn
        </button>
      </form>
    </div>
  );
};

// DÒNG NÀY LÀ QUAN TRỌNG NHẤT ĐỂ SỬA LỖI CỦA NÍ:
export default ContactPage;
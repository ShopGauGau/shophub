import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios'; // Nhớ có axios để gọi API nha

const PaymentResultPage = () => {
    const location = useLocation();
    const [status, setStatus] = useState('loading'); 

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef'); // Lấy mã đơn hàng từ VNPAY về

        if (vnp_ResponseCode === '00') {
            setStatus('success');
            
            // MẸO: Tách cái ID đơn đặt phòng ra (Ví dụ "25_142030" -> lấy số "25")
            if (vnp_TxnRef) {
                const bookingId = vnp_TxnRef.split('_')[0]; 
                
                // Âm thầm gọi API báo cho Database biết là khách đã trả tiền!
                axios.put(`https://shophub-qxpt.onrender.com/api/bookings/payment-success/${bookingId}`)
                    .then(() => console.log("Đã cập nhật Database: Đã thanh toán!"))
                    .catch(err => console.error("Lỗi cập nhật DB:", err));
            }

        } else if (vnp_ResponseCode) {
            setStatus('failed');
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
                {status === 'loading' && <h2 className="text-2xl font-bold text-gray-600 animate-pulse">Đang xử lý kết quả...</h2>}
                
                {status === 'success' && (
                    <>
                        <div className="text-8xl mb-6 animate-bounce">✅</div>
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
                        <p className="text-gray-600 mb-8 font-medium text-lg">Cảm ơn bạn đã đặt phòng. Giao dịch qua VNPAY đã được xác nhận thành công.</p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="text-8xl mb-6">❌</div>
                        <h2 className="text-3xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h2>
                        <p className="text-gray-600 mb-8 font-medium text-lg">Khách hàng đã hủy giao dịch hoặc thẻ không đủ tiền để thanh toán.</p>
                    </>
                )}

                <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
                    ← Về trang chủ ngay
                </Link>
            </div>
        </div>
    );
};

export default PaymentResultPage;
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import hashlib
import hmac
import urllib.parse

router = APIRouter()

class VNPAYData(BaseModel):
    BookingID: int
    Amount: int

@router.post("/api/payment/vnpay")
def create_vnpay_url(data: VNPAYData):
    try:
        # MÃ CHUẨN LẤY TỪ HÌNH CỦA THIÊN ĐÂY:
        vnp_TmnCode = "9X0J6T7B"
        vnp_HashSecret = "P1FM7B9901PE4SZ0VFEPL2TMCUN3I7DA" 
        
        vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
        vnp_ReturnUrl = "http://localhost:5173/payment-result" 

        vnp_TxnRef = f"{data.BookingID}_{datetime.now().strftime('%H%M%S')}" 
        vnp_OrderInfo = f"Thanh_toan_dat_phong_RoomHub_ma_don_{data.BookingID}" 
        vnp_Amount = int(data.Amount * 100) 
        vnp_IpAddr = "127.0.0.1"

        inputData = {
            "vnp_Amount": str(vnp_Amount),
            "vnp_Command": "pay",
            "vnp_CreateDate": datetime.now().strftime('%Y%m%d%H%M%S'),
            "vnp_CurrCode": "VND",
            "vnp_IpAddr": vnp_IpAddr,
            "vnp_Locale": "vn",
            "vnp_OrderInfo": vnp_OrderInfo,
            "vnp_OrderType": "billpayment",
            "vnp_ReturnUrl": vnp_ReturnUrl,
            "vnp_TmnCode": vnp_TmnCode,
            "vnp_TxnRef": vnp_TxnRef,
            "vnp_Version": "2.1.0"
        }

        # 1. Bắt buộc sắp xếp dictionary theo Alphabet
        inputData = dict(sorted(inputData.items()))
        
        # 2. Tạo chuỗi query string chuẩn của VNPAY (mã hóa URL từng value)
        query_string_list = []
        for key, val in inputData.items():
            query_string_list.append(f"{key}={urllib.parse.quote_plus(str(val))}")
        
        hashData = "&".join(query_string_list)

        # 3. Băm bằng thuật toán HMAC-SHA512
        hashValue = hmac.new(
            vnp_HashSecret.encode('utf-8'), 
            hashData.encode('utf-8'), 
            hashlib.sha512
        ).hexdigest()

        # 4. Nối mã bảo mật vào đuôi link
        paymentUrl = f"{vnp_Url}?{hashData}&vnp_SecureHash={hashValue}"

        return {"status": "success", "payment_url": paymentUrl}
    except Exception as e:
        return {"status": "error", "message": str(e)}
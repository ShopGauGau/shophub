import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';
import FavoritesPage from './pages/FavoritesPage'; 
import PaymentResultPage from './pages/PaymentResultPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';

// 1. IMPORT TRANG ADMIN DASHBOARD
import AdminDashboard from './pages/AdminDashboard'; 
// IMPORT THÊM TRANG SALER DASHBOARD 
import SalerDashboard from './pages/SalerDashboard';
// IMPORT TRANG ĐĂNG KÝ SALER MỚI NÈ NÍ
import SalerRegisterPage from './pages/SalerRegisterPage';

function App() {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null); 

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("username"); 
    if (savedRole) setRole(savedRole);
    if (savedUser) setUsername(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username"); 
    localStorage.removeItem("userId"); 
    setRole(null);
    setUsername(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <nav className="p-4 bg-white shadow flex items-center justify-between px-10 sticky top-0 z-50">
        <Link to="/" className="font-bold text-blue-600 text-2xl">RoomHub</Link>

        <div className="flex gap-8 font-medium">
          <Link to="/" className="hover:text-blue-500">Trang chủ</Link>
          <Link to="/about" className="hover:text-blue-500">Giới thiệu</Link>
          <Link to="/contact" className="hover:text-blue-500">Liên hệ</Link>
        </div>

        {role ? (
          <div className="flex items-center gap-4">
            <Link to="/favorites" className="text-red-500 font-bold hover:text-red-600 hover:underline px-2 flex items-center gap-1">
              ❤️ Phòng đã lưu
            </Link>

            <Link to="/my-bookings" className="text-blue-600 font-bold hover:text-blue-700 hover:underline px-2 flex items-center gap-1">
              📅 Lịch sử đặt
            </Link>

            <Link to="/profile" className="font-semibold text-gray-700 border-l border-gray-300 pl-4 hover:text-blue-600 hover:underline transition">
              Chào, {username}!
            </Link>
            
            {/* NÚT BẤM CHO ADMIN (Role = 1) */}
            {role === "1" && (
              <Link to="/admin-dashboard" className="text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition flex items-center gap-2 border border-blue-200 ml-2">
                ⚙️ Quản Trị Hệ Thống
              </Link>
            )}

            {/* NÚT BẤM CHO SALER (Role = 2) */}
            {role === "2" && (
              <Link to="/saler-dashboard" className="text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 hover:text-purple-700 transition flex items-center gap-2 border border-purple-200 ml-2">
                💼 Kênh Người Bán
              </Link>
            )}

            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition ml-2"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          /* THÊM NÚT TRỞ THÀNH SALER KHI CHƯA ĐĂNG NHẬP Ở ĐÂY NÈ */
          <div className="flex items-center gap-3">
            <Link to="/register-saler" className="text-indigo-600 font-bold hover:text-indigo-800 transition px-3 py-2 rounded-lg bg-indigo-50">
              💼 Trở thành Saler
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
              Đăng nhập / Đăng ký
            </Link>
          </div>
        )}
      </nav>

      <div className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/room/:id" element={<RoomDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* KHAI BÁO ROUTE CHO TRANG ĐĂNG KÝ SALER NÈ */}
          <Route path="/register-saler" element={<SalerRegisterPage />} />
          
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
          <Route path="/saler-dashboard" element={<SalerDashboard />} /> 
          
          <Route path="/favorites" element={<FavoritesPage />} /> 
          <Route path="/payment-result" element={<PaymentResultPage />} /> 
          <Route path="/my-bookings" element={<MyBookingsPage />} /> 
          <Route path="/profile" element={<ProfilePage />} /> 
        </Routes>
      </div>

      <Footer /> 
    </Router>
  );
}

export default App;
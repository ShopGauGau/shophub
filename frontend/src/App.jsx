import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AdminBookingsPage from './pages/AdminBookingsPage'; 
import Footer from './components/Footer';
import FavoritesPage from './pages/FavoritesPage'; // Đã có sẵn nè

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
            {/* NÚT PHÒNG ĐÃ LƯU TUI MỚI THÊM VÔ NÈ NÍ */}
            <Link to="/favorites" className="text-red-500 font-bold hover:text-red-600 hover:underline px-2 flex items-center gap-1">
              ❤️ Phòng đã lưu
            </Link>

            <span className="font-semibold text-gray-700 border-l border-gray-300 pl-4">Chào, {username}!</span>
            
            {/* MENU CHO ADMIN */}
            {role === "1" && (
              <>
                <Link to="/admin" className="text-teal-600 font-bold hover:underline px-2">Quản lý phòng</Link>
                <Link to="/admin-bookings" className="text-orange-600 font-bold hover:underline px-2">Đơn đặt</Link>
              </>
            )}

            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition ml-2"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Đăng nhập / Đăng ký
          </Link>
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
          
          {/* CÁC ROUTE CỦA ADMIN */}
          <Route path="/admin" element={<AdminPage />} /> 
          <Route path="/admin-bookings" element={<AdminBookingsPage />} /> 
          
          {/* ROUTE CHO TRANG YÊU THÍCH TUI MỚI GẮN */}
          <Route path="/favorites" element={<FavoritesPage />} /> 
        </Routes>
      </div>

      <Footer /> 
    </Router>
  );
}

export default App;
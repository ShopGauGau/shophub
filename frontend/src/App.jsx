import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage'; // Tui thêm dòng import AdminPage cho ní nè
import Footer from './components/Footer';

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
            <span className="font-semibold text-gray-700">Chào, {username}!</span>
            
            {/* CÁI NÚT VÀO TRANG ADMIN TUI LÀM SẴN Ở ĐÂY NÈ */}
            {role === "1" && (
              <Link to="/admin" className="text-teal-600 font-bold hover:underline px-2">
                Trang Quản Trị
              </Link>
            )}

            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition"
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
          
          {/* Tui đăng ký cái route trang Admin luôn rồi nè */}
          <Route path="/admin" element={<AdminPage />} /> 
        </Routes>
      </div>

      <Footer /> 
    </Router>
  );
}

export default App;
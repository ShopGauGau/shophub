import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import Footer from './components/Footer'; // Import Footer đã làm

function App() {
  return (
    <Router>
      {/* Thanh Nav */}
      <nav className="p-4 bg-white shadow flex items-center justify-between px-10 sticky top-0 z-50">
        <Link to="/" className="font-bold text-blue-600 text-2xl">RoomHub</Link>

        <div className="flex gap-8 font-medium">
          <Link to="/" className="hover:text-blue-500">Trang chủ</Link>
          <Link to="/about" className="hover:text-blue-500">Giới thiệu</Link>
          <Link to="/contact" className="hover:text-blue-500">Liên hệ</Link>
        </div>

        <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
          Đăng nhập / Đăng ký
        </Link>
      </nav>

      {/* Danh sách các trang */}
      <div className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/room/:id" element={<RoomDetailsPage />} />
        </Routes>
      </div>

      {/* Footer được tách rời */}
      <Footer /> 
    </Router>
  );
}

export default App;
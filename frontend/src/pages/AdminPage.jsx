import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [editingRoomId, setEditingRoomId] = useState(null); 
  
  // ĐÃ THÊM MapURL VÀO FORM DATA
  const [formData, setFormData] = useState({ 
    Title: '', Price: '', Area: '', District: '', Address: '', ImageURL: '', Description: '', MapURL: '' 
  }); 
  
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "1") {
      alert("Ní không có quyền vào trang quản trị!");
      window.location.href = "/"; 
      return;
    }
    fetchRooms();
  }, [role]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('https://shophub-qxpt.onrender.com/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách phòng:", err);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Ní có chắc chắn muốn xóa phòng này không? Các đơn đặt phòng cũ của phòng này cũng sẽ bị xóa theo nha!")) {
      try {
        await axios.delete(`https://shophub-qxpt.onrender.com/api/rooms/delete/${roomId}`, {
          headers: { role: role }
        });
        fetchRooms(); 
      } catch (err) {
        alert(err.response?.data?.detail || "Lỗi xóa phòng!");
      }
    }
  };

  const handleEditClick = (room) => {
    setEditingRoomId(room.RoomID); 
    setFormData({
      Title: room.Title || '',
      Price: room.Price || '',
      Area: room.Area || '',
      District: room.District || '',
      Address: room.Address || '',
      ImageURL: room.ImageURL || '',
      Description: room.Description || '',
      MapURL: room.MapURL || '' // Load lại link Map cũ nếu có
    });
    setShowAddForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingRoomId(null);
    setFormData({ Title: '', Price: '', Area: '', District: '', Address: '', ImageURL: '', Description: '', MapURL: '' });
  };

  const handleSaveRoom = async () => {
    if (!formData.Title || !formData.Price) {
      alert("Bạn điền thiếu Tên phòng hoặc Giá kìa!");
      return;
    }
    try {
      if (editingRoomId) {
        await axios.put(`https://shophub-qxpt.onrender.com/api/rooms/edit/${editingRoomId}`, formData, {
          headers: { role: role }
        });
      } else {
        await axios.post('https://shophub-qxpt.onrender.com/api/rooms/add', formData, {
          headers: { role: role }
        });
      }
      handleCancel(); 
      fetchRooms(); 
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi lưu phòng!");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-teal-800">Quản lý phòng trọ (Admin)</h2>
          <button 
            onClick={showAddForm ? handleCancel : () => setShowAddForm(true)}
            className={`${showAddForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-teal-600 hover:bg-teal-700'} text-white px-5 py-2 rounded-lg font-bold transition shadow-lg`}
          >
            {showAddForm ? "Hủy" : "+ Thêm phòng mới"}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
              {editingRoomId ? `Đang sửa phòng ID: ${editingRoomId}` : "Nhập thông tin phòng mới"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Tiêu đề phòng (*)</label>
                <input className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.Title} onChange={(e) => setFormData({ ...formData, Title: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Giá thuê (VND) (*)</label>
                <input type="number" className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.Price} onChange={(e) => setFormData({ ...formData, Price: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Diện tích (m2)</label>
                <input type="number" className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.Area} onChange={(e) => setFormData({ ...formData, Area: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Khu vực</label>
                <input className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.District} onChange={(e) => setFormData({ ...formData, District: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Link hình ảnh</label>
                <input className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.ImageURL} onChange={(e) => setFormData({ ...formData, ImageURL: e.target.value })} />
              </div>

              {/* Ô NHẬP GOOGLE MAPS Ở ĐÂY NÈ */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Link nhúng Google Maps</label>
                <input placeholder="Dán link src của iframe vào đây..." className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.MapURL} onChange={(e) => setFormData({ ...formData, MapURL: e.target.value })} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Địa chỉ chi tiết</label>
                <input className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.Address} onChange={(e) => setFormData({ ...formData, Address: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Mô tả phòng</label>
                <textarea rows="3" className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.Description} onChange={(e) => setFormData({ ...formData, Description: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-400 transition">Hủy</button>
              <button onClick={handleSaveRoom} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition">💾 {editingRoomId ? "Cập nhật" : "Lưu"}</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tên phòng</th>
                <th className="p-4">Giá (VND)</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.RoomID} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{room.RoomID}</td>
                  <td className="p-4 font-semibold text-gray-800">{room.Title}</td>
                  <td className="p-4 text-red-600 font-bold">{room.Price}</td>
                  <td className="p-4 text-center space-x-3">
                    <button onClick={() => handleEditClick(room)} className="bg-yellow-500 text-white px-4 py-1 rounded-md font-medium hover:bg-yellow-600 shadow">Sửa</button>
                    <button onClick={() => handleDelete(room.RoomID)} className="bg-red-500 text-white px-4 py-1 rounded-md font-medium hover:bg-red-600 shadow">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
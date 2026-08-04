import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    Title: '', Price: '', Area: '', District: '',
    Address: '', ImageURL: '', Description: '', MapURL: '', SalerID: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Lấy role và userId từ LocalStorage
  const userRole = localStorage.getItem('role') || '1';
  const userId = localStorage.getItem('userId') || '';

  // Config Header gửi kèm cho Axios (Đã fix lỗi dấu gạch nối)
  const getAuthHeaders = () => ({
    headers: {
      'role': userRole,
      'user-id': userId // <-- Bí kíp nằm ở đây nè ní, đổi gạch dưới thành gạch nối!
    }
  });

  // 1. LẤY DANH SÁCH PHÒNG PHÂN QUYỀN
  const fetchRooms = () => {
    axios.get('https://roomhub-api.onrender.com/api/admin/rooms', getAuthHeaders())
      .then(res => setRooms(res.data))
      .catch(err => console.error("Lỗi lấy danh sách phòng:", err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. THÊM HOẶC SỬA PHÒNG
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      Price: parseFloat(formData.Price) || 0,
      Area: parseFloat(formData.Area) || 0,
      SalerID: formData.SalerID ? parseInt(formData.SalerID) : null
    };

    if (editingId) {
      // API Sửa
      axios.put(`https://roomhub-api.onrender.com/api/rooms/edit/${editingId}`, payload, getAuthHeaders())
        .then(() => {
          alert("Cập nhật phòng thành công!");
          resetForm();
          fetchRooms();
        })
        .catch(err => alert("Lỗi sửa phòng: " + (err.response?.data?.detail || err.message)));
    } else {
      // API Thêm
      axios.post('https://roomhub-api.onrender.com/api/rooms/add', payload, getAuthHeaders())
        .then(() => {
          alert("Thêm phòng mới thành công!");
          resetForm();
          fetchRooms();
        })
        .catch(err => alert("Lỗi thêm phòng: " + (err.response?.data?.detail || err.message)));
    }
  };

  // 3. XÓA PHÒNG
  const handleDelete = (id) => {
    if (window.confirm("Ní có chắc muốn xóa căn phòng này không?")) {
      axios.delete(`https://roomhub-api.onrender.com/api/rooms/delete/${id}`, getAuthHeaders())
        .then(() => {
          alert("Đã xóa phòng thành công!");
          fetchRooms();
        })
        .catch(err => alert("Lỗi xóa phòng: " + (err.response?.data?.detail || err.message)));
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.RoomID);
    setFormData({
      Title: room.Title || '',
      Price: room.Price || '',
      Area: room.Area || '',
      District: room.District || '',
      Address: room.Address || '',
      ImageURL: room.ImageURL || '',
      Description: room.Description || '',
      MapURL: room.MapURL || '',
      SalerID: room.SalerID || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ Title: '', Price: '', Area: '', District: '', Address: '', ImageURL: '', Description: '', MapURL: '', SalerID: '' });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {userRole === '1' ? 'Quản Lý Toàn Bộ Phòng Trọ (Admin)' : 'Danh Sách Phòng Phụ Trách (Saler)'}
          </h2>
          <p className="text-sm text-gray-500">
            {userRole === '1' ? 'Quản lý toàn bộ hệ thống phòng' : `Đang hiển thị phòng thuộc quản lý của Saler ID: ${userId}`}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition shadow"
        >
          ➕ Thêm Phòng Mới
        </button>
      </div>

      {/* BẢNG DANH SÁCH PHÒNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên phòng</th>
              <th className="p-4">Khu vực</th>
              <th className="p-4">Giá thuê</th>
              {userRole === '1' && <th className="p-4">Saler Quản Lý</th>}
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rooms.map((room) => (
              <tr key={room.RoomID} className="hover:bg-gray-50">
                <td className="p-4">
                  <img src={room.ImageURL || 'https://via.placeholder.com/100'} alt="" className="w-16 h-12 object-cover rounded-lg" />
                </td>
                <td className="p-4 font-bold text-gray-800">{room.Title}</td>
                <td className="p-4">{room.District}</td>
                <td className="p-4 font-bold text-teal-600">{Number(room.Price).toLocaleString('vi-VN')} đ</td>
                {userRole === '1' && (
                  <td className="p-4">
                    <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-bold">
                      {room.SalerID ? `Saler ID: ${room.SalerID}` : 'Chưa gán'}
                    </span>
                  </td>
                )}
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => handleEdit(room)} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg font-bold text-xs hover:bg-amber-200">✏️ Sửa</button>
                  <button onClick={() => handleDelete(room.RoomID)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold text-xs hover:bg-red-200">🗑️ Xóa</button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={userRole === '1' ? 6 : 5} className="p-8 text-center text-gray-400">Không có phòng nào trong danh sách!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM THÊM / SỬA PHÒNG */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Chỉnh Sửa Phòng' : 'Thêm Phòng Mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">Tên phòng *</label>
                <input type="text" name="Title" value={formData.Title} onChange={handleChange} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">Giá thuê (VNĐ) *</label>
                  <input type="number" name="Price" value={formData.Price} onChange={handleChange} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">Diện tích (m²)</label>
                  <input type="number" name="Area" value={formData.Area} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">Quận / Huyện</label>
                  <input type="text" name="District" value={formData.District} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {userRole === '1' && (
                  <div>
                    <label className="text-xs font-bold text-purple-600">Gán Saler ID (Admin)</label>
                    <input type="number" name="SalerID" value={formData.SalerID} onChange={handleChange} placeholder="Ví dụ: 7" className="w-full border border-purple-200 bg-purple-50/50 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Địa chỉ chi tiết</label>
                <input type="text" name="Address" value={formData.Address} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Link hình ảnh (URL)</label>
                <input type="text" name="ImageURL" value={formData.ImageURL} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Link Google Map (Embed URL)</label>
                <input type="text" name="MapURL" value={formData.MapURL} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Mô tả chi tiết</label>
                <textarea name="Description" value={formData.Description} onChange={handleChange} rows="3" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-200 font-bold text-gray-700 hover:bg-gray-300">Hủy</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700">{editingId ? 'Cập Nhật' : 'Tạo Mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
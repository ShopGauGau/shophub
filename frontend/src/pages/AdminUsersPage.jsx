import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); 
  
  // State để quản lý Modal chi tiết User
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/admin/users', {
      headers: {
        'role': localStorage.getItem('role'),
        'user-id': localStorage.getItem('userId')
      }
    })
    .then(res => {
      setUsers(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi lấy danh sách tài khoản:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeUserStatus = (e, userId, currentStatus) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài làm mở Modal
    const nextStatus = currentStatus === 'active' ? 'locked' : 'active';
    const actionText = nextStatus === 'active' ? 'mở khóa' : 'khóa';

    if (window.confirm(`Ní có chắc muốn ${actionText} tài khoản này không?`)) {
      axios.put(`http://127.0.0.1:8000/api/admin/users/status/${userId}`, { status: nextStatus }, {
        headers: {
            'role': localStorage.getItem('role'),
        }
      })
        .then(() => {
          alert(`Đã ${actionText} tài khoản thành công!`);
          fetchUsers();
          if (showModal && selectedUser?.UserID === userId) {
            setShowModal(false); // Đóng modal nếu đang xem tài khoản đó
          }
        })
        .catch(err => alert("Lỗi xử lý rồi ní ơi: " + err.message));
    }
  };

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || String(user.RoleID) === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans relative">
      
      {/* HEADER */}
      <div className="mb-10 pb-6 border-b border-slate-200 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight flex items-center gap-3">
            <span className="text-4xl">👥</span> Trung Tâm Quản Trị Tài Khoản
          </h2>
          <p className="text-slate-600 mt-2 text-base font-medium">Bảng điều khiển tối mật giúp ní kiểm soát, phân hệ và bảo mật toàn bộ người dùng hệ thống.</p>
        </div>
        <button 
            onClick={fetchUsers}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 flex-shrink-0"
        >
            🔄 Tải lại dữ liệu mới nhất
        </button>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div className="bg-white rounded-3xl p-8 mb-10 shadow-2xl shadow-slate-100 border border-slate-100 flex flex-col xl:flex-row gap-6 items-center justify-between">
        
        <div className="w-full xl:w-1/2 relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-2xl group-focus-within:text-purple-500 transition-colors">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email tài khoản... ví dụ: thien, khoa, tien"
            className="w-full pl-14 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-purple-200 focus:bg-white font-medium transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full xl:w-auto flex items-center gap-3 self-start xl:self-auto bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2 hidden sm:block">Phân hệ:</span>
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${roleFilter === 'all' ? 'bg-slate-950 text-white shadow-xl scale-105' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Tất Cả ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('2')}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${roleFilter === '2' ? 'bg-purple-600 text-white shadow-xl scale-105' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'}`}
          >
            💼 Saler ({users.filter(u => String(u.RoleID) === '2').length})
          </button>
          <button
            onClick={() => setRoleFilter('3')}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${roleFilter === '3' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-blue-700 bg-blue-50 hover:bg-blue-100'}`}
          >
            👤 User ({users.filter(u => String(u.RoleID) === '3').length})
          </button>
        </div>

      </div>

      {/* DANH SÁCH USER (ĐÃ FIX LỆCH CỘT & THÊM CLICK MỞ MODAL) */}
      <div className="space-y-4">
        {filteredUsers.map((user) => {
          let roleBadgeClass = "bg-slate-100 text-slate-700 border-slate-200";
          let roleName = "Hệ thống";
          let avatarClass = "bg-slate-100 text-slate-600";
          
          if (String(user.RoleID) === '1') { 
            roleBadgeClass = "bg-rose-50 text-rose-700 border-rose-200"; 
            roleName = "👑 ADMIN tối cao";
            avatarClass = "bg-rose-100 text-rose-700";
          }
          if (String(user.RoleID) === '2') { 
            roleBadgeClass = "bg-purple-50 text-purple-700 border-purple-200"; 
            roleName = "💼 Đối Tác (Saler)";
            avatarClass = "bg-purple-100 text-purple-700";
          }
          if (String(user.RoleID) === '3') { 
            roleBadgeClass = "bg-blue-50 text-blue-700 border-blue-200"; 
            roleName = "👤 Khách Hàng (User)";
            avatarClass = "bg-blue-100 text-blue-700";
          }

          const isLocked = user.Status === 'locked';

          return (
            <div 
              key={user.UserID}
              onClick={() => handleOpenDetails(user)}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 hover:-translate-y-0.5 transform transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group cursor-pointer"
            >
              {/* Cột 1: Thông tin (Fix width 40%) */}
              <div className="flex items-center gap-4 min-w-0 lg:w-2/5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner flex-shrink-0 ${avatarClass}`}>
                  {user.FullName ? user.FullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-slate-900 text-base truncate group-hover:text-purple-700 transition-colors">{user.FullName}</p>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border tracking-wider uppercase ${roleBadgeClass}`}>
                      {roleName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono tracking-tight truncate">{user.Email}</p>
                </div>
              </div>

              {/* Cột 2: Số điện thoại (Fix width 25% và canh giữa) */}
              <div className="text-xs text-slate-600 font-semibold bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 lg:w-1/4 text-center whitespace-nowrap">
                📞 Liên hệ: <span className="font-bold text-slate-900 font-mono ml-1">{user.PhoneNumber || 'Chưa cập nhật'}</span>
              </div>

              {/* Cột 3: Nút điều khiển (Fix width 35% và canh phải) */}
              <div className="flex items-center justify-end gap-3 border-t pt-4 lg:border-none lg:pt-0 lg:w-[35%]">
                <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black border tracking-wide whitespace-nowrap ${!isLocked ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                  {!isLocked ? '🟢 ĐANG HOẠT ĐỘNG' : '🔴 ĐANG BỊ KHÓA'}
                </span>

                {String(user.RoleID) !== '1' && ( 
                  <button
                    onClick={(e) => handleChangeUserStatus(e, user.UserID, user.Status)}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all border shadow-sm whitespace-nowrap ${!isLocked ? 'bg-white hover:bg-rose-50 border-rose-200 text-rose-600 hover:scale-105' : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-105'}`}
                  >
                    {!isLocked ? 'Khóa Tài Khoản 🔒' : 'Mở Khóa Ngay 🔓'}
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100">
            <span className="text-7xl mb-6 block animate-bounce">🔍</span>
            <h3 className="text-xl font-bold text-slate-800">Không tìm thấy tài khoản nào!</h3>
            <p className="text-slate-500 mt-2 font-medium">Ní thử thay đổi từ khóa tìm kiếm hoặc bộ lọc phân hệ xem sao nha.</p>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* MODAL POPUP CHI TIẾT TÀI KHOẢN */}
      {/* ========================================================== */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100">
            
            {/* Header Modal */}
            <div className={`px-6 py-5 flex items-center justify-between text-white ${String(selectedUser.RoleID) === '2' ? 'bg-purple-900' : String(selectedUser.RoleID) === '1' ? 'bg-rose-900' : 'bg-blue-900'}`}>
              <div>
                <h3 className="text-lg font-black tracking-tight">🔍 Hồ Sơ Người Dùng #{selectedUser.UserID}</h3>
                <p className="text-xs text-white/70 mt-0.5">Hệ thống quản trị RoomHub</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-5">
              
              <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-slate-100">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl mb-3 shadow-inner ${String(selectedUser.RoleID) === '2' ? 'bg-purple-100 text-purple-700' : String(selectedUser.RoleID) === '1' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedUser.FullName ? selectedUser.FullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 className="text-xl font-black text-slate-900">{selectedUser.FullName}</h2>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${String(selectedUser.RoleID) === '2' ? 'bg-purple-50 text-purple-700 border-purple-200' : String(selectedUser.RoleID) === '1' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {String(selectedUser.RoleID) === '1' ? "👑 ADMIN Tối Cao" : String(selectedUser.RoleID) === '2' ? "💼 Đối Tác (Saler)" : "👤 Khách Hàng (User)"}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Trạng thái:</span> 
                    <span className={`font-black ${selectedUser.Status === 'locked' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {selectedUser.Status === 'locked' ? '🔴 Đã Khóa' : '🟢 Hoạt Động'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Email liên hệ:</span> 
                    <span className="font-bold text-slate-800 font-mono bg-slate-100 px-2 py-1 rounded">{selectedUser.Email}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Số điện thoại:</span> 
                    <span className="font-black text-blue-600 font-mono">{selectedUser.PhoneNumber || 'Chưa cập nhật'}</span>
                </div>
              </div>

            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-white hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsersPage;
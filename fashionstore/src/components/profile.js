// src/pages/Profile.js

import React from 'react';
import { useAuth } from '../context/AuthContext'; // 👈 Điều chỉnh đường dẫn nếu cần
import '../state/profile.css'; // 👈 Import file CSS

const ProfilePage = () => {
  // 1. Lấy user và hàm logout từ AuthContext
  // ⛔ Bỏ "fullName" ra khỏi đây
  const { user, logout } = useAuth();

  // 2. Xử lý trường hợp user chưa đăng nhập
  if (!user) {
    return (
      <div className="profile-container">
        <p>Bạn chưa đăng nhập. Vui lòng đăng nhập.</p>
      </div>
    );
  }

  // 3. Trích xuất thông tin từ object user
  // ✅ Dữ liệu user giờ sẽ có dạng: { username: "...", fullName: "...", authorities: [...] }
  const { username, authorities, fullName } // 👈 ✅ Thêm fullName vào đây
    = user; 

  // Lấy danh sách tên các quyền (ví dụ: "ADMIN", "USER")
  const roles = authorities.map(auth => 
    auth.authority.replace('ROLE_', '') // Bỏ tiền tố "ROLE_" cho đẹp
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Trang cá nhân</h2>

        {/* ======================================= */}
        {/* --- ✅ MỚI: Hiển thị Tên đầy đủ --- */}
        {/* ======================================= */}
        <div className="profile-info">
          <label>Tên đầy đủ</label>
          {/* Sử dụng biến fullName vừa lấy ra */}
          <p>{fullName || '(Chưa cập nhật)'}</p> 
        </div>

        {/* --- Hiển thị Email / Username --- */}
        <div className="profile-info">
          <label>Email (Username)</label>
          <p>{username}</p>
        </div>

        {/* --- Hiển thị Quyền --- */}
        <div className="profile-info">
          <label>Vai trò (Roles)</label>
          {roles.length > 0 ? (
            <ul className="roles-list">
              {roles.map((role, index) => (
                <li key={index} className="role-item">
                  {role}
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có vai trò nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
// src/pages/ChangePassword.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 👈 Import useAuth
import '../state/changepassword.css'; // 👈 Import file CSS

const ChangePasswordPage = () => {
  // 1. Lấy hàm changePassword (sẽ được thêm vào context)
  const { changePassword } = useAuth(); // 👈 BẠN SẼ CẦN THÊM HÀM NÀY VÀO CONTEXT

  // 2. State cho các ô input
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 3. State cho thông báo và trạng thái loading
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 4. Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và mật khẩu xác nhận không khớp.');
      return;
    }

    // 5. Kiểm tra độ dài mật khẩu mới (ví dụ)
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);

    try {
      // 6. Gọi hàm từ context
      // **LƯU Ý:** Bạn cần tự thêm hàm 'changePassword' vào AuthContext
      // và authService. Xem hướng dẫn ở dưới.
      
      // Giả sử bạn đã thêm:
      await changePassword(oldPassword, newPassword, confirmPassword);
      
      setSuccess('Đổi mật khẩu thành công!');
      
      // Xóa các trường sau khi thành công
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      // 7. Bắt lỗi từ service
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cp-container">
      <form className="cp-card" onSubmit={handleSubmit}>
        <h2>Đổi mật khẩu</h2>

        {/* --- Thông báo Lỗi --- */}
        {error && <div className="cp-message cp-error">{error}</div>}
        
        {/* --- Thông báo Thành công --- */}
        {success && <div className="cp-message cp-success">{success}</div>}

        {/* --- Mật khẩu cũ --- */}
        <div className="cp-info">
          <label htmlFor="oldPassword">Mật khẩu cũ</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        {/* --- Mật khẩu mới --- */}
        <div className="cp-info">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* --- Xác nhận mật khẩu mới --- */}
        <div className="cp-info">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* --- Nút Submit --- */}
        <button type="submit" className="cp-button" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
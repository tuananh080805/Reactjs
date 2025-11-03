import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 👈 Import useAuth
import { useNavigate, Link } from 'react-router-dom';
import '../state/login.css'; // 👈 Import file CSS

const LoginPage = () => {
  // 1. Lấy hàm login từ Context
  const { login } = useAuth();
  
  // 2. Dùng hook để điều hướng sau khi login thành công
  const navigate = useNavigate();

  // 3. State cho form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 4. State cho loading và báo lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 5. Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload
    setIsLoading(true); // Bật loading
    setError(null);     // Xóa lỗi cũ

    try {
      // Gọi hàm login từ Context (đã gọi service)
      await login(email, password); 
      
      // Nếu thành công, điều hướng về trang chủ
      navigate('/'); 

    } catch (err) {
      // Nếu authService ném lỗi, bắt và hiển thị
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
      setIsLoading(false); // Tắt loading
    }
    // (Không cần tắt loading ở đây nếu thành công, vì đã chuyển trang)
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} // Tắt khi đang loading
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading} // Tắt khi đang loading
            required
          />
        </div>
        <button 
          type="submit" 
          className="login-button" 
          disabled={isLoading} // Tắt khi đang loading
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <div className="register-link">
          <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
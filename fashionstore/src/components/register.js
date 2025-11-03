import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import '../state/register.css'; // Chúng ta sẽ tạo file CSS này

const RegisterPage = () => {
    
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState(''); // <-- 1. THÊM MỚI STATE CHO FULLNAME
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm login từ context

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn form reload trang
        setError(''); // Xóa lỗi cũ

        // 1. Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsLoading(true);

        try {
            // 2. Gọi API đăng ký
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 2. SỬA LẠI BODY ĐỂ GỬI ĐÚNG 'fullName'
                body: JSON.stringify({ email, password, fullName }), 
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Đăng ký thành công
                
                // Tự động đăng nhập sau khi đăng ký
                await login(email, password); // Dùng hàm login từ context
                navigate('/'); // Chuyển về trang chủ

            } else {
                // 4. Xử lý lỗi từ server (ví dụ: email đã tồn tại)
                setError(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
            }

        } catch (err) {
            console.error('Lỗi đăng ký:', err);
            setError('Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Đăng Ký</h2>
                
                {/* Hiển thị lỗi nếu có */}
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* 3. THÊM MỚI TRƯỜNG INPUT CHO FULLNAME */}
                <div className="form-group">
                    <label htmlFor="fullName">Họ và Tên</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận Mật khẩu</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="register-button" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
                <div className="login-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
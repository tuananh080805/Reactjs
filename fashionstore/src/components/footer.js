import React, { useState } from 'react'; // <-- 1. Import thêm useState
import '../state/footer.css';

const Footer = () => {

  // --- 2. THÊM MỚI: State cho email và thông báo ---
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // -----------------------------------------------

  // --- 3. THÊM MỚI: Hàm xử lý giống hệt home-page.js ---
  const handleSubscribe = async (event) => {
      event.preventDefault();
      if (!email) {
          setMessage('Vui lòng nhập email của bạn.');
          return;
      }
      setMessage('Đang xử lý...');

      try {
          // Gọi API Spring Boot
          const response = await fetch('http://localhost:8080/api/subscribe', { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email }),
          });
          
          const data = await response.json();

          if (response.ok) {
              setMessage('Cảm ơn bạn đã đăng ký!');
              setEmail('');
          } else {
              setMessage(data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
          }
      } catch (error) {
          console.error('Error:', error);
          setMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
      }
  };
  // --------------------------------------------------

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* ... (Các footer-section khác giữ nguyên) ... */}
        
        <div className="footer-section about">
          <h2 className="footer-logo">Fashion Shop</h2>
          <p className="copyright">Đã đăng ký Bản quyền</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Giới thiệu</h3>
          <ul className="footer-links">
            <li><a href="/about">Về chúng tôi</a></li>
            <li><a href="#">Vị trí cửa hàng</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="#">Theo dõi đơn hàng</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Liên kết</h3>
          <ul className="footer-links">
            <li><a href="#">Lợi nhuận</a></li>
            <li><a href="#">Chính sách hỗ trợ</a></li>
            <li><a href="#">Hướng dẫn kích thước</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Theo dõi chúng tôi</h3>
          <ul className="footer-links">
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Youtube</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Đăng ký</h3>
          <p>Nhận thông tin cập nhật qua Email</p>

          {/* --- 4. SỬA LẠI FORM --- */}
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Nhập email của bạn." 
              value={email} // <-- Thêm
              onChange={(e) => setEmail(e.target.value)} // <-- Thêm
            />
            <button type="submit">ĐĂNG KÝ</button>
          </form>
          {/* --- 5. THÊM HIỂN THỊ THÔNG BÁO --- */}
          {message && <p className="response-message">{message}</p>}
          {/* ---------------------------------- */}

        </div>
      </div>
    </footer>
  );
};

export default Footer;
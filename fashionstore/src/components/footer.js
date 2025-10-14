import React from 'react';
import '../state/footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
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
          <form className="subscribe-form">
            <input type="email" placeholder="Nhập email của bạn." />
            <button type="submit">ĐĂNG KÝ</button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
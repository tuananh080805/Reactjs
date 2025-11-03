import React from 'react';
import '../state/about-page.css';
// Giả sử bạn có một ảnh trong thư mục public hoặc src/assets
import teamImage from '../images/section1-3.jpg'; 

const AboutPage = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <p className="sub-heading">Who Are We</p>
        <h1 className="main-heading">Welcome To Fashion Shop</h1>
        <div className="divider"></div>
        <p className="description">
            Tại Fashion Shop, chúng tôi tin rằng thời trang là cách để thể hiện cá tính và câu chuyện của riêng bạn.
          <br />
          Hãy cùng chúng tôi khám phá và định hình phong cách độc đáo của bạn ngay hôm nay!
        </p>
      </div>

      {/* Phần Sứ mệnh & Tầm nhìn */}
      <div className="mission-vision-section">
        <div className="mission-vision-content">
          <div className="mission">
            <h3>Sứ Mệnh Của Chúng Tôi</h3>
            <p>Mang đến những sản phẩm thời trang chất lượng, hợp xu hướng, giúp bạn tự tin thể hiện phong cách cá nhân và tỏa sáng trong mọi khoảnh khắc.</p>
          </div>
          <div className="vision">
            <h3>Tầm Nhìn</h3>
            <p>Trở thành thương hiệu thời trang hàng đầu, là điểm đến mua sắm tin cậy và truyền cảm hứng cho những người yêu cái đẹp trên khắp Việt Nam.</p>
          </div>
        </div>
      </div>

      {/* Phần Hình ảnh */}
      <div className="image-section">
        <img src={teamImage} alt="Our Team at Fashion Shop" />
      </div>

      {/* Phần Kêu gọi hành động */}
      <div className="cta-section">
        <h2>Hãy là một phần trong câu chuyện của chúng tôi</h2>
        <p>Khám phá những sản phẩm mới nhất và tìm cho mình một phong cách thật khác biệt.</p>
        <a href="/shop" className="cta-button">Mua Sắm Ngay</a>
      </div>
    </div>
  );
};

export default AboutPage;
import React from 'react';
import '../state/contact-page.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Liên Hệ Với Chúng Tôi</h1>
        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ. Chúng tôi luôn sẵn lòng hỗ trợ!</p>
      </div>
      <div className="contact-body">
        {/* Biểu mẫu liên hệ đã được xóa khỏi đây */}
        <div className="contact-info">
          <h3>Thông Tin Cửa Hàng</h3>
          <p><strong>Địa chỉ:</strong> Học Viện Công Nghệ Bưu Chính Viễn Thông, Hà Đông, Hà Nội, Việt Nam</p>
          <p><strong>Điện thoại:</strong> (033) 2801 818</p>
          <p><strong>Email:</strong> support@fashionshop.com</p>
          <p><strong>Giờ mở cửa:</strong> 9:00 - 21:00, Thứ Hai - Chủ Nhật</p>
        </div>
      </div>
      <div className="map-section">
        <h3>Vị Trí Của Chúng Tôi</h3>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60456.45947754944!2d105.73356221191016!3d20.95238804705987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452e895245877%3A0x861376878b233f4!2zSMOgIMSQw7RuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1728872740947!5m2!1svi!2s"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Đường Trần Phú, Hà Đông"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
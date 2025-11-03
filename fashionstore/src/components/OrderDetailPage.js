// src/components/OrderDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import '../state/OrderDetailPage.css'; // File CSS

// --- 1. IMPORT ẢNH QR CỦA BẠN ---
import qrCodeImage from '../images/QR.jpg'; 

// (Hàm formatCurrency và formatDate giữ nguyên)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); 
  const [copySuccess, setCopySuccess] = useState(''); // State cho thông báo copy

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderById(id);
        setOrder(data); 
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Không thể tải chi tiết đơn hàng.');
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]); 

  // --- 2. TẠO KHỐI THANH TOÁN QR (NẾU CÓ) ---
  const renderPaymentInfo = () => {
    if (!order || order.paymentMethod !== 'BANK') {
      return null; // Không hiển thị gì nếu không phải "BANK"
    }

    // Tạo nội dung chuyển khoản
    const transferContent = `#${order.id} ${order.receiverName}`;

    // Hàm copy nội dung
    const handleCopy = () => {
      navigator.clipboard.writeText(transferContent).then(() => {
        setCopySuccess('Đã copy!');
        setTimeout(() => setCopySuccess(''), 2000); // Xóa thông báo sau 2s
      }, (err) => {
        setCopySuccess('Copy lỗi!');
      });
    };

    return (
      <div className="payment-info-card"> {/* CSS mới */}
        <h4>Thông tin thanh toán</h4>
        <p>Vui lòng quét mã QR dưới đây hoặc chuyển khoản với nội dung bên dưới để hoàn tất đơn hàng.</p>
        <img src={qrCodeImage} alt="Mã QR thanh toán" className="qr-code-image" />
        
        {/* --- DÒNG ĐÃ THÊM MỚI --- */}
        <p className="account-holder-name">Chủ tài khoản: <strong>Bui Tuan Anh</strong></p>
        
        <div className="transfer-content-box">
          <p>Nội dung chuyển khoản (bắt buộc):</p>
          <strong>{transferContent}</strong>
          <button onClick={handleCopy} className="btn-copy">
            {copySuccess || 'Copy nội dung'}
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <p>Đang tải chi tiết đơn hàng...</p>;
    }
    if (error) {
      return <p className="error-message">Lỗi: {error}</p>;
    }
    if (!order) {
      return <p>Không tìm thấy đơn hàng.</p>;
    }

    const itemsTotal = order.totalMoney - (order.shippingFee || 0);

    return (
      <div className="order-details-content">
        
        {/* --- 3. GỌI HÀM HIỂN THỊ KHỐI THANH TOÁN --- */}
        {renderPaymentInfo()}

        <div className="order-summary-card">
          <h3>Chi tiết đơn hàng</h3>
          <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
          <p><strong>Ngày đặt hàng:</strong> {formatDate(order.orderDate)}</p>
          <p><strong>Trạng thái:</strong>
            <span className={`order-status status-${order.status}`}>
              {order.status}
            </span>
          </p>
          
          {/* --- 4. CẬP NHẬT CÁC TRƯỜNG NÀY --- */}
          <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
          <p><strong>Người nhận:</strong> {order.receiverName || order.user.fullName}</p>
          <p><strong>Số điện thoại:</strong> {order.phoneNumber}</p>
          <p><strong>Phương thức TT:</strong> {order.paymentMethod}</p>
          {/* ---------------------------------- */}
        </div>

        {/* (Phần order-items-card không đổi) */}
        {order.orderDetailList && order.orderDetailList.length > 0 ? (
          <div className="order-items-card">
            <h4>Các sản phẩm đã đặt</h4>
            <div className="order-items-list">
              {order.orderDetailList.map(item => (
                <div key={item.id} className="order-product-item">
                  <img 
                    src={item.product.images[0]?.imageUrl || 'https://via.placeholder.com/100'} 
                    alt={item.product.name} 
                    className="product-thumbnail"
                  />
                  <div className="product-info">
                    <span className="product-name">{item.product.name}</span>
                    <span className="product-qty">Số lượng: {item.quantity}</span>
                  </div>
                  <span className="product-price">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Không tìm thấy chi tiết sản phẩm cho đơn hàng này.</p>
        )}

        {/* (Phần order-total-card không đổi) */}
        <div className="order-total-card">
          <h4>Tổng cộng thanh toán</h4>
          <div className="total-line">
            <span>Tiền hàng:</span>
            <span>{formatCurrency(itemsTotal)}</span>
          </div>
          <div className="total-line">
            <span>Phí vận chuyển:</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <hr />
          <div className="total-line grand-total">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(order.totalMoney)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="order-detail-page-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / 
        <Link to="/orders">Đơn hàng của tôi</Link> / 
        <span>Chi tiết đơn hàng #{id}</span>
      </div>
      <h1>Chi tiết đơn hàng</h1>
      {renderContent()}
    </div>
  );
};

export default OrderDetailPage;
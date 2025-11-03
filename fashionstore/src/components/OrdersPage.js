// src/components/OrdersPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../state/OrdersPage.css'; // File CSS
import { getMyOrders } from "../services/orderService"; //

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper để format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Helper để format ngày
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null); // Reset lỗi
      try {
        // --- GỌI API LẤY ĐƠN HÀNG ---
        const data = await getMyOrders(); //
        setOrders(data); // Giả sử apiClient trả về { data: [...] }
        setLoading(false);

      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi tải đơn hàng.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Đang tải đơn hàng...</p>;
    }
    if (error) {
      return <p className="error-message">Lỗi khi tải đơn hàng: {error}</p>;
    }
    if (orders.length === 0) {
      return (
        <div className="no-orders">
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/" className="btn-primary">
            Bắt đầu mua sắm
          </Link>
        </div>
      );
    }

    // --- ĐÂY LÀ PHẦN CẬP NHẬT QUAN TRỌNG ---
    return (
      <div className="order-list">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <h3>Mã đơn hàng: #{order.id}</h3>
              <span className={`order-status status-${order.status}`}>
                {order.status}
              </span>
            </div>
            <div className="order-body">
              <p><strong>Ngày đặt:</strong> {formatDate(order.orderDate)}</p>
              <p><strong>Địa chỉ giao:</strong> {order.shippingAddress}</p>
              <p><strong>Tổng tiền:</strong> {formatCurrency(order.totalMoney)}</p>
            </div>
            <div className="order-footer">
              <Link to={`/orders/${order.id}`} className="btn-secondary">
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="orders-page-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>Đơn hàng của tôi</span>
      </div>
      <h1>Đơn hàng của tôi</h1>
      {renderContent()}
    </div>
  );
};

export default OrdersPage;
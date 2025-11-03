// src/component/cart.js

import React from 'react';
import { useCart } from '../context/CartContext'; // 👈 Import useCart
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import '../state/cart.css'; // 👈 Import file CSS

const CartPage = () => {
    
  // Lấy state và hàm từ Context
  const { cart, total, cartCount, removeItem, updateQuantity } = useCart();

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Trường hợp giỏ hàng trống
  if (cartCount === 0) {
    return (
      <div className="cart-container cart-empty">
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy quay lại cửa hàng để lựa chọn sản phẩm.</p>
        <Link to="/shop" className="continue-shopping-link">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  // Trường hợp có sản phẩm
  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn ({cartCount} sản phẩm)</h2>

      <div className="cart-content-wrapper">
        
        {/* === CỘT BÊN TRÁI: DANH SÁCH SẢN PHẨM === */}
        <div className="cart-items-list">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="cart-item-image" />
              
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-price">{formatCurrency(item.price)}</p>
                
                {/* === KHỐI LƯỢNG ĐIỀU KHIỂN SỐ LƯỢNG === */}
                <div className="quantity-controls">
                  <button 
                    className="quantity-button" 
                    onClick={() => updateQuantity(-1, item.id)}
                    disabled={item.quantity === 1} // Vô hiệu hóa nút khi số lượng là 1
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    className="quantity-button" 
                    onClick={() => updateQuantity(1, item.id)}
                  >
                    +
                  </button>
                </div>
                {/* === KẾT THÚC KHỐI ĐIỀU KHIỂN === */}

              </div>

              <div className="cart-item-actions">
                <p className="item-subtotal">
                  {formatCurrency(item.price * item.quantity)}
                </p>
                <button 
                  className="remove-button" 
                  onClick={() => removeItem(item.id)} // 👈 Gọi hàm xóa
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* === CỘT BÊN PHẢI: TÓM TẮT ĐƠN HÀNG === */}
        <div className="cart-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="summary-row">
            <span>Tạm tính ({cartCount} sản phẩm)</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="summary-row">
            <span>Phí giao hàng</span>
            <span>Miễn phí</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row summary-total">
            <strong>Tổng cộng</strong>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <Link to="/checkout" className="checkout-button">
            Tiến hành thanh toán
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
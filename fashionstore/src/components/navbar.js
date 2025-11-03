// src/components/navbar.js

import { useState } from 'react';
import { FiUser, FiShoppingBag } from 'react-icons/fi';
import '../state/navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // 👈 1. Lấy thêm 'isAdmin' từ context
  const { isLoggedIn, user, logout, isLoading, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      closeDropdown();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate('/');
      }, 400);
    }
  };

  return (
    <div className="navbar">
      <Link to="/" className="label">Fashion Shop</Link>
      <div className="menu">
        {/* ... (menu items không đổi) ... */}
        <Link to="/" className="menu-one">Trang chủ</Link>
        <Link to="/shop" className="menu-two">Cửa Hàng</Link>
        <Link to="/about" className="menu-three">Giới Thiệu</Link>
        <Link to="/contact" className="menu-four">Liên Hệ</Link>
      </div>
      <div className="icon-group">

        {/* Dropdown User */}
        <div className="icon-item" onClick={toggleDropdown}>
          <FiUser size={24} />

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* ... (Loading và Chưa Đăng Nhập không đổi) ... */}
              {isLoading && (
                <div className="dropdown-item">Đang tải...</div>
              )}

              {/* Trường hợp: ĐÃ ĐĂNG NHẬP */}
              {!isLoading && isLoggedIn && user && (
                <>
                  <div className="dropdown-item user-greeting">
                    Chào, {user.username}
                  </div>
                  <div className="dropdown-divider"></div>

                  {/* 👈 2. HIỂN THỊ CÁC MỤC CỦA ADMIN (NẾU LÀ ADMIN) */}
                  {isAdmin && (
                    <>
                      <Link to="/admin/products" className="dropdown-item" onClick={closeDropdown}>
                        Quản lý Sản phẩm
                      </Link>
                      <Link to="/admin/orders" className="dropdown-item" onClick={closeDropdown}>
                        Quản lý Đơn hàng
                      </Link>
                      <div className="dropdown-divider"></div>
                    </>
                  )}

                  {/* Mục của User thường */}
                  <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
                    Quản lý tài khoản
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={closeDropdown}>
                    Đơn hàng của tôi
                  </Link>
                  <Link to="/change-password" className="dropdown-item" onClick={closeDropdown}>
                    Đổi mật khẩu
                  </Link>

                  <div
                    className={`dropdown-item ${isLoggingOut ? 'disabled' : ''}`}
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                  >
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                  </div>
                </>
              )}
              
              {/* Trường hợp: CHƯA ĐĂNG NHẬP */}
              {!isLoading && !isLoggedIn && (
                  <>
                      <Link to="/login" className="dropdown-item" onClick={closeDropdown}>
                          Đăng nhập
                      </Link>
                      <Link to="/register" className="dropdown-item" onClick={closeDropdown}>
                          Đăng ký
                      </Link>
                  </>
              )}
            </div>
          )}
        </div>

        {/* Icon Giỏ hàng */}
        <Link to="/cart" className="icon-item">
          {/* ... (không đổi) ... */}
          <FiShoppingBag size={24} />
          {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
          )}
        </Link>

      </div>
    </div>
  )
};
export default Navbar;
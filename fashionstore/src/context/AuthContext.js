// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react'; // 👈 1. Thêm useMemo
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const userData = await authService.checkSession();
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  // 👈 2. TÍNH TOÁN VAI TRÒ ADMIN
  // useMemo đảm bảo logic này chỉ chạy lại khi 'user' thay đổi
  const isAdmin = useMemo(() => {
    // Nếu không có user, hoặc user không có authorities, thì không phải admin
    if (!user || !user.authorities || !Array.isArray(user.authorities)) {
      return false;
    }
    // Kiểm tra xem trong mảng authorities có ai có "authority" là "ROLE_ADMIN" không
    return user.authorities.some(auth => auth.authority === 'ROLE_ADMIN');
  }, [user]); // Phụ thuộc vào 'user'

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      await authService.changePassword(oldPassword, newPassword, confirmPassword);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    isLoggedIn,
    user,
    isLoading,
    isAdmin, // 👈 3. Cung cấp 'isAdmin' cho toàn bộ app
    login,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
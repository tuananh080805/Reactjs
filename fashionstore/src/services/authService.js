// src/services/authService.js

// ⛔ KHÔNG DÙNG: import axios from 'axios';
import apiClient from './apiClient'; // 👈✅ THAY ĐỔI 1: Import apiClient

// ⛔ KHÔNG CẦN NỮA: axios.defaults.withCredentials = true;
// (Vì 'withCredentials: true' đã được cấu hình trong apiClient.js)

// ⛔ KHÔNG CẦN NỮA: const API_URL = '/auth';

/**
 * Dịch vụ gọi API đăng nhập
 */
const login = async (email, password) => {
  try {
    // 1. Gọi API /auth/login
    // 👈✅ THAY ĐỔI 2: Dùng apiClient.post
    // Nó sẽ tự động gọi 'http://localhost:8080/auth/login'
    const response = await apiClient.post(`/auth/login`, {
      email,
      password,
    });
    
    // 2. Nếu đăng nhập thành công, gọi API /auth/profile
    // 👈✅ THAY ĐỔI 3: Dùng apiClient.get
    const profileResponse = await apiClient.get(`/auth/profile`);

    // 3. Trả về dữ liệu profile
    return profileResponse;

  } catch (error) {
    // Ném lỗi ra để Context có thể bắt và xử lý
    // (apiClient đã tự động xử lý error.response.data)
    throw error.error || 'Đã xảy ra lỗi khi đăng nhập';
  }
};

/**
 * Dịch vụ gọi API đăng xuất
 */
const logout = async () => {
  try {
    // 👈✅ THAY ĐỔI 4: Dùng apiClient.post
    await apiClient.post(`/auth/logout`);
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};

/**
 * Dịch vụ kiểm tra phiên đăng nhập (khi tải lại trang)
 */
const checkSession = async () => {
    try {
        // 👈✅ THAY ĐỔI 5: Dùng apiClient.get
        const response = await apiClient.get(`/auth/profile`);
        return response.data;
    } catch (error) {
        return null;
    }
};
const changePassword = async (oldPassword,newPassword,confirmPassword) => {
  try {
    await apiClient.post(`/auth/change-password`, {
      oldPassword,
      newPassword,
      confirmPassword,
    });
  }
  catch (error) {
    console.log("Lỗi khi đổi mật khẩu:", error);
    throw error;
  }
}

// (Tương tự, bạn có thể thêm hàm 'register' ở đây)

// Xuất các hàm này ra
export const authService = {
  login,
  logout,
  checkSession,
  changePassword,
};
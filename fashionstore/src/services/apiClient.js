// src/services/apiClient.js (File mới, có thể dùng chung)

import axios from 'axios';

// 1. Tạo một instance axios với cấu hình chung
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true // 👈 Rất quan trọng!
});

// 2. Định nghĩa hàm xử lý response chung
// Nó sẽ tự động lấy `response.data` (JSON)
const handleResponse = (response) => {
  return response.data;
};

// 3. Định nghĩa hàm xử lý lỗi chung
const handleError = (error) => {
  console.error("Lỗi API:", error.response?.data || error.message);
  // Ném lỗi ra để component có thể bắt (catch)
  throw error.response?.data || error; 
};

// Thêm interceptor (bộ đánh chặn) để tự động xử lý
// Điều này giúp chúng ta không cần .then() và .catch() ở mọi nơi
apiClient.interceptors.response.use(handleResponse, handleError);

export default apiClient;
// src/services/productService.js (Đã cập nhật)

import { apiClient } from './apiClient'; // 👈 Import instance đã tạo

/**
 * 1. Lấy TẤT CẢ sản phẩm.
 */
export const fetchProducts = () => {
  // Nhờ interceptor, hàm này sẽ trả về promise chứa JSON
  // hoặc ném ra lỗi nếu thất bại
  return apiClient.get('/products');
};

/**
 * 2. Lấy sản phẩm theo danh mục.
 */
export const fetchProductsByCategory = (categoryId) => {
  return apiClient.get('/products/by-category', {
    params: { categoryId } // 👈 Cách truyền query param sạch sẽ
  });
};

/**
 * 3. Lấy sản phẩm có giá NHỎ HƠN.
 */
export const fetchProductsByPriceLessThan = (price) => {
  return apiClient.get('/products/by-price/less-than', {
    params: { price }
  });
};

/**
 * 4. Lấy sản phẩm có giá LỚN HƠN.
 */
export const fetchProductsByPriceGreaterThan = (price) => {
  return apiClient.get('/products/by-price/greater-than', {
    params: { price }
  });
};

export const fetchProductById = (productId) => {
  // GET /products/1, GET /products/2, ...
  return apiClient.get(`/products/${productId}`);
};

/**
 * 6. (ADMIN) Xóa một sản phẩm theo ID.
 * Gửi yêu cầu DELETE đến API /products/{id}
 */
export const deleteProduct = (productId) => {
  // Yêu cầu này cần có token (đã được interceptor xử lý)
  return apiClient.delete(`/products/${productId}`);
};

// Bạn cũng sẽ cần các hàm cho TẠO (CREATE) và CẬP NHẬT (UPDATE)
// Bạn có thể thêm chúng ngay bây giờ hoặc sau này:

/**
 * 7. (ADMIN) Tạo một sản phẩm mới.
 * Gửi yêu cầu POST đến API /products
 */
export const createProduct = (productData) => {
  return apiClient.post('/products', productData);
  // productData là một object (JSON) chứa thông tin sản phẩm mới
};

/**
 * 8. (ADMIN) Cập nhật một sản phẩm.
 * Gửi yêu cầu PUT đến API /products/{id}
 */
export const updateProduct = (productId, productData) => {
  return apiClient.put(`/products/${productId}`, productData);
};
import { apiClient } from './apiClient'; 

// Hàm gửi thông tin đơn hàng lên backend
export const createOrder = (orderData) => {
    // orderData sẽ có dạng { shippingAddress, shippingFee, paymentMethod, cartItems }
    return apiClient.post('/orders', orderData);
};

export const getMyOrders = () => {
    return apiClient.get('/orders');
};
// --- THÊM HÀM MỚI NÀY VÀO ---
export const getOrderById = (orderId) => {
    return apiClient.get(`/orders/${orderId}`);
};
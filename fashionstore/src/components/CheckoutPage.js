import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import '../state/CheckoutPage.css'; //

const CheckoutPage = () => {
    const { cart, total, cartCount, clearCart } = useCart();
    const navigate = useNavigate();

    // --- THÊM 2 STATE MỚI ---
    const [receiverName, setReceiverName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    // ---------------------------
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD'); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCalculatingShip, setIsCalculatingShip] = useState(false); 
    const [shippingFee, setShippingFee] = useState(0); 
    const finalTotal = total + shippingFee; 

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleCalculateShipping = async (addressToCalculate) => {
        setIsCalculatingShip(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/shipping-fee?address=${encodeURIComponent(addressToCalculate)}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setShippingFee(data.fee_vnd);
        } catch (err) {
            setError(err.message || 'Không thể tính phí ship. Vui lòng kiểm tra lại địa chỉ.');
            setShippingFee(0);
        } finally {
            setIsCalculatingShip(false);
        }
    };

    useEffect(() => {
        if (shippingAddress.trim() === '') {
            setError(null);
            setShippingFee(0);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            handleCalculateShipping(shippingAddress);
        }, 1000); 
        return () => clearTimeout(delayDebounceFn);
    }, [shippingAddress]); 

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        // --- CẬP NHẬT VALIDATION ---
        if (!receiverName) {
            setError('Vui lòng nhập tên người nhận.');
            return;
        }
        if (!phoneNumber) {
            setError('Vui lòng nhập số điện thoại.');
            return;
        }
        if (!shippingAddress) {
            setError('Vui lòng nhập địa chỉ giao hàng.');
            return;
        }
        // -------------------------

        if (shippingFee === 0 && paymentMethod === 'COD') {
            setError('Địa chỉ không hợp lệ hoặc chưa tính được phí ship.');
            return;
        }
       
        setLoading(true);
        setError(null);

        // --- CẬP NHẬT DỮ LIỆU GỬI ĐI ---
        const orderData = {
            shippingAddress: shippingAddress,
            shippingFee: shippingFee, 
            paymentMethod: paymentMethod,
            receiverName: receiverName, // <-- THÊM MỚI
            phoneNumber: phoneNumber,   // <-- THÊM MỚI
            cartItems: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };
        // -----------------------------

        try {
            await createOrder(orderData);
            clearCart();
            navigate('/orders'); 
        } catch (err) {
            setError('Tạo đơn hàng thất bại. Vui lòng thử lại.');
            console.error(err);
            setLoading(false);
        }
    };

    // (Code giỏ hàng trống giữ nguyên)
    if (cartCount === 0 && !loading) {
        return (
            <div className="checkout-container">
                <div className="checkout-container-empty">
                 <h2>Giỏ hàng của bạn đang trống</h2>
                    <p>Hãy quay lại cửa hàng để lựa chọn sản phẩm.</p>
                    <Link to="/shop">Tiếp tục mua sắm</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="checkout-container">
            <h1>Thanh toán</h1>
            <div className="checkout-content-wrapper">
                
                <form className="checkout-form" onSubmit={handleSubmitOrder}>
                    <h2>Thông tin giao hàng</h2>
                    
                    {/* --- THÊM 2 Ô INPUT MỚI --- */}
                    <div className="form-group">
                        <label htmlFor="receiverName">Tên người nhận *</label>
                        <input
                            type="text"
                            id="receiverName"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                            placeholder="Nhập họ và tên"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Số điện thoại *</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    {/* ------------------------- */}

                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ *</label>
                        <textarea
                            id="address"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)} 
                            placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP..."
                            rows="4"
                        ></textarea>
                    </div>

                    <h2>Phương thức thanh toán</h2>
                    {/* ... (Phần payment-options không đổi) ... */}
                    <div className="payment-options">
                        {/* (Giữ nguyên 2 radio-item) */}
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                id="payment-cod" 
                                name="paymentMethod" 
                                value="COD"
                                checked={paymentMethod === 'COD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="payment-cod">
                                <strong>Thanh toán khi giao hàng (COD)</strong>
                                <p>Trả tiền mặt khi nhận hàng.</p>
                            </label>
                        </div>
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                id="payment-bank" 
                                name="paymentMethod" 
                                value="BANK"
                                checked={paymentMethod === 'BANK'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="payment-bank">
                                <strong>Chuyển khoản trực tuyến</strong>
                                <p>Thông tin chuyển khoản sẽ hiển thị sau khi đặt hàng.</p>
                            </label>
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="place-order-button" disabled={loading || isCalculatingShip}>
                        {loading ? 'Đang xử lý...' : 'Hoàn tất Đặt hàng'}
                    </button>
                </form>

                <div className="checkout-summary">
                    {/* ... (Phần tóm tắt đơn hàng không đổi) ... */}
                    <h3>Đơn hàng của bạn ({cartCount})</h3>
                    <div className="summary-items-list">
                        {cart.map(item => (
                            <div key={item.id} className="summary-item">
                                <img src={item.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} />
                                <div className="summary-item-info">
                                    <p>{item.name}</p>
                                    <p>SL: {item.quantity}</p>
                                </div>
                                <span className="summary-item-price">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Phí giao hàng</span>
                        {isCalculatingShip ? (
                            <span className="calculating-fee">Đang tính...</span>
                        ) : (
                            <span>{formatCurrency(shippingFee)}</span>
                        )}
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-total">
                        <strong>Tổng cộng</strong>
                        <strong>{formatCurrency(finalTotal)}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
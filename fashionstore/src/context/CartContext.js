import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const useCart = () => {
    return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
    // (useState và useEffect cho cart/total/count giữ nguyên)
    const [cart, setCart] = useState([]); 
    const [total, setTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    // --- CÁC HÀM CŨ (Giữ nguyên) ---
    const addToCart = (item) => { // 'item' ở đây là 'product' từ ShopPage
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            // Nếu đã có, chỉ tăng số lượng
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            // --- ĐÂY LÀ PHẦN SỬA ---
            // 1. Lấy ảnh từ product object (giống như ShopPage)
            const imageUrl = item.images?.[0]?.imageUrl || 'https://via.placeholder.com/100';

            // 2. Tạo newCartItem VỚI thuộc tính 'imageUrl'
            const newCartItem = {
                ...item, // (id, name, price, ...)
                quantity: 1,
                imageUrl: imageUrl // <-- Thuộc tính mà Cart và Checkout đang tìm
            };

            // 3. Thêm newCartItem vào giỏ hàng
            setCart([...cart, newCartItem]);
            // -----------------------
        }
    }

    const removeItem = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    }

    const updateQuantity = (q, itemId) => {
        setCart(cart.map(cartItem => 
            cartItem.id === itemId
                ? { ...cartItem, quantity: cartItem.quantity + q }
                : cartItem
        ));
    }

    // --- HÀM MỚI BỊ THIẾU ---
    const clearCart = () => {
        setCart([]); // Set giỏ hàng về mảng rỗng
    }
    // -------------------------

    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);

        const newCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(newCount);
        
    }, [cart]); 

    // --- CẬP NHẬT VALUE ---
    const value = {
        cart,
        total,
        cartCount,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart // <-- Thêm hàm clearCart vào đây
    };
    // -----------------------

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
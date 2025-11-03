import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/productService';
import { useCart } from "../context/CartContext";
import '../state/productDetail.css'; // Đường dẫn tới file CSS
import { FaArrowLeft } from 'react-icons/fa';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const { productId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImageUrl(data.images[0].imageUrl);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]); 

  const handleBack = () => {
    navigate(-1); 
  };

  // --- THÊM MỚI: Hàm helper để hiển thị tên giới tính thân thiện ---
  const getGenderName = (genderCode) => {
    if (genderCode === 'NAM') return 'Nam';
    if (genderCode === 'NU') return 'Nữ';
    if (genderCode === 'UNISEX') return 'Unisex';
    return 'Không xác định'; // Mặc định
  };

  if (loading) {
    return <p>Đang tải chi tiết sản phẩm...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}. <Link to="/shop">Quay lại cửa hàng</Link></p>;
  }

  if (!product) {
    return <p>Không tìm thấy sản phẩm. <Link to="/shop">Quay lại cửa hàng</Link></p>;
  }

  const mainImage = selectedImageUrl || 'https://via.placeholder.com/600x600.png?text=No+Image';

  return (
    <div className="product-detail-page">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft />
        Quay lại
      </button>

      <div className="breadcrumb">
        <Link to="/shop">Cửa Hàng</Link> / <span>{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Cột bên trái: Hình ảnh */}
        <div className="product-images">
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            {product.images.map(image => (
              <img
                key={image.id}
                src={image.imageUrl}
                alt="thumbnail"
                className={selectedImageUrl === image.imageUrl ? 'active' : ''}
                onClick={() => setSelectedImageUrl(image.imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Cột bên phải: Thông tin */}
        <div className="product-info">
          <h1>{product.name}</h1>
          
          <p className="product-price-detail">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          {/* --- CẬP NHẬT: Thông tin meta --- */}
          <div className="product-meta">
            <p>
              <strong>Loại:</strong>
              <span>{product.category.name}</span>
            </p>
            
            {/* --- THÊM MỚI: Hiển thị Giới tính --- */}
            <p>
              <strong>Giới tính:</strong>
              <span>{getGenderName(product.gender)}</span>
            </p>
            {/* ----------------------------------- */}

            <p>
              <strong>Còn lại:</strong>
              <span>{product.stock} sản phẩm</span>
            </p>
          </div>
          
          <button onClick={() => addToCart(product)} className="add-to-cart-btn">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
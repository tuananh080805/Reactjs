// 👈 1. Import thêm useCallback
import React, { useState, useEffect, useCallback } from 'react';
import '../state/shop-page.css';
import { CiSearch } from "react-icons/ci";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Link } from 'react-router-dom';

import { 
  fetchProducts, 
  deleteProduct as deleteProductService,
  createProduct,
  updateProduct
} from '../services/productService'; 
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductModal from '../components/ProductModal';

const ShopPage = () => {
  // ... (các state không đổi) ...
  const [allProducts, setAllProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  const { isAdmin } = useAuth(); 

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 👈 2. Rút hàm loadProducts ra ngoài và bọc bằng useCallback
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(); 
      setAllProducts(data);
      setFilteredProducts(data); 
      const uniqueCategoryMap = new Map(
        data.map(p => [p.category.id, p.category])
      );
      setCategories([...uniqueCategoryMap.values()]);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []); // 👈 3. Mảng dependency rỗng

  // --- Effect 1: Fetch dữ liệu ---
  useEffect(() => {
    loadProducts(); // 👈 4. Gọi hàm đã rút ra
  }, [loadProducts]); // 👈 5. Thêm loadProducts vào dependency

  // --- Effect 2: Lọc sản phẩm (Không đổi) ---
  useEffect(() => {
    let results = [...allProducts];
    
    // 1. Lọc theo tên
    if (searchTerm) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // 2. Lọc theo Loại
    if (selectedCategories.length > 0) {
      results = results.filter(product =>
        selectedCategories.includes(product.category.id)
      );
    }
    // 3. Lọc theo Giá
    if (priceFilter !== 'all') {
      results = results.filter(product => {
        if (priceFilter === 'lt200') return product.price < 200000;
        if (priceFilter === '200-400') return product.price >= 200000 && product.price <= 400000;
        if (priceFilter === 'gt400') return product.price > 400000;
        return true;
      });
    }
    // 4. Lọc theo Giới tính
    if (genderFilter !== 'all') {
      results = results.filter(product => product.gender === genderFilter);
    }

    setFilteredProducts(results);
    setCurrentPage(1); 
  }, [searchTerm, selectedCategories, priceFilter, genderFilter, allProducts]);

  // --- Các hàm xử lý bộ lọc (Giữ nguyên) ---
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value, 10); 
    if (e.target.checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };
  const handlePriceChange = (e) => setPriceFilter(e.target.value);
  const handleGenderChange = (e) => setGenderFilter(e.target.value);
  
  // --- Các hàm xử lý phân trang (Giữ nguyên) ---
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

    return (
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
        {pageNumbers.map(number => (
          <button 
            key={number} 
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
      </div>
    );
  };

  // --- HÀM XỬ LÝ ADMIN ---

  // 👈 6. CẬP NHẬT: Hàm Xoá
  const handleDeleteProduct = async (e, productId) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProductService(productId);
        alert('Đã xóa sản phẩm thành công!');
        loadProducts(); // 👈 Tải lại dữ liệu
      } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        alert('Xóa sản phẩm thất bại: ' + err.message);
      }
    }
  };

  // (Các hàm mở modal không đổi)
  const handleEditProduct = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setModalMode('edit');
    setSelectedProduct(product); 
    setIsModalOpen(true);
  };

  const handleAddNewProduct = () => {
    setModalMode('add');
    setSelectedProduct(null); 
    setIsModalOpen(true);
  };
  
  // 👈 7. CẬP NHẬT: Hàm Lưu (Thêm/Sửa)
  const handleSaveProduct = async (productData) => {
    try {
      if (modalMode === 'add') {
        await createProduct(productData); // Chỉ cần await
        alert('Thêm sản phẩm thành công!');
      } else {
        await updateProduct(selectedProduct.id, productData); // Chỉ cần await
        alert('Cập nhật thành công!');
      }
      setIsModalOpen(false); // Đóng modal
      loadProducts(); // 👈 Tải lại toàn bộ dữ liệu
    
    } catch (err) {
      // Cải thiện log lỗi
      console.error('Lỗi khi lưu sản phẩm:', err.response || err);
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || errorData?.error || err.message;
      alert('Lưu thất bại: ' + errorMessage);
    }
  };


  // --- SỬA ĐỔI: Hàm Render Products ---
  const renderProducts = () => {
    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (error) return <p>Lỗi khi tải sản phẩm: {error}</p>;
    
    // Kiểm tra trước khi phân trang
    if (filteredProducts.length === 0) {
      return <p>Không tìm thấy sản phẩm nào phù hợp.</p>;
    }

    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return currentProducts.map(product => {
      const imageUrl = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/300';
      return (
        <Link
          to={`/products/${product.id}`}
          key={product.id}
          className="product-item-link"
        >
          <div className="product-item"> 
            
            {isAdmin && (
              <div className="admin-actions-modern">
                <button
                  className="btn-admin-icon btn-edit-modern"
                  onClick={(e) => handleEditProduct(e, product)}
                >
                  <FiEdit />
                </button>
                <button
                  className="btn-admin-icon btn-delete-modern"
                  onClick={(e) => handleDeleteProduct(e, product.id)}
                >
                  <FiTrash />
                </button>
              </div>
            )}

            <img src={imageUrl} alt={product.name} className="product-item-image" />
            <h3>{product.name}</h3>
            <p className="product-price">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
            {/* Thêm kiểm tra 'category' để tránh crash */}
            <p className="product-category">Loại: {product.category?.name || 'Chưa phân loại'}</p>

            <button className="btn-add-to-cart" onClick={(e) => { 
              e.preventDefault();
              addToCart(product);
            }}>Thêm vào giỏ</button>

          </div>
        </Link>
      );
    });
  };

  return (
    <div className="shop-page">
       <div className="breadcrumb">
        <span>Trang chủ</span> / <span>Cửa Hàng</span>
      </div>

      <div className="shop-container">
        <aside className="filters">
            {/* Bộ lọc Tìm kiếm */}
            <div className="filter-group search-filter">
              <h2>Tìm kiếm</h2>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" aria-label="Search">
                  <CiSearch />
                </button>
              </div>
            </div>

            {/* Bộ lọc Loại */}
            <div className="filter-group">
              <h2>Loại</h2>
              {categories.map(category => (
                <div className="checkbox-item" key={category.id}>
                  <input 
                    type="checkbox" 
                    id={`cat-${category.id}`} 
                    value={category.id}
                    onChange={handleCategoryChange}
                    checked={selectedCategories.includes(category.id)} 
                  />
                  <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                </div>
              ))}
            </div>

            {/* Bộ lọc Giá */}
            <div className="filter-group">
              <h2>Giá</h2>
              <div className="radio-item">
                <input type="radio" id="price-all" name="price" value="all" checked={priceFilter === 'all'} onChange={handlePriceChange} />
                <label htmlFor="price-all">Tất Cả</label>
              </div>
              <div className="radio-item">
                <input type="radio" id="price-lt200" name="price" value="lt200" checked={priceFilter === 'lt200'} onChange={handlePriceChange} />
                <label htmlFor="price-lt200">Dưới 200.000đ</label>
              </div>
              <div className="radio-item">
                <input type="radio" id="price-200-400" name="price" value="200-400" checked={priceFilter === '200-400'} onChange={handlePriceChange} />
                <label htmlFor="price-200-400">200.000đ - 400.000đ</label>
              </div>
              <div className="radio-item">
                <input type="radio" id="price-gt400" name="price" value="gt400" checked={priceFilter === 'gt400'} onChange={handlePriceChange} />
                <label htmlFor="price-gt400">Trên 400.000đ</label>
              </div>
            </div>
            
            {/* Bộ lọc Giới tính */}
            <div className="filter-group">
              <h2>Giới tính</h2>
              <div className="radio-item">
                <input type="radio" id="gender-all" name="gender" value="all" checked={genderFilter === 'all'} onChange={handleGenderChange} />
                <label htmlFor="gender-all">Tất Cả</label>
              </div>
              <div className="radio-item">
                <input type="radio" id="gender-nam" name="gender" value="NAM" checked={genderFilter === 'NAM'} onChange={handleGenderChange} />
                <label htmlFor="gender-nam">Nam</label>
              </div>
              <div className="radio-item">
                <input type="radio" id="gender-nu" name="gender" value="NU" checked={genderFilter === 'NU'} onChange={handleGenderChange} />
                <label htmlFor="gender-nu">Nữ</label>
              </div>
              <div className="radio-item">
                <input type="radio" id="gender-unisex" name="gender" value="UNISEX" checked={genderFilter === 'UNISEX'} onChange={handleGenderChange} />
                <label htmlFor="gender-unisex">Unisex</label>
              </div>
            </div>
        </aside>

        <main className="product-listing">
          {isAdmin && (
            <div className="admin-header">
              <button className="btn-add-new" onClick={handleAddNewProduct}>
                + Thêm sản phẩm mới
              </button>
            </div>
          )}

          <div className="toolbar"></div>
          <div className="products-grid">
            {renderProducts()}
          </div>
          
          {renderPagination()}
        </main>
      </div>
      
      {isAdmin && (
        <ProductModal
          isOpen={isModalOpen}
          mode={modalMode}
          product={selectedProduct} 
          categories={categories}   
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
};

export default ShopPage;
import React, { useState, useEffect } from 'react';
import '../state/ProductModal.css';

// 👈 1. Thêm imageUrl vào state ban đầu
const initialState = {
  name: '',
  price: '',
  description: '',
  gender: 'UNISEX',
  categoryId: '',
  imageUrl: '', // Thêm link ảnh
};

const ProductModal = ({ isOpen, mode, product, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        // 👈 2. Nạp link ảnh khi ở chế độ "edit"
        setFormData({
          name: product.name,
          price: product.price,
          description: product.description,
          gender: product.gender,
          categoryId: product.category.id,
          // Lấy link ảnh đầu tiên (nếu có)
          imageUrl: product.images?.[0]?.imageUrl || '',
        });
      } else {
        setFormData(initialState);
      }
      setError('');
    }
  }, [isOpen, mode, product]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Lấy dữ liệu từ form
    const { name, price, description, gender, categoryId, imageUrl } = formData;

    if (!name || !price || !categoryId) {
      setError('Tên, Giá và Loại sản phẩm là bắt buộc.');
      return;
    }

    // 👈 3. Chuẩn bị dữ liệu gửi đi (Đóng gói imageUrl vào mảng 'images')
    // Backend của bạn mong đợi một mảng 'images', và mỗi phần tử là 1 object
    // có thuộc tính 'imageUrl'.
    const dataToSave = {
      name,
      price: parseFloat(price),
      description,
      gender,
      category: {
        id: parseInt(categoryId, 10)
      },
      // Đóng gói link ảnh vào đúng cấu trúc backend
      images: [
        { imageUrl: imageUrl }
      ]
    };
    
    // Gọi hàm onSave (từ shop-page) với dữ liệu đã được định dạng
    onSave(dataToSave);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h2>
          <button onClick={onClose} className="btn-close">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <p className="error-message">{error}</p>}
          
          {/* ... (Các trường Name, Price, Category, Gender không đổi) ... */}
          
          <div className="form-group">
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categoryId">Loại sản phẩm</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="" disabled>-- Chọn một loại --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Giới tính</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="NAM">Nam</option>
              <option value="NU">Nữ</option>
              <option value="UNISEX">Unisex</option>
            </select>
          </div>

          {/* 👈 4. THÊM TRƯỜNG NHẬP LINK ẢNH */}
          <div className="form-group">
            <label htmlFor="imageUrl">Link ảnh sản phẩm</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="https://example.com/image.png"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-save">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
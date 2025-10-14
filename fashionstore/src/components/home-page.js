import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../state/home-page.css';

// --- Giả định đường dẫn đến hình ảnh của bạn ---
import section1Image from '../images/section1-1.jpg';
import section2Image from '../images/section1-2.jpg';
import banner1 from '../images/banner-4.jpg';
import banner2 from '../images/banner-5.jpg';
import supportImage1 from '../images/support-8.png';
import supportImage2 from '../images/support-9.png';
import supportImage3 from '../images/support-10.png';

const images = [section1Image, section2Image];
const delay = 10000;

const HomePage = () => {
    // State cho slider ảnh
    const [currentIndex, setCurrentIndex] = useState(0);
    // State cho form đăng ký
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    // State cho nút cuộn lên đầu trang
    const [showBackToTop, setShowBackToTop] = useState(false);

    // useEffect xử lý slider tự động và sự kiện cuộn trang
    useEffect(() => {
        // Logic cho slider tự động
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, delay);

        // Logic cho việc hiển thị nút cuộn
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Hàm dọn dẹp để gỡ bỏ các sự kiện khi component bị unmount
        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi component được mount

    // Hàm chuyển slide cho slider
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Hàm xử lý gửi form đăng ký
    const handleSubscribe = async (event) => {
        event.preventDefault();
        if (!email) {
            setMessage('Vui lòng nhập email của bạn.');
            return;
        }
        setMessage('Đang xử lý...');

        try {
            const response = await fetch('https://api.yourdomain.com/subscribe', { // <-- THAY THẾ BẰNG URL API THỰC TẾ
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Cảm ơn bạn đã đăng ký!');
                setEmail('');
            } else {
                setMessage(data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
        }
    };

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="home-container">
            {/* --- SECTION 1 --- */}
            <div className="section-1">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Bộ sưu tập ${index + 1}`}
                        className={`section-image ${index === currentIndex ? 'active' : ''}`}
                    />
                ))}
                <div className="content">
                    <div className="caption-small">Ưu đãi này ngay hôm nay</div>
                    <div className="caption-large">Bộ sưu tập mới</div>
                    <div className="caption-discount">Giảm 20%</div>
                    <div>
                        <Link to="/shop" className="buy-now-btn">Mua Ngay</Link>
                    </div>
                </div>
                <div className="slider-dots">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>

            {/* --- SECTION 2 --- */}
            <div className="text">
                <div className="text-content">Sản phẩm nổi bật</div>
            </div>
            <div className="section-2">
                <div className="men">
                    <img src={banner1} alt="Banner-1" className="Banner1" />
                    <div className="content1">
                        <div className="caption-large">Thời trang nam</div>
                        <div className="caption-small">Chọn sản phẩm của bạn</div>
                        <Link to="/shop" className="btn"></Link>
                    </div>
                </div>
                <div className="girl">
                    <img src={banner2} alt="Banner-2" className="Banner2" />
                    <div className="content2">
                        <div className="caption-large">Thời trang nữ</div>
                        <div className="caption-small">Chọn sản phẩm của bạn</div>
                        <Link to="/shop" className="btn"></Link>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3 --- */}
            <div className="section-3">
                <div className="support-item">
                    <img src={supportImage1} alt="Free Shipping" />
                    <div className="support-subtitle">GIAO HÀNG MIỄN PHÍ</div>
                </div>
                <div className="support-item">
                    <img src={supportImage2} alt="Money Return" />
                    <div className="support-subtitle">TRẢ LẠI DƯỚI 7 NGÀY</div>
                </div>
                <div className="support-item">
                    <img src={supportImage3} alt="Member Discount" />
                    <div className="support-subtitle">KHI MUA HÀNG LẦN ĐẦU</div>
                </div>
            </div>

            {/* --- SECTION 4 --- */}
            <div className="section-4">
                <h2 className="section-4-title">Tham gia với chúng tôi!</h2>
                <p className="section-4-subtitle">Theo dõi chúng tôi để nhận thông tin về các sản phẩm mới</p>
                <form className="homepage-subscribe-form" onSubmit={handleSubscribe}>
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        className="subscribe-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="subscribe-btn">ĐĂNG KÝ</button>
                </form>
                {message && <p className="response-message">{message}</p>}
            </div>

            {/* --- NÚT CUỘN LÊN ĐẦU TRANG --- */}
            {showBackToTop && (
                 <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Cuộn lên đầu trang">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default HomePage;
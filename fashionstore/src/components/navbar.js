import { FiSearch, FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import '../state/navbar.css'
import { Link } from "react-router-dom";
const Navbar = () => {
    return (
        <div className="navbar">
            <Link to = "/" className="label">Fashion Shop</Link>
            <div className="menu">
                <Link to = "/" className="menu-one">Trang chủ</Link>
                <Link to = "/shop" className="menu-two">Cửa Hàng</Link>
                <Link to = "/about" className="menu-three">Giới Thiệu</Link>
                <Link to = "/contact" className="menu-four">Liên Hệ</Link>
            </div>
            <div className="icon-group">
                <div className="icon-item">
                    <FiUser size={24} />
                </div>
                <div className="icon-item badge-container">
                    <FiShoppingBag size={24} />
                    {/* {cartCount >= 0 && <span className="badge">{cartCount}</span>} */}
                </div>
            </div>
        </div>
    )
};
export default Navbar;
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Order";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/shop" element={<Shop />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/change-password" element={<ChangePassword />} /> 
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Routes>

    </div>
  );
}

export default App;

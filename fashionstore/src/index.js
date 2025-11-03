import React from 'react';
import ReactDOM from 'react-dom/client';
// ⚠️ Phải import BrowserRouter từ react-router-dom
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
            <AuthProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </AuthProvider>
        </BrowserRouter>
  </React.StrictMode>
);
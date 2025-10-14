import React from 'react';
import ReactDOM from 'react-dom/client';
// ⚠️ Phải import BrowserRouter từ react-router-dom
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 🎯 Đặt BrowserRouter bao bọc component App */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
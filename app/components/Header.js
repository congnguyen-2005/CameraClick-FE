"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from 'js-cookie';
import authService from "../services/authService";
import CartService from "../services/cartService";
import { ShoppingBag, Search, User, LogOut, ShieldCheck, FileText, Settings } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/header.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  // State quản lý dữ liệu
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [keyword, setKeyword] = useState("");

  // State quản lý Dropdown User (Thay thế Bootstrap JS)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- LOGIC XỬ LÝ DROPDOWN ---
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Tự động đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC GIỎ HÀNG & USER (Giữ nguyên từ code cũ) ---
  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await CartService.getCart();
      if (res.data.status) {
        const items = res.data.data || [];
        const total = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
        setCartCount(total);
      }
    } catch (error) {
      if (error.response?.status === 401) setCartCount(0);
    }
  }, []);

  const loadUserData = useCallback(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    fetchCartCount();

    const handleUpdate = () => {
      loadUserData();
      fetchCartCount();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cartUpdate', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cartUpdate', handleUpdate);
    };
  }, [fetchCartCount, loadUserData]);

  // --- XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = async () => {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất?")) return;
    try {
      await authService.logout();
    } finally {
      localStorage.clear();
      Cookies.remove('user_data');
      setUser(null);
      setCartCount(0);
      setIsDropdownOpen(false); // Đóng menu sau khi logout
      window.location.href = "/login";
    }
  };

  // --- XỬ LÝ TÌM KIẾM ---
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (e.key === 'Enter') e.preventDefault();
      if (keyword.trim()) {
        router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
      }
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="header-main sticky-top">
      <div className="container">
        <div className="header-wrapper d-flex align-items-center justify-content-between py-2">

          {/* 1. Logo */}
          <Link href="/" className="logo-brand text-decoration-none">
            <span className="logo-text">
              CAM<span style={{ color: "#CC6600" }}>STORE</span>
            </span>
          </Link>

          {/* 2. Menu Điều hướng */}
          <nav className="d-none d-lg-flex align-items-center nav-links-gap">
            {[
              { name: "Sản phẩm", href: "/product" },
              { name: "Ống kính", href: "/lens" },
              { name: "Phụ kiện", href: "/accessory" },
              { name: "Bài viết", href: "/post" },
              { name: "Liên hệ", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-custom-link ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/sale" className="nav-custom-link text-warning fw-bold pulse-sale">Sale</Link>
          </nav>

          {/* 3. Công cụ bên phải */}
          <div className="d-flex align-items-center gap-3">

            {/* Search Bar */}
            <div className="search-container d-none d-md-block">
              <input
                type="text"
                placeholder="Bạn tìm gì..."
                className="search-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button className="search-btn" onClick={handleSearch}>
                <Search size={18} />
              </button>
            </div>

            {/* Giỏ hàng */}
            <Link href="/cart" className="cart-wrapper text-decoration-none">
              <div className="icon-circle">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                )}
              </div>
            </Link>

            {/* User Section (Đã sửa lại logic Dropdown) */}
            <div className="user-section border-start ps-3" ref={dropdownRef}>
              {user ? (
                <div className="dropdown-container position-relative">
                  {/* Nút bấm mở menu */}
                  <button 
                    className={`user-toggle d-flex align-items-center gap-2 border-0 bg-transparent py-1 ${isDropdownOpen ? 'active' : ''}`} 
                    onClick={toggleDropdown}
                  >
                    <div className="avatar-placeholder">
                      <User size={18} />
                    </div>
                    <span className="d-none d-sm-inline font-weight-bold text-dark">
                      Hi, {user.name ? user.name.split(' ').pop() : 'User'}
                    </span>
                  </button>

                  {/* Dropdown Menu Custom */}
                  <div className={`custom-dropdown-menu shadow-lg border-0 mt-2 py-2 ${isDropdownOpen ? 'show' : ''}`}>
                    
                    {/* Header Info Dropdown */}
                    <div className="px-3 py-2 border-bottom mb-2 bg-light">
                       <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Tài khoản</small>
                       <span className="fw-bold text-truncate d-block text-dark" style={{maxWidth: '180px'}}>
                          {user.name}
                       </span>
                    </div>

                    <ul className="list-unstyled mb-0">
                      {user?.roles === 'admin' && (
                        <li>
                          <Link href="/admin" className="dropdown-item py-2 d-flex align-items-center" onClick={closeDropdown}>
                            <ShieldCheck size={16} className="me-2 text-primary" />
                            <span className="fw-bold text-primary">Quản trị hệ thống</span>
                          </Link>
                        </li>
                      )}
                      
                      <li>
                        <Link href="/orders" className="dropdown-item py-2 d-flex align-items-center" onClick={closeDropdown}>
                          <FileText size={16} className="me-2 text-muted" /> Lịch sử đơn hàng
                        </Link>
                      </li>
                      
                      <li>
                        <Link href="/user" className="dropdown-item py-2 d-flex align-items-center" onClick={closeDropdown}>
                          <Settings size={16} className="me-2 text-muted" /> Tài khoản
                        </Link>
                      </li>
                      
                      <li><hr className="dropdown-divider opacity-25 my-2" /></li>
                      
                      <li>
                        <button onClick={handleLogout} className="dropdown-item text-warning py-2 fw-bold d-flex align-items-center w-100 text-start">
                          <LogOut size={16} className="me-2" /> Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="login-link text-decoration-none text-dark">Đăng nhập</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Tổng thể Header */
        .header-main {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 15px rgba(0,0,0,0.03);
          z-index: 1100;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #1a1a1a;
        }

        /* Menu Navigation */
        .nav-links-gap { gap: 2.2rem; }
        
        .nav-custom-link {
          text-decoration: none !important;
          color: #555;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 8px 0;
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-custom-link:hover, .nav-custom-link.active {
          color: #000;
        }

        .nav-custom-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: #dc3545;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-custom-link:hover::after, .nav-custom-link.active::after {
          width: 100%;
        }

        /* Search Box */
        .search-container {
          position: relative;
          background: #f4f4f6;
          border-radius: 50px;
          padding: 2px 4px;
          border: 1px solid transparent;
          transition: 0.3s;
        }
        .search-container:focus-within {
          background: #fff;
          border-color: #dc3545;
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        .search-input {
          border: none;
          background: transparent;
          padding: 6px 12px;
          outline: none;
          width: 160px;
          font-size: 0.85rem;
        }
        .search-btn {
          border: none;
          background: transparent;
          color: #555;
          padding: 4px 8px;
        }

        /* Giỏ hàng */
        .icon-circle {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #333;
          position: relative;
          transition: 0.2s;
        }
        .icon-circle:hover {
          background: #f8f9fa;
          color: #dc3545;
          transform: translateY(-2px);
        }
        
        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #dc3545;
          color: white;
          font-size: 0.65rem;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          font-weight: 700;
        }

        /* User Section & Custom Dropdown Styles */
        .user-toggle {
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 50px;
          padding: 4px 10px;
        }
        .user-toggle:hover, .user-toggle.active {
          background-color: #f8f9fa;
        }

        .avatar-placeholder {
          width: 32px;
          height: 32px;
          background: #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        /* Custom Dropdown Animation */
        .custom-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          min-width: 240px;
          background-color: #fff;
          border-radius: 12px;
          
          /* Trạng thái ẩn */
          opacity: 0;
          visibility: hidden;
          transform: translateY(15px);
          transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
          pointer-events: none; /* Không cho click khi ẩn */
        }
        
        /* Trạng thái hiện */
        .custom-dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .dropdown-item {
          font-size: 0.9rem;
          color: #333;
          transition: all 0.2s;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: #fff5f0;
          color: #CC6600 !important;
          padding-left: 1.5rem;
        }
        .dropdown-item:active {
           background-color: #ffe0cc;
        }

        /* Login Button */
        .login-link {
          text-decoration: none !important;
          color: #fff;
          background: #1a1a1a;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: 0.3s;
        }
        .login-link:hover {
          background: #dc3545;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
        }
        .text-warning{ color: #CC6600; }

        /* Animations */
        @keyframes softPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .pulse-sale { animation: softPulse 2s infinite ease-in-out; }
      `}</style>
    </header>
  );
}
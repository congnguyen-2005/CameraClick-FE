"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  MapPin, 
  ShieldAlert,
  MessageSquareShare,
  ArrowRight
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData && userData !== "undefined" && userData !== "null") {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  if (!mounted) return null;

  return (
    <footer className="footer-luxury">
      <div className="container mt-5">
        {/* SECTION 1: FEEDBACK & CONTACT */}
        <div className="row align-items-center mb-5 pb-5 border-bottom border-white border-opacity-10">
          <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start ">
            <h2 className="fw-black text-white text-uppercase ls-2 mb-3">CameraPro lắng nghe bạn!</h2>
            <p className="text-white-50 fw-light mb-4 ls-1">
              Chúng tôi trân trọng mọi góp ý để nâng cấp trải nghiệm và sản phẩm tốt hơn mỗi ngày.
            </p>
            <button className="btn-feedback">
              <MessageSquareShare size={18} /> 
              <span>Gửi ý kiến phản hồi</span>
            </button>
          </div>
          
          <div className="col-lg-6">
            <div className="row g-4 justify-content-lg-end">
              <div className="col-sm-6 col-md-5">
                <div className="contact-box">
                  <div className="icon-circle"><Phone size={20}/></div>
                  <div className="ms-3">
                    <div className="contact-label">Hotline 24/7</div>
                    <div className="contact-value">0909 999 999</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="contact-box">
                  <div className="icon-circle"><Mail size={20}/></div>
                  <div className="ms-3">
                    <div className="contact-label">Hỗ trợ kỹ thuật</div>
                    <div className="contact-value">support@camerapro.vn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: MAIN NAVIGATION */}
        <div className="row g-5 mb-5">
          {/* Cột 1: Brand */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading text-warning">CameraPro</h5>
            <ul className="footer-nav">
              <li><Link href="#">Về chúng tôi</Link></li>
              <li><Link href="#">Cơ hội nghề nghiệp</Link></li>
              <li><Link href="#">Hệ thống Showroom</Link></li>
              <li><Link href="#">Liên hệ đối tác</Link></li>
              {user?.roles === 'admin' && (
                <li className="mt-4">
                  <Link href="/admin" className="admin-link">
                    <ShieldAlert size={16} /> Quản trị hệ thống
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Cột 2: Chính sách */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Chính sách</h5>
            <ul className="footer-nav">
              <li><Link href="#">Chính sách đổi trả 1-1</Link></li>
              <li><Link href="#">Bảo hành tận tâm</Link></li>
              <li><Link href="#">Giao hàng hỏa tốc</Link></li>
              <li><Link href="#">Quyền riêng tư</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Hỗ trợ khách</h5>
            <ul className="footer-nav">
              <li><Link href="#">Hướng dẫn mua hàng online</Link></li>
              <li><Link href="#">Tư vấn chọn thiết bị</Link></li>
              <li><Link href="#">Blog kiến thức nhiếp ảnh</Link></li>
              <li><Link href="#">Câu hỏi thường gặp (FAQ)</Link></li>
            </ul>
          </div>

          {/* Cột 4: Kết nối */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Kết nối</h5>
            <div className="social-flex mb-4">
              <Link href="#" className="social-pill"><Facebook size={18}/></Link>
              <Link href="#" className="social-pill"><Instagram size={18}/></Link>
              <Link href="#" className="social-pill"><Youtube size={18}/></Link>
              <Link href="#" className="social-pill"><Twitter size={18}/></Link>
            </div>
            <div className="address-flex">
              <MapPin size={20} className="text-warning mt-1" />
              <p className="ms-2 mb-0">Toà nhà CameraPro, P. Linh Trung, TP. Thủ Đức, HCM</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: COPYRIGHT */}
        <div className="footer-copy pt-4 pb-4">
          <p className="mb-0">
            © {new Date().getFullYear()} CameraPro – Professional Imaging Solution. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx global>{`
        /* Reset & Global Footer Style */
        .footer-luxury {
          background-color: #111214; /* Màu xám đen sâu chuẩn Dashboard */
          color: rgba(255,255,255,0.85);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 0.15em; }
        .ls-1 { letter-spacing: 0.05em; }

        /* Khắc phục lỗi link xanh và gạch chân */
        .footer-luxury a {
          color: inherit;
          text-decoration: none !important;
          transition: all 0.3s ease;
        }

        /* Feedback Button */
        .btn-feedback {
          background: transparent;
          border: 1px solid #ffc107;
          color: #ffc107;
          padding: 12px 28px;
          border-radius: 50px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-transform: uppercase;
          font-size: 0.8rem;
          font-weight: 700;
          transition: 0.3s ease;
        }
        .btn-feedback:hover {
          background: #ffc107;
          color: #111;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(255, 193, 7, 0.2);
        }

        /* Contact Info */
        .contact-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          padding: 15px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .icon-circle {
          width: 45px;
          height: 45px;
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .contact-label { font-size: 10px; color: #777; text-transform: uppercase; letter-spacing: 1px; }
        .contact-value { font-weight: 700; font-size: 1rem; color: #fff; }

        /* Navigation Links */
        .footer-heading {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          margin-bottom: 1.8rem;
          color: #fff;
        }
        .footer-nav { list-style: none; padding: 0; }
        .footer-nav li { margin-bottom: 14px; }
        .footer-nav a {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6) !important;
        }
        .footer-nav a:hover {
          color: #ffc107 !important;
          padding-left: 8px;
        }

        /* Admin Link Special Style */
        .admin-link {
          color: #ffc107 !important;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(255, 193, 7, 0.05);
          border: 1px dashed rgba(255, 193, 7, 0.3);
          border-radius: 8px;
        }

        /* Social Icons */
        .social-flex { display: flex; gap: 12px; }
        .social-pill {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
          color: #fff !important;
        }
        .social-pill:hover {
          background: #ffc107;
          color: #111 !important;
          transform: scale(1.1);
        }

        .address-flex { display: flex; align-items: flex-start; font-size: 0.85rem; opacity: 0.7; }

        .footer-copy {
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
          font-size: 0.75rem;
          letter-spacing: 1px;
          color: #555;
        }
      `}</style>
    </footer>
  );
}
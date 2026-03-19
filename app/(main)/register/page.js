"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../../services/authService";
// THÊM CheckCircle VÀO DANH SÁCH IMPORT
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  AlertCircle, 
  ChevronLeft, 
  ShieldCheck, 
  UserPlus, 
  Fingerprint,
  CheckCircle 
} from "lucide-react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, phone, password, password_confirmation } = formData;
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setErrorMsg("Tên đăng nhập chỉ được chứa chữ và số.");
      return false;
    }
    if (!/^0[0-9]{9}$/.test(phone)) {
      setErrorMsg("Số điện thoại phải bắt đầu bằng số 0 và đủ 10 số.");
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      setErrorMsg("Mật khẩu không được chứa ký tự đặc biệt.");
      return false;
    }
    if (password !== password_confirmation) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await AuthService.register(formData);
      if (res.data.status) {
        setSuccessMsg("Chào mừng bạn! Tài khoản Alpha đã được khởi tạo.");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        setErrorMsg(errors[firstKey][0]);
      } else {
        setErrorMsg(error.response?.data?.message || "Đăng ký thất bại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div className="register-card shadow-2xl overflow-hidden">
          <div className="row g-0">
            {/* CỘT TRÁI - BRANDING */}
            <div className="col-lg-5 brand-section d-none d-lg-flex flex-column justify-content-between p-5 text-white text-start">
              <div className="brand-top">
                <div className="logo-icon mb-4">
                  <ShieldCheck size={40} className="text-orange" />
                </div>
                <h1 className="fw-black display-5 ls-tight mb-3">GIA NHẬP<br/>HỆ SINH THÁI<br/>ALPHA</h1>
                <p className="opacity-75 lead fw-light">Sáng tạo không giới hạn cùng cộng đồng nhiếp ảnh chuyên nghiệp.</p>
              </div>
              
              <div className="brand-bottom">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="feature-dot"></div>
                  <span className="small fw-bold ls-1 text-uppercase">Công nghệ bảo mật Alpha Guard</span>
                </div>
                <Link href="/" className="back-link d-flex align-items-center gap-2 text-decoration-none">
                  <ChevronLeft size={20} /> <span>Về trang chủ</span>
                </Link>
              </div>
            </div>

            {/* CỘT PHẢI - FORM */}
            <div className="col-lg-7 p-4 p-md-5 bg-white text-start">
              <div className="form-header mb-5">
                <h2 className="fw-black text-dark mb-1">ĐĂNG KÝ</h2>
                <p className="text-muted small">Khởi tạo danh tính mới của bạn trong vài giây</p>
              </div>

              {/* HIỂN THỊ LỖI */}
              {errorMsg && (
                <div className="alert-custom error mb-4 animate-shake">
                  <AlertCircle size={18} /> <span>{errorMsg}</span>
                </div>
              )}

              {/* HIỂN THỊ THÀNH CÔNG (ĐÃ FIX LỖI CheckCircle) */}
              {successMsg && (
                <div className="alert-custom success mb-4 animate-fade-in">
                  <CheckCircle size={18} /> <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-floating-custom mb-4">
                  <label>Họ và tên</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input type="text" name="name" placeholder="Nguyễn Văn A" required onChange={handleChange} />
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating-custom">
                      <label>Tên đăng nhập</label>
                      <div className="input-wrapper">
                        <Fingerprint size={18} className="input-icon" />
                        <input type="text" name="username" placeholder="nguyenvana" required onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating-custom">
                      <label>Số điện thoại</label>
                      <div className="input-wrapper">
                        <Phone size={18} className="input-icon" />
                        <input type="text" name="phone" placeholder="09xxxxxxxx" required onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-floating-custom mb-4">
                  <label>Email liên hệ</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input type="email" name="email" placeholder="alpha@sony.com" required onChange={handleChange} />
                  </div>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-md-6">
                    <div className="form-floating-custom">
                      <label>Mật khẩu</label>
                      <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input type="password" name="password" placeholder="••••••" required onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating-custom">
                      <label>Xác nhận</label>
                      <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input type="password" name="password_confirmation" placeholder="••••••" required onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-alpha-submit w-100" disabled={loading}>
                  {loading ? <div className="spinner-border spinner-border-sm"></div> : "TẠO TÀI KHOẢN NGAY"}
                </button>

                <div className="text-center mt-4">
                  <span className="text-muted small">Đã có tài khoản Alpha? </span>
                  <Link href="/login" className="text-orange fw-bold text-decoration-none small ls-1">ĐĂNG NHẬP</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-root {
          background-color: #f4f4f4;
          background-image: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
          font-family: 'Inter', sans-serif;
        }

        .register-card {
          max-width: 1000px;
          width: 100%;
          background: #fff;
          border-radius: 40px;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .brand-section {
          background: #111;
          position: relative;
          overflow: hidden;
        }

        .brand-section::after {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(204, 102, 0, 0.15) 0%, transparent 50%);
          top: -50%;
          left: -50%;
        }

        .fw-black { font-weight: 900; }
        .text-orange { color: #CC6600; }
        .ls-tight { letter-spacing: -1px; }
        .ls-1 { letter-spacing: 1px; }

        .form-floating-custom label {
          font-size: 11px;
          font-weight: 800;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: #bbb;
          transition: 0.3s;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 15px 14px 45px;
          background: #f9f9f9;
          border: 1.5px solid #eee;
          border-radius: 15px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          background: #fff;
          border-color: #111;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .btn-alpha-submit {
          background: #111;
          color: #fff;
          border: none;
          padding: 18px;
          border-radius: 20px;
          font-weight: 800;
          letter-spacing: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-alpha-submit:hover {
          background: #CC6600;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(204, 102, 0, 0.3);
        }

        .alert-custom {
          padding: 12px 20px;
          border-radius: 15px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .error { background: #fff5f5; color: #c53030; border-left: 5px solid #c53030; }
        .success { background: #f0fff4; color: #2f855a; border-left: 5px solid #2f855a; }

        .back-link {
          color: rgba(255,255,255,0.6);
          font-weight: 700;
          font-size: 13px;
          transition: 0.3s;
        }
        .back-link:hover { color: #fff; transform: translateX(-5px); }

        .feature-dot {
          width: 8px;
          height: 8px;
          background: #CC6600;
          border-radius: 50%;
          box-shadow: 0 0 10px #CC6600;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out 2; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
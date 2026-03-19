"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import authService from "../../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login({ email, password });

      if (res.data.status) {
        const userData = res.data.user;
        const token = res.data.token;

        Cookies.set('user_data', JSON.stringify(userData), { expires: 7 });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Bắn sự kiện để Header/Footer cập nhật ngay lập tức
        window.dispatchEvent(new Event("storage"));

        if (userData.role === 'admin' || userData.role === 1) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        setError(res.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sai email hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-luxury shadow-lg">
        <div className="text-center mb-5">
          <div className="auth-logo mb-3">
             <ShieldCheck size={40} className="text-orange" />
          </div>
          <h2 className="fw-black text-uppercase ls-2">Đăng Nhập</h2>
          <p className="text-muted small ls-1">Chào mừng bạn trở lại với CameraPro</p>
        </div>

        {error && (
          <div className="alert-luxury mb-4 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group-luxury mb-4">
            <label className="uppercase ls-1">Địa chỉ Email</label>
            <div className="input-field">
              <Mail size={18} className="icon" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group-luxury mb-4">
            <div className="d-flex justify-content-between">
              <label className="uppercase ls-1">Mật khẩu</label>
              <Link href="/forgot-password" style={{fontSize: '11px'}} className="text-orange text-decoration-none fw-bold">Quên mật khẩu?</Link>
            </div>
            <div className="input-field">
              <Lock size={18} className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="btn-show-pass" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="btn-auth-luxury w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <>ĐĂNG NHẬP NGAY <ArrowRight size={18} className="ms-2" /></>
            )}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-muted small">
            Chưa có tài khoản? <Link href="/register" className="text-orange fw-bold text-decoration-none">Đăng ký thành viên</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-wrapper {
          min-vh: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8e8e8ff;
         
          padding: 20px;
        }

        .auth-card-luxury {
          background: #fff;
          width: 100%;
          max-width: 450px;
          padding: 50px;
          border-radius: 30px;
          position: relative;
        }

        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .uppercase { text-transform: uppercase; }
        .text-orange { color: #CC6600; }

        .alert-luxury {
          background: #fff5f5;
          color: #c53030;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          border-left: 4px solid #c53030;
        }

        .input-group-luxury label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #999;
          margin-bottom: 8px;
        }

        .input-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-field .icon {
          position: absolute;
          left: 15px;
          color: #ccc;
        }

        .input-field input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border-radius: 15px;
          border: 1px solid #eee;
          background: #fdfdfd;
          font-size: 14px;
          transition: 0.3s;
        }

        .input-field input:focus {
          outline: none;
          border-color: #CC6600;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(204, 102, 0, 0.1);
        }

        .btn-show-pass {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          color: #ccc;
          padding: 0;
        }

        .btn-auth-luxury {
          background: #111;
          color: #fff;
          border: none;
          padding: 18px;
          border-radius: 15px;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 1px;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-auth-luxury:hover:not(:disabled) {
          background: #CC6600;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(204, 102, 0, 0.2);
        }

        .btn-auth-luxury:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @media (max-width: 480px) {
          .auth-card-luxury { padding: 30px; }
        }
      `}</style>
    </div>
  );
}
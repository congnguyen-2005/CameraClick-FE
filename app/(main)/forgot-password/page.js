"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Tạm thời chỉ giả lập gửi mail vì Backend có thể chưa xong API này
    setTimeout(() => {
      setMessage("Nếu email tồn tại, một liên kết đặt lại mật khẩu sẽ được gửi đến bạn.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-luxury shadow-lg">
        <div className="text-center mb-5">
          <h2 className="fw-black text-uppercase ls-2">Khôi Phục</h2>
          <p className="text-muted small ls-1">Nhập email để nhận liên kết đặt lại mật khẩu</p>
        </div>

        {message && (
          <div className="alert-success-luxury mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group-luxury mb-4">
            <label className="uppercase ls-1">Địa chỉ Email</label>
            <div className="input-field">
              <Mail size={18} className="icon" />
              <input
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn-auth-luxury w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <>GỬI LIÊN KẾT <Send size={18} className="ms-2" /></>
            )}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link href="/login" className="text-muted small text-decoration-none d-flex align-items-center justify-content-center hover-orange">
            <ArrowLeft size={16} className="me-2" /> Quay lại Đăng nhập
          </Link>
        </div>
      </div>

      <style jsx>{`
        .auth-wrapper {
          min-height: 100vh;
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
        }
        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .uppercase { text-transform: uppercase; }
        .alert-success-luxury {
          background: #f0fff4;
          color: #2f855a;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          border-left: 4px solid #48bb78;
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
          font-size: 14px;
        }
        .btn-auth-luxury {
          background: #111;
          color: #fff;
          border: none;
          padding: 18px;
          border-radius: 15px;
          font-weight: 800;
          transition: 0.3s;
        }
        .btn-auth-luxury:hover {
          background: #CC6600;
        }
        .hover-orange:hover {
          color: #CC6600 !important;
        }
      `}</style>
    </div>
  );
}
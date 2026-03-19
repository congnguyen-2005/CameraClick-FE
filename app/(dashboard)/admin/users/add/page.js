"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserService from "../../../../services/userService";
import { UserPlus, User as UserIcon, Mail, Lock, ShieldCheck, ArrowLeft, Save, RefreshCw, Phone, UserCheck } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserAdd() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // Thêm state username
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  const payload = { 
    name, 
    email, 
    password, 
    roles, 
    phone, 
    username // Đảm bảo bạn đã thêm ô nhập username hoặc để trống để backend tự tạo
  };

  try {
    await UserService.create(payload);
    router.push("/admin/users");
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // ĐỌC LỖI TỪ LARAVEL
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat().join("\n");
      alert("Lỗi xác thực dữ liệu:\n" + errorMessages);
    } else {
      alert(error.response?.data?.message || "Lỗi hệ thống không xác định");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  if (!isClient) return null;

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 px-lg-5 text-start">
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <button 
            onClick={() => router.back()} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 hover-scale transition-all"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          <div className="text-center">
            <h2 className="fw-black text-dark mb-0 text-uppercase ls-1">Tạo Thành Viên</h2>
            <p className="text-muted small fw-light mb-0">Hệ thống quản trị Alpha Pro</p>
          </div>
          <div style={{ width: "120px" }}></div>
        </div>

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
          <div className="bg-dark p-4 text-white d-flex align-items-center gap-3">
            <div className="bg-primary p-2 rounded-3 shadow">
              <UserPlus size={24} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold">Thông tin tài khoản</h5>
              <p className="small mb-0 opacity-50">Cung cấp định danh và quyền hạn cho thành viên mới</p>
            </div>
          </div>

          <div className="card-body p-4 p-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* HỌ TÊN */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Họ và tên</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted"><UserIcon size={18} /></span>
                    <input type="text" className="form-control bg-transparent border-0 shadow-none fw-medium py-2" 
                      placeholder="Nguyễn Văn A" onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>

                {/* USERNAME - FIX LỖI SQL 1364 */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Tên đăng nhập (Username)</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted"><UserCheck size={18} /></span>
                    <input type="text" className="form-control bg-transparent border-0 shadow-none fw-medium py-2" 
                      placeholder="nguyenvana" onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="col-md-12">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Địa chỉ Email</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted"><Mail size={18} /></span>
                    <input type="email" className="form-control bg-transparent border-0 shadow-none fw-medium py-2" 
                      placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                {/* SỐ ĐIỆN THOẠI */}
                <div className="col-md-12">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Số điện thoại</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted"><Phone size={18} /></span>
                    <input type="text" className="form-control bg-transparent border-0 shadow-none fw-medium py-2" 
                      placeholder="09xx xxx xxx" onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                {/* MẬT KHẨU - ĐÃ XÓA THUỘC TÍNH 'var' GÂY LỖI */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Mật khẩu</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted"><Lock size={18} /></span>
                    <input type="password" 
                      className="form-control bg-transparent border-0 shadow-none fw-medium py-2" 
                      placeholder="••••••••" 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* VAI TRÒ */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Cấp độ truy cập</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0 text-primary"><ShieldCheck size={18} /></span>
                    <select className="form-select bg-transparent border-0 shadow-none fw-bold" 
                      value={roles} onChange={(e) => setRoles(e.target.value)}>
                      <option value="customer">Khách hàng</option>
                      <option value="staff">Nhân viên</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-top d-flex justify-content-end">
                <button type="submit" className="btn btn-dark btn-lg rounded-pill px-5 shadow-lg d-flex align-items-center gap-2 transition-all hover-scale" disabled={isSubmitting}>
                  {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : (
                    <><Save size={20} /> <span className="fw-bold small">Lưu thành viên</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.1em; }
        .hover-scale:hover { transform: scale(1.02); }
        .transition-all { transition: all 0.3s ease; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
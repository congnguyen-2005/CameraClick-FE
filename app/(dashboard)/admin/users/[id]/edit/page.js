"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserService from "../../../../../services/userService";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  ShieldCheck, 
  Lock, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserEdit() {
  const { id } = useParams();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await UserService.getById(id);
        const user = res.data.data;
        setName(user.name);
        setEmail(user.email);
        setRoles(user.roles);
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const updateData = { name, email, roles };
    if (password) updateData.password = password;

    try {
      await UserService.update(id, updateData);
      router.push("/admin/users");
    } catch (error) {
      alert("❌ Lỗi cập nhật dữ liệu!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <RefreshCw className="text-primary animate-spin mb-3" size={40} />
      <span className="text-muted fw-light">Đang truy xuất hồ sơ thành viên...</span>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 px-lg-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* HEADER BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <button 
            onClick={() => router.push("/admin/users")} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          <div className="text-center">
            <h2 className="fw-black text-dark mb-0 text-uppercase ls-1">Hiệu Chỉnh Hồ Sơ</h2>
            <p className="text-muted small fw-light mb-0">ID Thành viên: #{id}</p>
          </div>
          <div style={{ width: "120px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
              
              <form onSubmit={handleSubmit}>
                {/* SECTION 1: BASIC INFO */}
                <div className="p-4 p-lg-5">
                  <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                    <User size={20} className="text-primary" />
                    <h5 className="fw-bold mb-0">Thông tin cơ bản</h5>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-md-12">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">Họ và tên</label>
                      <input 
                        type="text" 
                        className="form-control custom-input py-3 shadow-none border-0 bg-light" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="col-md-7">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">Địa chỉ Email</label>
                      <div className="input-group bg-light rounded-4 px-3 align-items-center">
                        <Mail size={18} className="text-muted" />
                        <input 
                          type="email" 
                          className="form-control bg-transparent border-0 shadow-none py-3" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">Phân quyền</label>
                      <div className="input-group bg-light rounded-4 px-3 align-items-center border-start border-primary border-4">
                        <ShieldCheck size={18} className="text-primary" />
                        <select 
                          className="form-select bg-transparent border-0 shadow-none fw-bold" 
                          value={roles} 
                          onChange={(e) => setRoles(e.target.value)}
                        >
                          <option value="customer">Khách hàng</option>
                          <option value="staff">Nhân viên</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: SECURITY */}
                <div className="p-4 p-lg-5 bg-light border-top border-bottom border-light">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Lock size={20} className="text-warning" />
                    <h5 className="fw-bold mb-0 text-dark">Bảo mật tài khoản</h5>
                  </div>
                  <p className="text-muted small mb-4">
                    <AlertCircle size={14} className="me-1 mb-1" />
                    Chỉ nhập mật khẩu nếu bạn muốn thiết lập lại mật khẩu cho thành viên này.
                  </p>
                  
                  <div className="col-md-8">
                    <label className="form-label small fw-bold text-muted text-uppercase ls-1">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="form-control custom-input py-3 shadow-none border-0 bg-white shadow-sm" 
                      placeholder="Để trống để giữ nguyên mật khẩu cũ..."
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="p-4 p-lg-5 text-end">
                  <button 
                    type="submit" 
                    className="btn btn-warning btn-lg rounded-pill px-5 shadow-lg fw-bold d-inline-flex align-items-center gap-2 transition-all hover-scale text-dark"
                    disabled={submitting}
                  >
                    {submitting ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                    Cập Nhật Thông Tin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; }
        .custom-input {
          border-radius: 12px;
          transition: 0.3s;
        }
        .custom-input:focus {
          background-color: #fff !important;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1) !important;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
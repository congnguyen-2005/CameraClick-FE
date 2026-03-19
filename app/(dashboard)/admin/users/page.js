"use client";

import { useEffect, useState } from "react";
import UserService from "../../../services/userService";
import Link from "next/link";
import { 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Mail, 
  ShieldCheck, 
  RefreshCw,
  User
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Giải pháp sửa lỗi Hydration
  const [isClient, setIsClient] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    UserService.getAll()
      .then(res => {
        const userData = res?.data?.data?.data || res?.data?.data || [];
        setUsers(Array.isArray(userData) ? userData : []);
      })
      .catch(err => {
        console.error("Lỗi lấy danh sách user:", err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setIsClient(true); // Đánh dấu đã mounted trên trình duyệt
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("⚠️ Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa thành viên này?")) {
      try {
        await UserService.delete(id);
        fetchUsers();
      } catch (err) {
        alert("Không thể xóa người dùng này.");
      }
    }
  };

  const getRoleUI = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': 
        return { label: 'Quản trị viên', class: 'bg-danger-subtle text-danger border-danger-subtle' };
      case 'staff': 
        return { label: 'Nhân viên', class: 'bg-warning-subtle text-warning border-warning-subtle' };
      default: 
        return { label: 'Khách hàng', class: 'bg-primary-subtle text-primary border-primary-subtle' };
    }
  };

  // Nếu chưa ở Client, trả về null để tránh lệch HTML render từ Server
  if (!isClient) return null;

  return (
    <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100">
      {/* HEADER SECTION */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-3">
            <ShieldCheck size={36} className="text-primary" /> Kiểm Soát Thành Viên
          </h2>
          <p className="text-muted fw-light ps-5 mb-0">Quản lý quyền hạn và thông tin định danh hệ thống</p>
        </div>
        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          <Link href="/admin/users/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2 transition-all hover-scale text-decoration-none">
            <UserPlus size={20} />
            <span className="small fw-bold">Thêm thành viên mới</span>
          </Link>
        </div>
      </div>

      {/* FILTER BOX */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white">
        <div className="card-body p-3">
          <div className="col-md-4">
            <div className="input-group border rounded-pill px-3 py-1 bg-light align-items-center">
              <span className="input-group-text bg-transparent border-0 text-muted">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                className="form-control bg-transparent border-0 shadow-none mt-1" 
                placeholder="Tìm theo tên hoặc email..." 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* USERS TABLE CARD */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr className="text-muted small text-uppercase ls-1">
                <th className="py-4 ps-4" style={{ width: "80px" }}>ID</th>
                <th className="py-4">Người dùng</th>
                <th className="py-4">Liên hệ</th>
                <th className="py-4">Phân quyền</th>
                <th className="py-4 text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <RefreshCw className="animate-spin text-primary opacity-50 mb-2" size={32} />
                    <p className="text-muted small">Đang truy xuất dữ liệu...</p>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.filter(u => 
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  u.email.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(u => {
                  const roleStyle = getRoleUI(u.roles);
                  return (
                    <tr key={u.id} className="transition-all">
                      <td className="ps-4 text-muted small fw-medium">#{u.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-circle shadow-sm bg-primary text-white fw-bold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{u.name}</div>
                            <small className="text-muted fs-xs">Hoạt động lần cuối: 2 giờ trước</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <Mail size={14} /> {u.email}
                        </div>
                      </td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 border ${roleStyle.class}`}>
                          {roleStyle.label}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                          <Link 
                            href={`/admin/users/${u.id}/edit`} 
                            className="btn btn-white btn-sm px-3 py-2 border-end text-decoration-none"
                            title="Chỉnh sửa"
                          >
                            <Edit3 size={16} className="text-warning" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(u.id)} 
                            className="btn btn-white btn-sm px-3 py-2 border-0"
                            title="Xóa"
                          >
                            <Trash2 size={16} className="text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <User size={48} className="text-muted opacity-25 mb-3" />
                    <p className="text-muted fw-light">Hệ thống chưa ghi nhận thành viên nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.05em; }
        .fs-xs { font-size: 0.75rem; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-scale:hover { transform: scale(1.02); }
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }
        .bg-danger-subtle { background-color: #fff5f5 !important; }
        .bg-warning-subtle { background-color: #fff9db !important; }
        .bg-primary-subtle { background-color: #ebfbee !important; }
        .btn-white { background: #fff; border: none; }
        .btn-white:hover { background: #f8f9fa; }
        .table-hover tbody tr:hover { background-color: #fcfcfc; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
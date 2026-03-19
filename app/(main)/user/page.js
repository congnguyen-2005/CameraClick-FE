"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import userService from "../../services/userService";
import authService from "../../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
// Đã xóa ShoppingBag và XCircle vì không còn dùng
import { User, Lock, LogOut, Camera, AlertCircle } from "lucide-react";

// Cấu hình đường dẫn API
const API_URL = "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api";
const IMG_STORAGE = `${API_URL}/storage/`;

export default function UserPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIC TẢI DỮ LIỆU ---
  const fetchUserData = useCallback(async () => {
    try {
      const res = await userService.getProfile();
      
      // Xử lý dữ liệu trả về
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(res.data);
      }

    } catch (error) {
      console.error("Lỗi tải profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken"); 
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    if (!confirm("Bạn có chắc muốn đăng xuất?")) return;
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    }
    localStorage.clear();
    window.location.href = "/login";
  };

  // --- HÀM XỬ LÝ ẢNH CHUNG ---
  const getAvatarSrc = (u) => {
    if (u?.avatar) {
        if (u.avatar.startsWith('http')) return u.avatar;
        return `${IMG_STORAGE}${u.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || 'User')}&background=random&size=200`;
  };

  // --- MÀN HÌNH LOADING ---
  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      <div className="spinner-border text-warning mb-3" role="status"></div>
      <p className="text-muted">Đang tải thông tin...</p>
    </div>
  );

  // --- MÀN HÌNH LỖI KHI KHÔNG CÓ USER ---
  if (!user && !loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <AlertCircle size={40} className="text-danger mb-2" />
      <p>Không thể tải thông tin người dùng.</p>
      <button onClick={() => window.location.reload()} className="btn btn-warning text-white fw-bold">Tải lại trang</button>
    </div>
  );

  return (
    <main className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="row g-4">

          {/* --- SIDEBAR TRÁI --- */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '100px', zIndex: 1 }}>
              <div className="card-body text-center p-4 bg-white">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={getAvatarSrc(user)}
                    className="rounded-circle border"
                    alt="Avatar"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
                    }}
                  />
                  <button
                    className="position-absolute bottom-0 end-0 btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                    onClick={() => setActiveTab('profile')}
                    style={{ width: '32px', height: '32px' }}
                    title="Đổi ảnh đại diện"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <h6 className="fw-bold mb-0 text-truncate px-2">{user?.name}</h6>
                <small className="text-muted text-truncate d-block px-2">{user?.email}</small>
              </div>

              <div className="list-group list-group-flush py-2">
                <MenuButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18} />} label="Hồ sơ cá nhân" />
                {/* Đã xóa nút Lịch sử đơn hàng */}
                <MenuButton active={activeTab === 'password'} onClick={() => setActiveTab('password')} icon={<Lock size={18} />} label="Đổi mật khẩu" />
                <div className="px-3 pt-2">
                  <button
                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- CONTENT PHẢI --- */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              {activeTab === 'profile' && <ProfileTab user={user} refreshUser={fetchUserData} getAvatarSrc={getAvatarSrc} />}
              {/* Đã xóa logic render OrdersTab */}
              {activeTab === 'password' && <PasswordTab />}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

// Component Menu Button nhỏ gọn
const MenuButton = ({ active, onClick, icon, label }) => (
  <button
    className={`list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-3 px-4 ${active ? 'bg-light text-warning fw-bold' : 'text-secondary'}`}
    onClick={onClick}
    style={active ? { borderLeft: '4px solid #CC6600' } : {}}
  >
    <span>{icon}</span> {label}
  </button>
);

// --- TAB 1: HỒ SƠ CÁ NHÂN ---
function ProfileTab({ user, refreshUser, getAvatarSrc }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Đồng bộ dữ liệu User vào Form khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [msg, setMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("File ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    if (avatarFile) data.append('avatar', avatarFile);

    try {
      const res = await userService.updateProfile(data); 
      setMsg({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });

      // Cập nhật localStorage
      const updatedUser = res.data.user; 
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Bắn sự kiện để Header nhận biết
      window.dispatchEvent(new Event('storage'));
      
      setAvatarFile(null); 
      await refreshUser();
    } catch (err) {
      console.error(err);
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xác định ảnh hiển thị
  const currentAvatarSrc = previewAvatar || getAvatarSrc(user);

  return (
    <div className="animate-fade-in">
      <h4 className="fw-bold mb-4">Thông tin tài khoản</h4>

      {msg && (
        <div className={`alert alert-${msg.type} d-flex align-items-center`} role="alert">
          {msg.type === 'success' ? <span className="me-2">✅</span> : <span className="me-2">⚠️</span>}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 text-center mb-4 d-flex flex-column align-items-center">
            <div className="position-relative mb-3">
              <img
                src={currentAvatarSrc}
                className="rounded-circle shadow-sm"
                style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid white' }}
                alt="Preview"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}`; }}
              />
            </div>
            <label className="btn btn-outline-warning btn-sm rounded-pill px-4" htmlFor="avatarInput">
              <Camera size={16} className="me-2" />
              {avatarFile ? "Đổi ảnh khác" : "Chọn ảnh mới"}
            </label>
            <input id="avatarInput" type="file" className="d-none" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" />
            <small className="text-muted mt-2 fst-italic">Dung lượng tối đa: 2MB</small>
          </div>

          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label fw-bold">Họ và tên</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Số điện thoại</label>
              <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="VD: 0912345678" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Địa chỉ</label>
              <input type="text" className="form-control" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="VD: 123 Đường ABC, Quận X" />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Email</label>
              <input type="text" className="form-control bg-light text-muted" value={user?.email || ''} disabled />
            </div>

            <div className="text-end">
              <button className="btn btn-warning text-white fw-bold px-5 rounded-pill shadow-sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// --- TAB 2: ĐỔI MẬT KHẨU ---
function PasswordTab() {
  const [pass, setPass] = useState({ current: '', new: '', confirm: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (pass.new !== pass.confirm) {
      return setMsg({ type: 'danger', text: 'Mật khẩu xác nhận không khớp!' });
    }
    if (pass.new.length < 6) {
      return setMsg({ type: 'danger', text: 'Mật khẩu mới quá ngắn (tối thiểu 6 ký tự).' });
    }

    setLoading(true);
    try {
      await userService.changePassword(pass);
      setMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPass({ current: '', new: '', confirm: '' });
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Mật khẩu hiện tại không đúng.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in mx-auto" style={{ maxWidth: '500px' }}>
      <h4 className="fw-bold mb-4 text-center">Đổi mật khẩu</h4>

      {msg && <div className={`alert alert-${msg.type} text-center`}>{msg.text}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Mật khẩu hiện tại</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><Lock size={18} /></span>
            <input type="password" className="form-control" value={pass.current} onChange={e => setPass({ ...pass, current: e.target.value })} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Mật khẩu mới</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><Lock size={18} /></span>
            <input type="password" className="form-control" value={pass.new} onChange={e => setPass({ ...pass, new: e.target.value })} required />
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label fw-bold">Xác nhận mật khẩu mới</label>
          <div className="input-group">
            <span className="input-group-text bg-white"><Lock size={18} /></span>
            <input type="password" className="form-control" value={pass.confirm} onChange={e => setPass({ ...pass, confirm: e.target.value })} required />
          </div>
        </div>
        <button className="btn btn-warning text-white fw-bold w-100 rounded-pill" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  );
}
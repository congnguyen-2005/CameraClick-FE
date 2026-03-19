"use client";

import { useEffect, useState, useCallback } from "react";
import OrderService from "../../../services/orderService"; 
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link"; 
import { 
  Eye, CheckCircle, Clock, XCircle, 
  Search, MoreHorizontal, Download, Truck, Edit3,
  ChevronLeft, ChevronRight, Hash, Calendar, User, CreditCard
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrdersAdmin() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setMounted(true);
    // Khởi tạo bootstrap JS để dropdown hoạt động mượt mà
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!mounted) return;
    setLoading(true);
    try {
      const params = {
        keyword: keyword,
        status: statusFilter === "all" ? null : statusFilter,
        page: page
      };
      const res = await OrderService.getAll(params);
      const result = res.data.data;
      
      if (result && result.data) {
        setOrders(result.data);
        setTotalPages(result.last_page);
      } else {
        setOrders(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      console.error("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, page, mounted]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchOrders(); }, 400);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleUpdateStatus = async (id, newStatus) => {
    if (newStatus === 4) {
      const reason = prompt("Lý do hủy đơn hàng này:");
      if (reason === null) return;
      try {
        await OrderService.cancelOrder(id, reason);
        alert("Đã hủy đơn hàng thành công!");
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi hủy đơn");
      }
      return;
    }

    if (!confirm("Xác nhận thay đổi trạng thái?")) return;
    
    try {
      await OrderService.updateStatus(id, newStatus);
      alert("Cập nhật thành công!");
      fetchOrders(); 
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi cập nhật");
    }
  };

  const getStatusBadge = (status) => {
    const s = parseInt(status);
    const badges = {
      0: { class: "bg-warning-subtle text-warning", icon: <Clock size={12}/>, text: "Chờ duyệt" },
      1: { class: "bg-info-subtle text-info", icon: <CheckCircle size={12}/>, text: "Đã duyệt" },
      2: { class: "bg-primary-subtle text-primary", icon: <Truck size={12}/>, text: "Đang giao" },
      3: { class: "bg-success-subtle text-success", icon: <CheckCircle size={12}/>, text: "Thành công" },
      4: { class: "bg-danger-subtle text-danger", icon: <XCircle size={12}/>, text: "Đã hủy" }
    };
    const b = badges[s] || { class: "bg-secondary-subtle text-secondary", icon: null, text: "Khác" };
    return <span className={`badge-admin ${b.class}`}>{b.icon} {b.text}</span>;
  };

  if (!mounted) return null;

  return (
    <div className="admin-orders-container p-4 font-sans bg-light min-vh-100">
      {/* 1. HEADER */}
      <div className="row align-items-center mb-4 g-3">
        <div className="col-md-6 text-start">
          <h2 className="fw-black text-uppercase ls-2 mb-1">Quản lý Đơn hàng</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small m-0">
              <li className="breadcrumb-item"><Link href="/admin" className="text-muted text-decoration-none">Admin</Link></li>
              <li className="breadcrumb-item active fw-bold text-dark text-uppercase">Orders</li>
            </ol>
          </nav>
        </div>
        <div className="col-md-6 text-md-end">
          <button className="btn btn-dark rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
            <Download size={18} /> <span className="small fw-bold text-uppercase">Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* 2. FILTERS */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-4 bg-white">
          <div className="row g-3">
            <div className="col-lg-4">
              <div className="search-box position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                <input 
                  type="text" 
                  className="form-control border-0 bg-light rounded-pill ps-5 py-2 fw-bold" 
                  placeholder="Mã đơn, tên khách..." 
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            <div className="col-lg-8 d-flex justify-content-lg-end gap-2 flex-wrap">
              {['all', '0', '1', '2', '3', '4'].map(st => (
                <button 
                  key={st}
                  className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${statusFilter === st ? 'btn-dark' : 'btn-light'}`}
                  onClick={() => { setStatusFilter(st); setPage(1); }}
                >
                  {st === 'all' ? 'Tất cả' : st === '0' ? 'Chờ duyệt' : st === '1' ? 'Đã duyệt' : st === '2' ? 'Đang giao' : st === '3' ? 'Hoàn tất' : 'Đã hủy'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BẢNG DỮ LIỆU - SỬA LỖI UI DROPDOWN */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive-custom">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-secondary small fw-bold text-uppercase border-bottom">
                <th className="py-4 ps-4">Mã đơn</th>
                <th className="py-4">Khách hàng</th>
                <th className="py-4 text-center">Ngày đặt</th>
                <th className="py-4 text-center">Tổng tiền</th>
                <th className="py-4 text-center">Trạng thái</th>
                <th className="py-4 text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-dark" /></td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="admin-tr border-bottom transition-all">
                  <td className="ps-4 fw-black text-primary">#{o.id}</td>
                  <td>
                    <div className="fw-bold text-dark">{o.name || "Khách lẻ"}</div>
                    <div className="text-muted small d-flex align-items-center gap-1">
                      <CreditCard size={10} /> {o.payment_method === 'vnpay' ? 'Thanh toán Online' : 'Tiền mặt (COD)'}
                    </div>
                  </td>
                  <td className="text-center text-muted small">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="text-center fw-black text-dark">{Number(o.total_money || 0).toLocaleString()}₫</td>
                  <td className="text-center">{getStatusBadge(o.status)}</td>
                  <td className="text-end pe-4">
                    {/* DROP DOWN START */}
                    <div className="dropdown position-static">
                      <button 
                        className="btn btn-action-circle" 
                        type="button" 
                        data-bs-toggle="dropdown" 
                        data-bs-boundary="viewport"
                        aria-expanded="false"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 custom-dropdown">
                        <li>
                          <Link href={`/admin/orders/${o.id}/show`} className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2">
                            <Eye size={16} className="text-primary"/> Chi tiết đơn hàng
                          </Link>
                        </li>
                        
                        {parseInt(o.status) === 0 && (
                          <>
                            <li><hr className="dropdown-divider opacity-50" /></li>
                            <li><button className="dropdown-item text-success fw-bold py-2" onClick={() => handleUpdateStatus(o.id, 1)}>✅ Xác nhận đơn</button></li>
                            <li><button className="dropdown-item text-danger py-2" onClick={() => handleUpdateStatus(o.id, 4)}>❌ Hủy đơn hàng</button></li>
                          </>
                        )}
                        
                        {parseInt(o.status) === 1 && (
                          <li><button className="dropdown-item text-primary fw-bold py-2" onClick={() => handleUpdateStatus(o.id, 2)}>🚚 Gửi hàng đi</button></li>
                        )}
                        
                        {parseInt(o.status) === 2 && (
                          <li><button className="dropdown-item text-success fw-bold py-2" onClick={() => handleUpdateStatus(o.id, 3)}>✨ Giao thành công</button></li>
                        )}
                      </ul>
                    </div>
                    {/* DROP DOWN END */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PHÂN TRANG */}
        <div className="card-footer bg-white p-4 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <span className="small fw-bold text-muted text-uppercase">Trang {page} / {totalPages}</span>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-dark btn-sm px-4 rounded-pill fw-bold" disabled={page <= 1} onClick={() => setPage(page - 1)}>TRƯỚC</button>
              <button className="btn btn-dark btn-sm px-4 rounded-pill fw-bold" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>TIẾP</button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 2px; }
        .font-sans { font-family: 'Inter', -apple-system, sans-serif; }
        
        .badge-admin {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 50px; font-size: 10px; font-weight: 800; text-transform: uppercase;
        }

        /* KHẮC PHỤC LỖI DROPDOWN BỊ CẮT */
        .table-responsive-custom {
          overflow-x: auto;
          overflow-y: visible; /* Cho phép nội dung nổi lên trên */
          min-height: 400px; /* Đảm bảo đủ không gian cho dropdown của hàng cuối cùng */
        }

        .admin-tr:hover {
          background-color: #fcfcfc !important;
        }

        .custom-dropdown {
          z-index: 9999 !important;
          min-width: 220px;
          margin-top: 5px !important;
        }

        .dropdown-item {
          transition: 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .btn-action-circle {
          width: 38px; height: 38px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid #eee; background: white; transition: 0.3s;
          color: #666;
        }
        .btn-action-circle:hover { background: #000; color: #fff; border-color: #000; }
        
        .transition-all { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
      `}</style>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Calendar, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck,
  ShoppingBag,
  Search,
  RotateCcw,
  MessageCircle,
  Trash2,
  AlertTriangle
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderService from "../../services/orderService"; 

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // --- 1. TẢI DỮ LIỆU ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderService.getHistory();
      
      // Hỗ trợ cấu hình trả về linh hoạt từ Backend
      const data = res.data?.data || res.data || [];
      
      // Sắp xếp đơn mới nhất lên đầu
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];
      
      setOrders(sortedData);
      setFilteredOrders(sortedData);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. XỬ LÝ TÌM KIẾM ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
    } else {
      const results = orders.filter(order => 
        order.id.toString().includes(searchTerm) ||
        (order.order_code && order.order_code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOrders(results);
    }
  }, [searchTerm, orders]);

  // --- 3. XỬ LÝ HỦY ĐƠN HÀNG ---
  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("⚠️ Bạn có chắc chắn muốn hủy đơn hàng này? Vui lòng nhập lý do hủy:");
    
    if (reason === null) return; // Nhấn Cancel trong prompt

    try {
      // Gọi API với lý do hủy để tránh lỗi 500 nếu backend yêu cầu lý do
      await OrderService.cancelOrder(orderId, reason || "Người dùng yêu cầu hủy");
      alert("✅ Đã gửi yêu cầu hủy đơn hàng thành công!");
      fetchOrders(); 
    } catch (error) {
      const errMsg = error.response?.data?.message || "Không thể hủy đơn hàng ở trạng thái này.";
      alert(`❌ Lỗi: ${errMsg}`);
    }
  };

  // --- 4. XỬ LÝ MUA LẠI ---
  const handleBuyAgain = (orderId) => {
    alert(`🛒 Đang tải lại sản phẩm từ đơn #${orderId} vào giỏ hàng...`);
    router.push("/cart");
  };

  // Helper: Badge trạng thái (Phù hợp với Database 0, 1, 2, 3...)
  const getStatusBadge = (status) => {
    const s = parseInt(status);
    switch (s) {
      case 0: 
        return <span className="badge-luxury badge-pending"><Clock size={14} className="me-1" /> Chờ xác nhận</span>;
      case 1: 
        return <span className="badge-luxury badge-shipping"><Truck size={14} className="me-1" /> Đang giao hàng</span>;
      case 2: 
        return <span className="badge-luxury badge-success"><CheckCircle2 size={14} className="me-1" /> Đã hoàn thành</span>;
      case 3: 
      case 4: 
        return <span className="badge-luxury badge-danger"><XCircle size={14} className="me-1" /> Đã hủy bỏ</span>;
      default:
        return <span className="badge bg-secondary rounded-pill">Trạng thái khác</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(Number(amount || 0)) + ' ₫';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--/--/----";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-light min-vh-100 pb-5 text-start">
      {/* HEADER LUXURY */}
      <div className="py-5 mb-4 bg-white shadow-sm border-bottom">
        <div className="container px-lg-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-box-header">
                <Package size={28} className="text-white" />
              </div>
              <div>
                <h2 className="fw-black text-uppercase m-0 ls-1">Đơn hàng của tôi</h2>
                <p className="text-muted small mb-0">Theo dõi tiến độ và lịch sử mua sắm của bạn</p>
              </div>
            </div>
            <div className="search-container position-relative">
              <Search className="position-absolute top-50 translate-middle-y text-muted ms-3" size={18} />
              <input 
                type="text" 
                className="form-control form-control-lg ps-5 rounded-pill border-0 shadow-sm bg-light"
                placeholder="Tìm mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-lg-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-luxury mx-auto"></div>
            <p className="mt-3 fw-bold text-uppercase ls-1 small text-muted">Hệ thống đang truy xuất dữ liệu...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center bg-white p-5 rounded-5 border shadow-sm animate-fade-in">
            <ShoppingBag size={64} className="text-muted opacity-25 mb-4" />
            <h4 className="fw-bold">Bạn chưa có giao dịch nào</h4>
            <p className="text-muted mb-4">Hãy lấp đầy giỏ hàng của bạn bằng những sản phẩm tuyệt vời nhất.</p>
            <Link href="/product" className="btn btn-dark rounded-pill px-5 py-2 fw-bold text-decoration-none transition-all hover-scale">
              MUA SẮM NGAY
            </Link>
          </div>
        ) : (
          <div className="row g-4 animate-fade-in">
            {filteredOrders.map((order) => {
                const s = parseInt(order.status);
                return (
              <div key={order.id} className="col-12">
                <div className="order-card bg-white rounded-4 border shadow-sm overflow-hidden position-relative">
                  <div className={`decorative-bar ${s === 3 || s === 4 ? 'bg-danger' : s === 2 ? 'bg-success' : 'bg-dark'}`}></div>
                  
                  <div className="p-4">
                    <div className="row align-items-center">
                      <div className="col-md-4 mb-3 mb-md-0">
                        <span className="text-muted extra-small text-uppercase fw-bold">Mã định danh</span>
                        <h5 className="fw-black m-0 mb-1">#{order.id}</h5>
                        <div className="d-flex align-items-center small text-muted">
                          <Calendar size={12} className="me-1" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>

                      <div className="col-md-3 mb-3 mb-md-0">
                        <span className="text-muted extra-small text-uppercase fw-bold">Trạng thái</span>
                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                      </div>

                      <div className="col-md-5 text-md-end">
                        <span className="text-muted extra-small text-uppercase fw-bold">Tổng thanh toán</span>
                        <div className="fw-black text-orange fs-4 lh-1 mt-1">
                          {formatCurrency(order.total_money || order.total_amount)}
                        </div>
                      </div>
                    </div>

                    <hr className="text-muted opacity-25 my-4" />

                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div className="text-muted small d-flex align-items-center gap-2">
                        {order.cancel_reason && <span className="text-danger"><AlertTriangle size={14}/> Lý do: {order.cancel_reason}</span>}
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        <button 
                          onClick={() => router.push(`/contact`)}
                          className="btn btn-light btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 border"
                        >
                          <MessageCircle size={16} /> Liên hệ
                        </button>

                        {s === 0 && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                          >
                            <Trash2 size={16} /> Hủy đơn
                          </button>
                        )}

                        {(s === 2 || s === 3 || s === 4) && (
                          <button 
                            onClick={() => handleBuyAgain(order.id)}
                            className="btn btn-outline-warning btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                          >
                            <RotateCcw size={16} /> Mua lại
                          </button>
                        )}

                        <Link href={`/orders/${order.id}`} className="btn btn-dark btn-sm rounded-pill px-4 fw-bold text-decoration-none d-flex align-items-center">
                          Chi tiết <ChevronRight size={16} className="ms-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      <style jsx global>{`
        .ls-1 { letter-spacing: 1px; }
        .fw-black { font-weight: 900; }
        .text-orange { color: #CC6600; }
        .extra-small { font-size: 10px; letter-spacing: 0.5px; }
        
        .icon-box-header {
          width: 52px; height: 52px; background: #111;
          border-radius: 15px; display: flex; align-items: center; justify-content: center;
        }

        .search-container { width: 100%; max-width: 400px; }

        .spinner-luxury {
          width: 35px; height: 35px; border: 3px solid #eee;
          border-top: 3px solid #CC6600; border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .order-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #eee !important; }
        .order-card:hover { transform: translateY(-4px); box-shadow: 0 12px 25px rgba(0,0,0,0.08) !important; border-color: #CC6600 !important; }
        
        .decorative-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }

        .badge-luxury {
          padding: 6px 14px; border-radius: 50px; font-size: 11px;
          font-weight: 700; text-transform: uppercase; display: inline-flex; align-items: center;
        }
        .badge-pending { background: #fff8e1; color: #f57c00; border: 1px solid #ffe082; }
        .badge-shipping { background: #e3f2fd; color: #1976d2; border: 1px solid #bbdefb; }
        .badge-success { background: #e8f5e9; color: #388e3c; border: 1px solid #c8e6c9; }
        .badge-danger { background: #ffebee; color: #d32f2f; border: 1px solid #ffcdd2; }

        .hover-scale:hover { transform: scale(1.03); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
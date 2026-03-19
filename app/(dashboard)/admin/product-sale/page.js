"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import productSaleService from "../../../services/productSaleService";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Percent, 
  Calendar, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Tag
} from "lucide-react";

export default function ProductSalePage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await productSaleService.getAll();
      setSales(res.data.data || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("⚠️ Bạn có chắc chắn muốn xóa chương trình này? Hệ thống sẽ quay về giá gốc.")) return;
    try {
      await productSaleService.delete(id);
      loadSales();
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  // Logic lọc tìm kiếm theo tên sản phẩm hoặc tên chương trình
  const filteredSales = useMemo(() => {
    return sales.filter(item => 
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sales, searchTerm]);

  // Phân trang
  const currentItems = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  // Hàm tính toán trạng thái thời gian thực
  const getStatus = (begin, end) => {
    const now = new Date();
    const startDate = new Date(begin);
    const endDate = new Date(end);

    if (now < startDate) return { label: "Sắp diễn ra", color: "warning", icon: <Clock size={14}/> };
    if (now > endDate) return { label: "Đã kết thúc", color: "secondary", icon: <AlertCircle size={14}/> };
    return { label: "Đang diễn ra", color: "success", icon: <CheckCircle2 size={14}/> };
  };

  const getImageUrl = (path) => {
    if (!path) return "/no-image.jpg";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`;
  };

  return (
    <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100 font-sans">
      {/* HEADER & THỐNG KÊ NHANH */}
      <div className="row align-items-center mb-5 g-4">
        <div className="col-md-7">
          <div className="d-flex align-items-center gap-3">
             <div className="bg-danger p-3 rounded-4 shadow-sm">
                <TrendingDown size={32} className="text-white" />
             </div>
             <div>
                <h2 className="fw-black text-dark mb-0 text-uppercase ls-1">Quản lý Khuyến mãi</h2>
                <p className="text-muted mb-0">Thiết lập giá Sale và thời gian đếm ngược cho hệ thống</p>
             </div>
          </div>
        </div>
        <div className="col-md-5 text-md-end">
          <Link href="/admin/product-sale/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-lg d-inline-flex align-items-center gap-2 transition-all hover-scale">
            <Plus size={20} />
            <span className="small fw-bold text-uppercase">Tạo chiến dịch Sale</span>
          </Link>
        </div>
      </div>

      {/* THANH CÔNG CỤ TÌM KIẾM */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-3 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group border-0 bg-light rounded-pill px-3 py-1">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 shadow-none" 
                  placeholder="Tìm theo sản phẩm hoặc tên chương trình..." 
                  value={searchTerm}
                  onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                />
              </div>
            </div>
            <div className="col-md-7 text-md-end">
                <span className="badge bg-white text-dark border px-3 py-2 rounded-pill small fw-bold">
                    Tổng cộng: {filteredSales.length} chiến dịch
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH DỮ LIỆU */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr className="small text-uppercase fw-bold text-muted ls-1">
                <th className="py-4 ps-4">Sản phẩm & Chiến dịch</th>
                <th className="py-4">Giá khuyến mãi</th>
                <th className="py-4">Mức giảm</th>
                <th className="py-4">Thời gian hiệu lực</th>
                <th className="py-4">Trạng thái</th>
                <th className="py-4 text-end pe-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary opacity-25"></div></td></tr>
              ) : currentItems.length > 0 ? currentItems.map((item) => {
                const status = getStatus(item.date_begin, item.date_end);
                const originalPrice = item.product?.price_buy || 0;
                const salePrice = item.price_sale || 0;
                const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

                return (
                  <tr key={item.id} className="admin-tr transition-all border-bottom">
                    <td className="ps-4">
                      <div className="d-flex align-items-center py-2">
                        <div className="position-relative me-3">
                          <img
                            src={getImageUrl(item.product?.thumbnail)}
                            alt=""
                            className="rounded-3 shadow-sm border"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                          <div className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle p-1 shadow-sm" style={{transform: 'translate(30%, 30%)'}}>
                             <Tag size={10} />
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold text-dark mb-0 line-clamp-1">{item.product?.name || "N/A"}</div>
                          <div className="small text-primary fw-medium"><Percent size={10}/> {item.name || "Flash Sale"}</div>
                          <div className="x-small text-muted text-uppercase">ID SP: {item.product_id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-muted text-decoration-line-through x-small">{new Intl.NumberFormat('vi-VN').format(originalPrice)}₫</div>
                      <div className="fw-black text-danger fs-5">{new Intl.NumberFormat('vi-VN').format(salePrice)}₫</div>
                    </td>
                    <td>
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-bold">
                         -{discountPercent}%
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1 small fw-medium">
                        <span className="text-muted d-flex align-items-center gap-1"><Clock size={12}/> Từ: {new Date(item.date_begin).toLocaleString('vi-VN')}</span>
                        <span className="text-danger d-flex align-items-center gap-1 fw-bold"><AlertCircle size={12}/> Đến: {new Date(item.date_end).toLocaleString('vi-VN')}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 bg-${status.color}-subtle text-${status.color} border border-${status.color}-subtle fw-bold`}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                        <Link href={`/admin/product-sale/${item.id}/edit`} className="btn btn-white btn-sm px-3 py-2 border-end transition-all">
                          <Edit3 size={16} className="text-warning" />
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-white btn-sm px-3 py-2 border-0 transition-all">
                          <Trash2 size={16} className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted fw-bold">Không tìm thấy chiến dịch nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* PHÂN TRANG FOOTER */}
        {totalPages > 1 && (
            <div className="card-footer bg-white border-top-0 p-4">
                <div className="d-flex justify-content-center gap-2">
                    <button 
                        className="btn btn-light btn-sm rounded-circle px-3 py-2" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        <Search size={14} style={{transform: 'rotate(180deg)'}}/>
                    </button>
                    <span className="align-self-center small fw-bold mx-3">Trang {currentPage} / {totalPages}</span>
                    <button 
                        className="btn btn-light btn-sm rounded-circle px-3 py-2" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        <Search size={14} />
                    </button>
                </div>
            </div>
        )}
      </div>

      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.5px; }
        .x-small { font-size: 0.7rem; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-scale:hover { transform: translateY(-2px); }
        .btn-white { background: #fff; border: none; }
        .btn-white:hover { background: #f8f9fa; }
        .admin-tr:hover { background-color: #fcfcfc !important; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
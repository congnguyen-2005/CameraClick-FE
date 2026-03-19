"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import CategoryService from "../../../services/categoryService";
import "bootstrap/dist/css/bootstrap.min.css";
// Import các icon sang trọng
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Eye, 
  FolderOpen 
} from "lucide-react";

export default function CategoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng danh mục mỗi trang

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getAll();
      const data = res.data;
      const categories = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setItems(categories);
    } catch (err) {
      console.error("❌ Lỗi tải danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- LOGIC TÌM KIẾM & PHÂN TRANG ---
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!confirm("⚠️ Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await CategoryService.delete(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      alert("❌ Xóa thất bại!");
    }
  };

  return (
    <div className="container-fluid py-4 px-lg-5 min-vh-100 bg-light">
      {/* HEADER SECTION */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="fw-black display-6 text-dark mb-1 d-flex align-items-center gap-3">
            <FolderOpen size={36} className="text-primary" /> Quản Lý Danh Mục
          </h2>
          <p className="text-muted fw-light ps-5">Tổ chức và cấu trúc hệ thống sản phẩm cao cấp</p>
        </div>
        <div className="col-md-6 text-md-end">
          <Link href="/admin/category/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2 transition-all hover-scale">
            <Plus size={20} />
            <span className="small fw-bold">Thêm danh mục mới</span>
          </Link>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row">
            <div className="col-md-4">
              <div className="input-group border rounded-pill px-3 py-1 bg-light">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 shadow-none mt-1" 
                  placeholder="Tìm kiếm danh mục..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr>
                <th className="py-4 ps-4 text-muted fw-bold small text-uppercase" style={{ width: "10%" }}>ID</th>
                <th className="py-4 text-muted fw-bold small text-uppercase" style={{ width: "15%" }}>Hình ảnh</th>
                <th className="py-4 text-muted fw-bold small text-uppercase">Tên danh mục</th>
                <th className="py-4 text-end pe-4 text-muted fw-bold small text-uppercase">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    Chưa có dữ liệu nào phù hợp.
                  </td>
                </tr>
              ) : (
                currentItems.map((c) => (
                  <tr key={c.id} className="transition-all">
                    <td className="ps-4">
                      <span className="badge bg-light text-dark border fw-medium px-2 py-1">#{c.id}</span>
                    </td>
                    <td>
                      <div className="position-relative" style={{ width: "64px", height: "64px" }}>
                        <img
                          src={c.image || "/no-image.png"}
                          alt={c.name}
                          className="rounded-3 shadow-sm border w-100 h-100"
                          style={{ objectFit: "cover" }}
                          onError={(e) => { e.target.src = "/no-image.png"; }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark fs-5">{c.name}</div>
                      <div className="text-muted small fw-light">{c.slug}</div>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                        <Link href={`/admin/category/${c.id}/show`} className="btn btn-white btn-sm px-3 py-2 border-end" title="Xem">
                          <Eye size={16} className="text-info" />
                        </Link>
                        <Link href={`/admin/category/${c.id}/edit`} className="btn btn-white btn-sm px-3 py-2 border-end" title="Sửa">
                          <Edit3 size={16} className="text-warning" />
                        </Link>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-white btn-sm px-3 py-2 border-0" title="Xóa">
                          <Trash2 size={16} className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {!loading && filteredItems.length > 0 && (
          <div className="card-footer bg-white border-0 py-4 px-4 border-top d-flex align-items-center justify-content-between">
            <span className="text-muted small fw-medium">
              Đang hiển thị {currentItems.length} trên tổng số {filteredItems.length} danh mục
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0 gap-2">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link rounded-circle border-0 shadow-sm" onClick={() => setCurrentPage(p => p - 1)}>
                    <ChevronLeft size={18} />
                  </button>
                </li>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button 
                      className={`page-link rounded-circle border-0 shadow-sm ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white text-dark'}`} 
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link rounded-circle border-0 shadow-sm" onClick={() => setCurrentPage(p => p + 1)}>
                    <ChevronRight size={18} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-scale:hover { transform: scale(1.02); }
        .page-link {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .btn-white { background: #fff; }
        .btn-white:hover { background: #f8f9fa; }
        .table-hover tbody tr:hover { background-color: #fbfbfb; }
      `}</style>
    </div>
  );
}
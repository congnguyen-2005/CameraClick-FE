"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import attributeService from "../../../services/attributeService";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Plus, 
  Settings2, 
  Edit3, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Layers
} from "lucide-react";

export default function AttributePage() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const load = async () => {
    try {
      setLoading(true);
      const res = await attributeService.getAll();
      const list = res?.data?.data ?? [];
      setAttributes(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Logic Tìm kiếm & Phân trang
  const filteredItems = useMemo(() => {
    return attributes.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attributes, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Xóa thuộc tính này có thể ảnh hưởng đến các sản phẩm liên quan. Bạn chắc chắn chứ?")) return;
    try {
      await attributeService.delete(id);
      load();
    } catch (err) {
      alert("❌ Lỗi khi xóa thuộc tính");
    }
  };

  return (
    <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100">
      {/* HEADER SECTION */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="fw-black display-6 text-dark mb-1 d-flex align-items-center gap-3">
            <Settings2 size={36} className="text-primary" /> Thuộc Tính Sản Phẩm
          </h2>
          <p className="text-muted fw-light ps-5">Quản lý các biến thể như Màu sắc, Kích thước, Chất liệu</p>
        </div>
        <div className="col-md-6 text-md-end">
          <Link href="/admin/attribute/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm border-0 d-inline-flex align-items-center gap-2 transition-all hover-scale">
            <Plus size={20} />
            <span className="small fw-bold">Thêm thuộc tính mới</span>
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="col-md-4">
            <div className="input-group border rounded-pill px-3 py-1 bg-light">
              <span className="input-group-text bg-transparent border-0 text-muted">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                className="form-control bg-transparent border-0 shadow-none mt-1" 
                placeholder="Tìm tên thuộc tính..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr>
                <th className="py-4 ps-4 text-muted fw-bold small text-uppercase" style={{ width: "15%" }}>Mã ID</th>
                <th className="py-4 text-muted fw-bold small text-uppercase">Tên Thuộc Tính</th>
                <th className="py-4 text-end pe-4 text-muted fw-bold small text-uppercase" style={{ width: "20%" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <div className="spinner-border text-primary opacity-50" role="status"></div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <Layers size={48} className="text-muted mb-3 opacity-20" />
                    <p className="text-muted fw-light">Chưa có dữ liệu thuộc tính nào</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="transition-all">
                    <td className="ps-4">
                      <span className="badge bg-light text-dark border fw-medium px-2 py-1">#{item.id}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark fs-6">{item.name}</div>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                        <Link
                          href={`/admin/attribute/${item.id}/edit/`}
                          className="btn btn-white btn-sm px-3 py-2 border-end"
                          title="Chỉnh sửa"
                        >
                          <Edit3 size={16} className="text-warning" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-white btn-sm px-3 py-2 border-0"
                          title="Xóa"
                        >
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
              Hiển thị {currentItems.length} trên tổng số {filteredItems.length} thuộc tính
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
        .hover-scale:hover { transform: scale(1.01); }
        .page-link {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: 0.3s;
        }
        .btn-white { background: #fff; border-radius: 0; }
        .btn-white:hover { background: #f8f9fa; }
        .table-hover tbody tr:hover { background-color: #fbfbfb; }
      `}</style>
    </div>
  );
}
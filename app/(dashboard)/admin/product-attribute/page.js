"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import productAttributeService from "../../../services/productAttributeService";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Tags,
  Box
} from "lucide-react";

export default function ProductAttributePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const load = async () => {
    try {
      setLoading(true);
      const res = await productAttributeService.getAll();
      setItems(res?.data?.data ?? []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Logic Tìm kiếm & Phân trang
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Bạn có chắc muốn gỡ thuộc tính này khỏi sản phẩm?")) return;
    try {
      await productAttributeService.delete(id);
      load();
    } catch (error) {
      alert("❌ Xóa thất bại!");
    }
  };

  return (
    <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100">
      {/* HEADER SECTION */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="fw-black display-6 text-dark mb-1 d-flex align-items-center gap-3">
            <Tags size={36} className="text-primary" /> Thuộc Tính Sản Phẩm
          </h2>
          <p className="text-muted fw-light ps-5">Gán các giá trị biến thể cụ thể cho từng sản phẩm trong kho</p>
        </div>
        <div className="col-md-6 text-md-end">
          <Link href="/admin/product-attribute/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm border-0 d-inline-flex align-items-center gap-2 transition-all hover-scale">
            <Plus size={20} />
            <span className="small fw-bold">Thêm giá trị mới</span>
          </Link>
        </div>
      </div>

      {/* FILTER BAR */}
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
                placeholder="Tìm sản phẩm hoặc giá trị..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                <th className="py-4 ps-4 text-muted fw-bold small text-uppercase" style={{ width: "80px" }}>ID</th>
                <th className="py-4 text-muted fw-bold small text-uppercase">Sản Phẩm</th>
                <th className="py-4 text-muted fw-bold small text-uppercase">Loại Thuộc Tính</th>
                <th className="py-4 text-muted fw-bold small text-uppercase">Giá Trị</th>
                <th className="py-4 text-end pe-4 text-muted fw-bold small text-uppercase">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="placeholder-glow">
                    <td colSpan="5" className="py-4 text-center">
                      <div className="placeholder col-10 rounded-pill py-3 bg-light"></div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted fst-italic">
                    <Box size={48} className="mb-3 opacity-25" />
                    <p>Không tìm thấy dữ liệu phù hợp</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="transition-all">
                    <td className="ps-4">
                      <span className="badge bg-light text-dark border fw-medium px-2 py-1">#{item.id}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{item.product?.name || `ID: ${item.product_id}`}</div>
                    </td>
                    <td>
                      <span className="text-muted fw-medium text-uppercase small">
                        {item.attribute?.name || `ID: ${item.attribute_id}`}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">
                        {item.value}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                        <Link
                          href={`/admin/product-attribute/edit/${item.id}`}
                          className="btn btn-white btn-sm px-3 py-2 border-end"
                          title="Sửa"
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

        {/* PAGINATION */}
        {!loading && filteredItems.length > 0 && (
          <div className="card-footer bg-white border-0 py-4 px-4 border-top d-flex align-items-center justify-content-between">
            <span className="text-muted small fw-medium">
              Hiển thị {currentItems.length} trên tổng số {filteredItems.length} mục
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
        .btn-white { background: #fff; border-radius: 0; }
        .btn-white:hover { background: #f8f9fa; }
        .page-link {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
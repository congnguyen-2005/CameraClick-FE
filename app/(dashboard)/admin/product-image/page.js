"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import productImageService from "../../../services/productImageService";
import { Image as ImageIcon, Trash2, Edit3, Plus, Search, LayoutGrid, List } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductImagePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await productImageService.getAll();
      const data = res?.data?.data ?? res?.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi load ảnh:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Bạn có chắc muốn xóa ảnh này vĩnh viễn không?")) return;
    try {
      await productImageService.delete(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      alert("❌ Xóa thất bại!");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/assets/images/no-image.jpg";
    if (path.startsWith("http")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";
    if (path.startsWith("storage/")) return `${baseUrl}/${path}`;
    return `${baseUrl}/storage/${path}`;
  };

  // Logic lọc tìm kiếm
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_id?.toString().includes(searchTerm)
    );
  }, [items, searchTerm]);

  return (
    <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100">
      {/* HEADER SECTION */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6 text-center text-md-start">
          <h2 className="fw-black display-6 text-dark mb-1">Thư Viện Ảnh</h2>
          <p className="text-muted fw-light">Quản lý kho tài nguyên hình ảnh đa phương tiện</p>
        </div>
        <div className="col-md-6 text-md-end text-center mt-3 mt-md-0">
          <Link href="/admin/product-image/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm border-0 d-inline-flex align-items-center gap-2 transition-all hover-scale">
            <Plus size={20} />
            <span className="small fw-bold">Tải lên ảnh mới</span>
          </Link>
        </div>
      </div>

      {/* FILTER & TOOLS */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row align-items-center g-3">
            <div className="col-md-4">
              <div className="input-group border rounded-pill px-3 py-1 bg-light">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 shadow-none mt-1" 
                  placeholder="Tìm theo tiêu đề hoặc ID sản phẩm..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <div className="card border-0 rounded-4 shadow-sm placeholder-glow h-100">
                <div className="placeholder rounded-4 w-100" style={{ height: "200px" }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm mt-4">
          <ImageIcon size={64} className="text-muted mb-3 opacity-20" />
          <h5 className="text-muted fw-light">Chưa có hình ảnh nào trong bộ sưu tập</h5>
        </div>
      ) : (
        <div className="row g-4 animate-fade-in">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden gallery-card transition-all">
                {/* Image Container */}
                <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-100 h-100 object-fit-cover img-main transition-all"
                    onError={(e) => { e.target.src = "/assets/images/no-image.jpg"; }}
                  />
                  <div className="card-img-overlay d-flex align-items-start justify-content-between p-2">
                    <span className="badge bg-dark bg-opacity-75 rounded-pill small">#{item.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="card-body p-3">
                  <div className="mb-2">
                    <span className="badge bg-primary-subtle text-primary border-0 rounded-pill small mb-2 uppercase fw-bold">
                      📦 SP: {item.product_id}
                    </span>
                    <h6 className="text-dark fw-bold text-truncate mb-1">{item.title || "Không có tiêu đề"}</h6>
                    <p className="text-muted small mb-0 text-truncate">Alt: {item.alt || "Chưa thiết lập"}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="d-flex gap-2 mt-3 pt-3 border-top">
                    <Link
                      href={`/admin/product-image/${item.id}/edit/`}
                      className="btn btn-light btn-sm flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1 transition-all"
                    >
                      <Edit3 size={14} /> <span className="small">Sửa</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-outline-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .gallery-card:hover { transform: translateY(-8px); }
        .gallery-card:hover .img-main { transform: scale(1.1); }
        .transition-all { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .hover-scale:hover { transform: scale(1.05); }
        .uppercase { letter-spacing: 0.05em; font-size: 0.7rem; }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .img-main {
            transform-origin: center;
        }
      `}</style>
    </div>
  );
}
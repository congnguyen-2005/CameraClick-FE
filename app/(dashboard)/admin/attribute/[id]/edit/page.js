"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import attributeService from "../../../../../services/attributeService";
import { Edit3, ArrowLeft, RefreshCw, Save, Hash } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditAttribute() {
  const { id } = useParams();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await attributeService.get(id);
        setName(res?.data?.data?.name ?? "");
      } catch (err) {
        console.error("Lỗi tải thuộc tính:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await attributeService.update(id, { name });
      router.push("/admin/attribute");
    } catch (err) {
      alert("❌ Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <RefreshCw className="text-primary animate-spin mb-3" size={40} />
      <span className="text-muted fw-light">Đang đồng bộ dữ liệu...</span>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* HEADER BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
          <button 
            onClick={() => router.push("/admin/attribute")} 
            className="btn btn-white shadow-sm rounded-pill px-3 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          
          <div className="d-flex align-items-center gap-2">
             <Hash size={16} className="text-muted" />
             <span className="text-muted small fw-bold">ID: {id}</span>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
              <div className="card-body p-4 p-lg-5">
                
                {/* ICON & TITLE */}
                <div className="text-center mb-5">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <Edit3 size={40} className="text-success" />
                  </div>
                  <h3 className="fw-bold text-dark">Hiệu Chỉnh</h3>
                  <p className="text-muted small">Cập nhật tên gọi cho thuộc tính hệ thống</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase ls-1 ms-1">Tên Thuộc Tính Hiện Tại</label>
                    <div className="input-group border rounded-4 px-3 py-1 bg-light transition-all focus-within-shadow">
                      <input
                        type="text"
                        className="form-control bg-transparent border-0 shadow-none py-2 fw-bold text-dark fs-5"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="VD: Màu sắc, Kích thước..."
                      />
                    </div>
                    <small className="text-muted mt-2 d-block ms-1 opacity-75">
                      *Mọi thay đổi sẽ áp dụng ngay lập tức cho các sản phẩm đang dùng thuộc tính này.
                    </small>
                  </div>

                  <div className="d-flex gap-3 pt-3">
                    <button 
                      type="submit" 
                      className="btn btn-success btn-lg flex-grow-1 rounded-pill py-3 shadow-lg d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <>
                          <Save size={20} /> <span className="fw-bold small">Cập nhật ngay</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-light text-dark border rounded-pill px-4 transition-all"
                      onClick={() => router.push("/admin/attribute")}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ls-1 { letter-spacing: 0.05em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; }
        .focus-within-shadow:focus-within {
          background: #fff !important;
          border-color: #198754 !important;
          box-shadow: 0 0 0 4px rgba(25, 135, 84, 0.1);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
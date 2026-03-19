"use client";

import React, { useState } from "react";
import attributeService from "../../../../services/attributeService";
import { useRouter } from "next/navigation";
import { Settings2, ArrowLeft, Save, PlusCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateAttribute() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await attributeService.create({ name });
      router.push("/admin/attribute");
    } catch (error) {
      console.error("Lỗi khi thêm thuộc tính:", error);
      alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* HEADER BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
          <button 
            onClick={() => router.push("/admin/attribute")} 
            className="btn btn-white shadow-sm rounded-pill px-3 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Danh sách</span>
          </button>
          <h4 className="fw-black mb-0 text-dark text-uppercase ls-1">Khởi tạo thuộc tính</h4>
          <div style={{ width: "110px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
              <div className="card-body p-4 p-lg-5">
                {/* ICON & TITLE */}
                <div className="text-center mb-5">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <PlusCircle size={40} className="text-primary" />
                  </div>
                  <h3 className="fw-bold text-dark">Thêm Mới</h3>
                  <p className="text-muted small">Xác định các thông số biến thể cho sản phẩm của bạn</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase ls-1 ms-1">Tên Thuộc Tính</label>
                    <div className="input-group border rounded-4 px-3 py-1 bg-light transition-all focus-within-shadow">
                      <span className="input-group-text bg-transparent border-0 pe-2">
                        <Settings2 size={20} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control bg-transparent border-0 shadow-none py-2 fw-medium"
                        placeholder="VD: Màu sắc, Kích thước, Dung lượng..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <small className="text-muted mt-2 d-block ms-1 opacity-75">
                      *Tên này sẽ hiển thị trong phần quản lý thuộc tính của sản phẩm.
                    </small>
                  </div>

                  <div className="d-flex gap-3 pt-3">
                    <button 
                      type="submit" 
                      className="btn btn-dark btn-lg flex-grow-1 rounded-pill py-3 shadow-lg d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <>
                          <Save size={20} /> <span className="fw-bold small">Lưu thuộc tính</span>
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
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.05em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; }
        .focus-within-shadow:focus-within {
          background: #fff !important;
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
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
"use client";

import React, { useEffect, useState } from "react";
import productAttributeService from "../../../../services/productAttributeService";
import productService from "../../../../services/productService";
import attributeService from "../../../../services/attributeService";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Box, Settings2, CheckCircle, Info } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateProductAttribute() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [product_id, setProductId] = useState("");
  const [attribute_id, setAttributeId] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Tải danh sách sản phẩm và thuộc tính gốc
    productService.getAll().then((res) => {
      setProducts(res?.data?.data ?? []);
    });

    attributeService.getAll().then((res) => {
      setAttributes(res?.data?.data ?? []);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productAttributeService.create({
        product_id,
        attribute_id,
        value,
      });
      router.push("/admin/product-attribute");
    } catch (error) {
      alert("❌ Lỗi khi gán thuộc tính. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* HEADER BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <button 
            onClick={() => router.push("/admin/product-attribute")} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          <h4 className="fw-black mb-0 text-dark text-uppercase ls-1">Thiết lập biến thể</h4>
          <div style={{ width: "120px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
              {/* TOP HEADER */}
              <div className="bg-dark p-4 text-white d-flex align-items-center gap-3">
                <div className="bg-primary p-2 rounded-3">
                  <Settings2 size={24} />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Gán thuộc tính cho sản phẩm</h5>
                  <p className="small mb-0 opacity-50 fst-italic">Tạo các đặc tính cụ thể cho từng mặt hàng trong kho</p>
                </div>
              </div>

              <div className="card-body p-4 p-lg-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Chọn Sản Phẩm */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <Box size={14} className="me-1 mb-1" /> Sản phẩm mục tiêu
                      </label>
                      <select
                        className="form-select custom-input"
                        value={product_id}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Chọn Thuộc Tính Gốc */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <Settings2 size={14} className="me-1 mb-1" /> Loại thuộc tính
                      </label>
                      <select
                        className="form-select custom-input"
                        value={attribute_id}
                        onChange={(e) => setAttributeId(e.target.value)}
                        required
                      >
                        <option value="">-- Chọn thuộc tính --</option>
                        {attributes.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Nhập Giá Trị */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <CheckCircle size={14} className="me-1 mb-1" /> Giá trị cụ thể
                      </label>
                      <input
                        type="text"
                        className="form-control custom-input py-3"
                        placeholder="VD: Đỏ Ruby, 512GB, Kim loại nhám..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-5 pt-4 border-top d-flex gap-3 justify-content-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg d-flex align-items-center gap-2 transition-all hover-scale"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <>
                          <Save size={20} /> <span className="fw-bold small">Lưu thông tin</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Hướng dẫn nhỏ */}
              <div className="bg-light p-3 border-top text-center">
                <p className="small text-muted mb-0 d-flex align-items-center justify-content-center gap-2">
                  <Info size={14} className="text-info" />
                  Bạn có thể gán nhiều giá trị thuộc tính khác nhau cho cùng một sản phẩm.
                </p>
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
        .custom-input {
          border: 1px solid #f0f0f0;
          background-color: #fafafa;
          border-radius: 12px;
          padding: 0.8rem 1rem;
          transition: all 0.3s ease;
        }
        .custom-input:focus {
          background-color: #fff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
          outline: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg-dark { background-color: #1a1a1a !important; }
      `}</style>
    </div>
  );
}
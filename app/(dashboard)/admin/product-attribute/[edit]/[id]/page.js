"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import productAttributeService from "../../../../../services/productAttributeService";
import productService from "../../../../../services/productService";
import attributeService from "../../../../../services/attributeService";
import { ArrowLeft, Save, Edit3, Box, Settings2, CheckCircle, RefreshCw } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditProductAttribute() {
  const { id } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [product_id, setProductId] = useState("");
  const [attribute_id, setAttributeId] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [itemRes, productsRes, attrsRes] = await Promise.all([
          productAttributeService.get(id),
          productService.getAll(),
          attributeService.getAll()
        ]);

        const item = itemRes?.data?.data;
        if (item) {
          setProductId(item.product_id);
          setAttributeId(item.attribute_id);
          setValue(item.value);
        }

        setProducts(productsRes?.data?.data ?? []);
        setAttributes(attrsRes?.data?.data ?? []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await productAttributeService.update(id, {
        product_id,
        attribute_id,
        value,
      });
      router.push("/admin/product-attribute");
    } catch (error) {
      alert("❌ Cập nhật thất bại. Vui lòng thử lại!");
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
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <button 
            onClick={() => router.push("/admin/product-attribute")} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          <div className="text-center">
             <h4 className="fw-black mb-0 text-dark text-uppercase ls-1">Hiệu chỉnh biến thể</h4>
             <small className="text-muted fw-bold">Mã định danh: #{id}</small>
          </div>
          <div style={{ width: "120px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
              {/* TOP ACCENT BAR */}
              <div className="bg-warning p-4 text-dark d-flex align-items-center gap-3">
                <div className="bg-white p-2 rounded-3 shadow-sm">
                  <Edit3 size={24} className="text-warning" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Cập nhật thông tin thuộc tính</h5>
                  <p className="small mb-0 opacity-75">Thay đổi giá trị hoặc loại biến thể cho sản phẩm</p>
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
                        <CheckCircle size={14} className="me-1 mb-1" /> Giá trị mới
                      </label>
                      <input
                        type="text"
                        className="form-control custom-input py-3 fw-bold"
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
                      className="btn btn-warning btn-lg rounded-pill px-5 shadow-lg d-flex align-items-center gap-2 transition-all hover-scale"
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <>
                          <Save size={20} /> <span className="fw-bold small">Cập nhật thay đổi</span>
                        </>
                      )}
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
        .custom-input {
          border: 1px solid #f0f0f0;
          background-color: #fafafa;
          border-radius: 12px;
          padding: 0.8rem 1rem;
          transition: all 0.3s ease;
        }
        .custom-input:focus {
          background-color: #fff;
          border-color: #ffc107;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1);
          outline: none;
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
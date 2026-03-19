"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import productSaleService from "../../../../../services/productSaleService";
import productService from "../../../../../services/productService";
import { useForm } from "react-hook-form";
import { Save, ArrowLeft, Tag, Calendar, DollarSign, Percent, Zap, RefreshCw } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditProductSale() {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const router = useRouter();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const watchPriceSale = watch("price_sale");
  const watchProductId = watch("product_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, saleRes] = await Promise.all([
          productService.getAll(),
          productSaleService.get(id),
        ]);

        const allProducts = prodRes?.data?.data ?? [];
        const saleData = saleRes.data.data;
        setProducts(allProducts);

        const currentProd = allProducts.find((p) => p.id === parseInt(saleData.product_id));
        setSelectedProduct(currentProd);

        const formatDateTime = (dateStr) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toISOString().slice(0, 16);
        };

        reset({
          ...saleData,
          date_begin: formatDateTime(saleData.date_begin),
          date_end: formatDateTime(saleData.date_end),
        });
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  useEffect(() => {
    const prod = products.find((p) => p.id === parseInt(watchProductId));
    setSelectedProduct(prod);
  }, [watchProductId, products]);

  const getDiscountPercent = () => {
    if (!selectedProduct || !watchPriceSale) return 0;
    const originalPrice = selectedProduct.price_buy;
    const percent = ((originalPrice - watchPriceSale) / originalPrice) * 100;
    return Math.round(percent);
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await productSaleService.update(id, data);
      router.push("/admin/product-sale");
    } catch (error) {
      alert("❌ Lỗi: " + (error.response?.data?.message || "Cập nhật thất bại"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <RefreshCw className="text-primary animate-spin mb-3" size={40} />
      <span className="text-muted fw-light">Đang đồng bộ dữ liệu chiến dịch...</span>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 px-lg-5">
      <div className="container" style={{ maxWidth: "900px" }}>
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-black text-dark mb-1">Cập Nhật Ưu Đãi</h2>
            <p className="text-muted fw-light">Điều chỉnh thông số chiến dịch giảm giá #{id}</p>
          </div>
          <button onClick={() => router.back()} className="btn btn-white rounded-pill px-4 shadow-sm border-0 d-flex align-items-center gap-2 transition-all">
            <ArrowLeft size={18} /> <span className="small fw-bold">Hủy bỏ</span>
          </button>
        </div>

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
          {/* TOP BAR ACCENT */}
          <div className="bg-dark p-4 text-white d-flex align-items-center gap-3">
            <div className="bg-warning p-2 rounded-3 text-dark shadow">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold ls-1">Cấu Hình Chiến Dịch</h5>
              <p className="small mb-0 opacity-50">Đảm bảo mức giá sau giảm phù hợp với mục tiêu doanh thu</p>
            </div>
          </div>

          <div className="card-body p-4 p-lg-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-4">
                {/* Tên chiến dịch */}
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted uppercase ls-1">Tên Chiến Dịch Marketing</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0"><Tag size={18} className="text-muted" /></span>
                    <input {...register("name")} className="form-control bg-transparent border-0 shadow-none fw-bold" required />
                  </div>
                </div>

                {/* Chọn sản phẩm */}
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted uppercase ls-1">Sản phẩm áp dụng</label>
                  <select {...register("product_id")} className="form-select custom-input py-3 shadow-none border-0 bg-light rounded-4 px-4 fw-medium" required>
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (Gốc: {p.price_buy.toLocaleString()}₫)</option>
                    ))}
                  </select>
                </div>

                {/* Phân vùng giá */}
                <div className="col-md-6">
                  <div className="p-4 rounded-4 bg-light border-0 h-100">
                    <label className="form-label small fw-bold text-muted uppercase ls-1">Cấu trúc giá gốc</label>
                    <div className="display-6 fw-black text-dark my-2">
                      {selectedProduct ? selectedProduct.price_buy.toLocaleString() : 0} <small className="fs-5 fw-normal text-muted">₫</small>
                    </div>
                    <div className="badge bg-white text-dark shadow-sm border rounded-pill px-3 py-2 mt-2 fw-medium">
                      Mức giảm: <span className="text-danger fw-black fs-6">-{getDiscountPercent()}%</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-4 rounded-4 bg-primary bg-opacity-10 border-0 h-100">
                    <label className="form-label small fw-bold text-primary uppercase ls-1">Giá khuyến mãi mới</label>
                    <div className="input-group mt-2 border-bottom border-primary border-2 pb-2">
                      <span className="bg-transparent border-0 text-primary pe-2"><DollarSign size={24} /></span>
                      <input 
                        {...register("price_sale")} 
                        type="number" 
                        className="form-control bg-transparent border-0 shadow-none fw-black text-primary display-6 p-0 h-auto" 
                        required 
                      />
                    </div>
                    <p className="small text-primary opacity-75 mt-3 mb-0 italic">* Giá này sẽ hiển thị thay thế giá gốc trên website.</p>
                  </div>
                </div>

                {/* Thời gian */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted uppercase ls-1">Ngày kích hoạt</label>
                  <div className="input-group border rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0"><Calendar size={18} className="text-muted" /></span>
                    <input {...register("date_begin")} type="datetime-local" className="form-control bg-transparent border-0 shadow-none" required />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted uppercase ls-1 text-danger">Ngày kết thúc</label>
                  <div className="input-group border border-danger border-opacity-25 rounded-4 px-3 py-1 bg-light">
                    <span className="input-group-text bg-transparent border-0"><Calendar size={18} className="text-danger" /></span>
                    <input {...register("date_end")} type="datetime-local" className="form-control bg-transparent border-0 shadow-none text-danger" required />
                  </div>
                </div>

                {/* NÚT BẤM */}
                <div className="col-12 mt-5 pt-4 border-top">
                  <div className="d-flex gap-3">
                    <button 
                      className="btn btn-primary btn-lg flex-grow-1 rounded-pill py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2" 
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                      Cập Nhật Hệ Thống
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.1em; }
        .uppercase { text-transform: uppercase; font-size: 0.7rem; }
        .btn-white { background: #fff; }
        .transition-all { transition: all 0.3s ease; }
        .custom-input:focus {
          background-color: #fff !important;
          border: 1px solid #0d6efd !important;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1) !important;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
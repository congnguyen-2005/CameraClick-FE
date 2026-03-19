"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import productImageService from "../../../../../services/productImageService";
import productService from "../../../../../services/productService";
import { ArrowLeft, Save, Image as ImageIcon, Box, Type, Globe, RefreshCw } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditProductImage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [products, setProducts] = useState([]);
  const [product_id, setProductId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, imageRes] = await Promise.all([
          productService.getAll(),
          productImageService.get(id)
        ]);

        const pData = productRes?.data?.data ?? productRes?.data ?? [];
        setProducts(Array.isArray(pData) ? pData : []);

        const img = imageRes?.data?.data ?? imageRes?.data;
        if (img) {
          setProductId(img.product_id);
          setAlt(img.alt || "");
          setTitle(img.title || "");
          // Lưu lại đường dẫn ảnh cũ từ server
          const imgUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/${img.image}`;
          setOldImage(imgUrl);
          setPreview(imgUrl);
        }
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT"); // Cần thiết cho Laravel cập nhật file qua POST
      formData.append("product_id", product_id);
      formData.append("alt", alt || "");
      formData.append("title", title || "");
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await productImageService.update(id, formData);
      alert("✅ Cập nhật tài nguyên thành công!");
      router.push("/admin/product-image");
    } catch (err) {
      alert("❌ Cập nhật thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <RefreshCw className="text-primary animate-spin mb-3" size={40} />
      <span className="text-muted fw-light">Đang đồng bộ dữ liệu ảnh...</span>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <button 
            onClick={() => router.back()} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          <div className="text-center">
             <h4 className="fw-black mb-0 text-dark text-uppercase ls-1">Hiệu chỉnh tài nguyên</h4>
             <small className="text-muted fw-bold">Mã hình ảnh: #{id}</small>
          </div>
          <div style={{ width: "120px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
              <form onSubmit={handleSubmit}>
                <div className="row g-0">
                  {/* LEFT: IMAGE PREVIEW AREA */}
                  <div className="col-md-5 bg-dark p-4 d-flex flex-column justify-content-center align-items-center">
                    <h6 className="text-white-50 small uppercase fw-bold mb-4 text-center ls-1">Xem trước hiển thị</h6>
                    <div className="preview-box rounded-4 overflow-hidden shadow-lg bg-black d-flex align-items-center justify-content-center" style={{ width: "100%", height: "350px" }}>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-100 h-100 object-fit-contain"
                        onError={(e) => e.target.src = "/assets/images/no-image.jpg"}
                      />
                    </div>
                    {imageFile && (
                      <span className="badge bg-warning text-dark mt-3 rounded-pill px-3 py-2 animate-bounce">Ảnh mới đã chọn</span>
                    )}
                  </div>

                  {/* RIGHT: FORM FIELDS */}
                  <div className="col-md-7 p-4 p-lg-5">
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <Box size={14} className="me-1 mb-1" /> Sản phẩm liên kết
                      </label>
                      <select
                        className="form-select custom-input py-3 fw-bold"
                        value={product_id}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <ImageIcon size={14} className="me-1 mb-1" /> Thay đổi tập tin
                      </label>
                      <input
                        type="file"
                        className="form-control custom-input py-2"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <small className="text-muted mt-2 d-block small italic">Để trống nếu không muốn thay đổi hình ảnh hiện tại.</small>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                          <Globe size={14} className="me-1 mb-1" /> Alt Text
                        </label>
                        <input
                          type="text"
                          className="form-control custom-input"
                          value={alt}
                          onChange={(e) => setAlt(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                          <Type size={14} className="me-1 mb-1" /> Title Text
                        </label>
                        <input
                          type="text"
                          className="form-control custom-input"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-top">
                      <button 
                        type="submit" 
                        className="btn btn-dark btn-lg w-100 rounded-pill py-3 shadow-lg d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <RefreshCw className="animate-spin" size={20} />
                        ) : (
                          <>
                            <Save size={20} /> <span className="fw-bold small">Cập nhật tài nguyên</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; }
        .custom-input {
          border: 1px solid #f0f0f0;
          background-color: #fafafa;
          border-radius: 12px;
          padding: 0.8rem 1rem;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .custom-input:focus {
          background-color: #fff;
          border-color: #ffc107;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1);
        }
        .preview-box {
           background: radial-gradient(circle, #222 0%, #000 100%);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-bounce { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .bg-dark { background-color: #1a1a1a !important; }
      `}</style>
    </div>
  );
}
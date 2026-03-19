"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import productImageService from "../../../../services/productImageService";
import productService from "../../../../services/productService";
import { UploadCloud, ArrowLeft, Save, Box, Type, Globe, X, Images } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateProductImage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [product_id, setProductId] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // Chuyển thành mảng
  const [previews, setPreviews] = useState([]);    // Chuyển thành mảng preview
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    productService.getAll().then((res) => {
      const data = res?.data?.data ?? res?.data ?? [];
      setProducts(Array.isArray(data) ? data : []);
    });
  }, []);

  // Xử lý chọn nhiều ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Chuyển FileList thành Array
    if (files.length > 0) {
      // Cập nhật mảng file
      setImageFiles((prev) => [...prev, ...files]);

      // Cập nhật mảng preview
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Xóa một ảnh cụ thể khỏi danh sách chờ
  const removeImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    // Giải phóng bộ nhớ URL
    URL.revokeObjectURL(previews[index]);

    setImageFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0 || !product_id) {
      alert("Vui lòng chọn sản phẩm và ít nhất một hình ảnh!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("product_id", product_id);
      formData.append("alt", alt || "");
      formData.append("title", title || "");

      // QUAN TRỌNG: Gửi mảng file qua FormData cho Laravel
      imageFiles.forEach((file) => {
        formData.append("images[]", file); // Sử dụng images[] để Backend nhận dạng mảng
      });

      await productImageService.create(formData);
      alert("✅ Đã tải lên " + imageFiles.length + " hình ảnh thành công!");
      router.push("/admin/product-image");
    } catch (err) {
      alert("❌ Lỗi: " + (err.response?.data?.message ?? "Không thể lưu ảnh"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 px-lg-5">
      <div className="container">
        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <button 
            onClick={() => router.back()} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale bg-white"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Trở về thư viện</span>
          </button>
          <h4 className="fw-black mb-0 text-dark text-uppercase ls-1">Quản lý Tài nguyên Ảnh</h4>
          <div style={{ width: "120px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
              <div className="bg-dark p-4 text-white d-flex align-items-center gap-3">
                <div className="bg-primary p-2 rounded-3 shadow-sm">
                  <Images size={24} />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Tải lên bộ sưu tập ảnh</h5>
                  <p className="small mb-0 opacity-50">Bạn có thể chọn nhiều ảnh cùng lúc (Tối đa 20MB/file)</p>
                </div>
              </div>

              <div className="card-body p-4 p-lg-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* CHỌN SẢN PHẨM */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <Box size={14} className="me-1 mb-1" /> Sản phẩm đích
                      </label>
                      <select
                        className="form-select custom-input py-3 shadow-none"
                        value={product_id}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                      >
                        <option value="">-- Chọn sản phẩm mục tiêu --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} (ID: #{p.id})</option>
                        ))}
                      </select>
                    </div>

                    {/* VÙNG CHỌN NHIỀU ẢNH */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <UploadCloud size={14} className="me-1 mb-1" /> Danh sách hình ảnh
                      </label>
                      
                      <div 
                        className="upload-dropzone rounded-4 d-flex flex-column align-items-center justify-content-center py-4 mb-3 transition-all"
                        onClick={() => document.getElementById('fileInput').click()}
                      >
                        <UploadCloud size={40} className="text-muted mb-2 opacity-50" />
                        <p className="text-muted small fw-medium mb-0">Thêm ảnh vào bộ sưu tập</p>
                      </div>
                      <input 
                        id="fileInput" 
                        type="file" 
                        multiple // QUAN TRỌNG: Cho phép chọn nhiều
                        accept="image/*" 
                        className="d-none" 
                        onChange={handleImageChange} 
                      />

                      {/* GRID XEM TRƯỚC ẢNH */}
                      {previews.length > 0 && (
                        <div className="row g-3 p-3 bg-light rounded-4 border border-dashed">
                          {previews.map((src, index) => (
                            <div key={index} className="col-6 col-md-3 col-lg-2">
                              <div className="position-relative group shadow-sm rounded-3 overflow-hidden bg-white aspect-square d-flex align-items-center justify-content-center">
                                <img
                                  src={src}
                                  alt="preview"
                                  className="w-100 h-100 object-fit-cover"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => removeImage(index)}
                                  className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1 shadow"
                                  style={{ padding: '2px' }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SEO INFO */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <Globe size={14} className="me-1 mb-1" /> Thuộc tính Alt (Chung)
                      </label>
                      <input
                        type="text"
                        placeholder="Mô tả nội dung ảnh..."
                        className="form-control custom-input py-3"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                        <Type size={14} className="me-1 mb-1" /> Tiêu đề bộ ảnh
                      </label>
                      <input
                        type="text"
                        placeholder="Tiêu đề hiển thị..."
                        className="form-control custom-input py-3"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-top d-flex gap-3 justify-content-end">
                    <button 
                      type="submit" 
                      className="btn btn-dark btn-lg rounded-pill px-5 shadow-lg d-flex align-items-center gap-2 transition-all hover-scale"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <>
                          <Save size={20} /> <span className="fw-bold small">Tải lên tất cả ({imageFiles.length})</span>
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
        .ls-1 { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .custom-input {
          border: 1px solid #eee;
          background-color: #fcfcfc;
          border-radius: 12px;
        }
        .upload-dropzone {
          border: 2px dashed #ddd;
          cursor: pointer;
          background-color: #fdfdfd;
        }
        .upload-dropzone:hover {
          border-color: #0d6efd;
          background-color: #f8faff;
        }
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
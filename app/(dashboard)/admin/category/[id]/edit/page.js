"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import categoryService from "../../../../../services/categoryService";
import { Edit3, Image as ImageIcon, ArrowLeft, Save, RefreshCw, X } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditCategory() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [currentImage, setCurrentImage] = useState(null); // Ảnh cũ từ server
  const [newImage, setNewImage] = useState(null);        // Ảnh mới chọn
  const [preview, setPreview] = useState(null);          // Preview ảnh mới
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Tải dữ liệu danh mục hiện tại
  useEffect(() => {
    if (!id) return;

    const loadCategory = async () => {
      try {
        const res = await categoryService.getById(id);
        const data = res.data.data;
        setName(data.name);
        // Lưu URL ảnh cũ để hiển thị
        setCurrentImage(data.image); 
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  // 2. Xử lý khi chọn ảnh mới
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 3. Xử lý Slug tự động (SEO)
  const generateSlug = (text) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  };

  // 4. Gửi cập nhật
  const updateCategory = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("_method", "PUT"); // Cần thiết để Laravel hiểu là update khi gửi FormData
    formData.append("name", name);
    formData.append("slug", generateSlug(name));
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await categoryService.update(id, formData);
      alert("✅ Cập nhật danh mục thành công!");
      router.push("/admin/category");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("❌ Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <button onClick={() => router.back()} className="btn btn-white rounded-pill px-4 shadow-sm border-0 d-flex align-items-center gap-2">
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          <div className="text-center">
            <h2 className="fw-black text-dark mb-1">Hiệu Chỉnh Danh Mục</h2>
            <p className="text-muted small fw-light">Cập nhật thông tin và hình ảnh đại diện của hệ thống</p>
          </div>
          <div style={{ width: "120px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <form onSubmit={updateCategory} className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white">
              
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Tên Danh Mục</label>
                <div className="input-group border rounded-4 px-3 py-1 bg-light">
                  <span className="input-group-text bg-transparent border-0"><Edit3 size={18} className="text-muted" /></span>
                  <input
                    className="form-control bg-transparent border-0 shadow-none fw-bold text-dark"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <small className="text-muted ms-2 mt-2 d-block">Slug: <strong>{generateSlug(name)}</strong></small>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Hình Ảnh Minh Họa</label>
                
                <div className="row g-3">
                  {/* Hiển thị ảnh hiện tại */}
                  {currentImage && !preview && (
                    <div className="col-md-6">
                      <p className="small text-center text-muted mb-2">Ảnh hiện tại</p>
                      <img src={currentImage} className="rounded-4 border shadow-sm w-100 object-fit-cover" style={{ height: "180px" }} alt="Current" />
                    </div>
                  )}

                  {/* Hiển thị preview ảnh mới */}
                  {preview && (
                    <div className="col-md-6">
                      <p className="small text-center text-primary mb-2">Ảnh mới sẽ thay thế</p>
                      <div className="position-relative">
                        <img src={preview} className="rounded-4 border border-primary shadow w-100 object-fit-cover" style={{ height: "180px" }} alt="Preview" />
                        <button type="button" onClick={() => {setPreview(null); setNewImage(null);}} className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-2">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Vùng chọn ảnh */}
                  <div className={currentImage || preview ? "col-md-6" : "col-12"}>
                    <div 
                      className="upload-zone rounded-4 d-flex flex-column align-items-center justify-content-center h-100 border-dashed py-4"
                      onClick={() => document.getElementById('imageInput').click()}
                    >
                      <ImageIcon size={32} className="text-muted mb-2" />
                      <span className="small text-muted fw-bold">Chọn ảnh mới</span>
                    </div>
                    <input id="imageInput" type="file" className="d-none" accept="image/*" onChange={onImageChange} />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-top">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn btn-dark btn-lg w-100 rounded-pill py-3 shadow-lg d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                >
                  {saving ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={20} /> <span className="fw-bold">Lưu Thay Đổi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .bg-white { background: #fff; }
        .upload-zone {
          border: 2px dashed #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 180px;
        }
        .upload-zone:hover {
          background-color: #f8f9fa;
          border-color: #0d6efd;
        }
        .hover-scale:hover { transform: scale(1.02); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
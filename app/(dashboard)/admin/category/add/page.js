"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Image as ImageIcon, ArrowLeft, Save, X } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddCategory() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tạo Slug tự động từ tên
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("name", name);
    form.append("slug", generateSlug(name)); // Gửi kèm slug
    if (image) form.append("image", image);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/category", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        alert("✅ Thêm danh mục thành công!");
        router.push("/admin/category");
      } else {
        alert("❌ Lỗi khi thêm danh mục!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* HEADER BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            onClick={() => router.back()} 
            className="btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2 border-0 bg-white shadow-sm"
          >
            <ArrowLeft size={18} /> Quay lại
          </button>
          <h4 className="fw-bold mb-0 text-dark">Thiết kế Danh mục mới</h4>
          <div style={{ width: "100px" }}></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                  <FolderPlus size={32} className="text-primary" />
                </div>
                <h3 className="fw-bold">Tạo Danh Mục</h3>
                <p className="text-muted">Phân loại sản phẩm để khách hàng dễ dàng tìm kiếm</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Tên danh mục */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Tên Danh Mục</label>
                  <input
                    type="text"
                    className="form-control custom-input py-3"
                    placeholder="VD: Máy ảnh Mirrorless"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {name && (
                    <small className="text-muted mt-2 d-block ps-2 italic">
                      Đường dẫn tĩnh: <strong>{generateSlug(name)}</strong>
                    </small>
                  )}
                </div>

                {/* Khu vực Upload Ảnh */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Hình ảnh minh họa</label>
                  
                  {!preview ? (
                    <div 
                      className="upload-zone rounded-4 d-flex flex-column align-items-center justify-content-center py-5"
                      onClick={() => document.getElementById('imageInput').click()}
                    >
                      <ImageIcon size={48} strokeWidth={1} className="text-muted mb-3" />
                      <p className="mb-0 text-muted">Nhấn để tải lên hoặc kéo thả ảnh</p>
                      <small className="text-muted opacity-50">Định dạng JPG, PNG (Tối đa 2MB)</small>
                    </div>
                  ) : (
                    <div className="position-relative d-inline-block w-100">
                      <img
                        src={preview}
                        className="rounded-4 border shadow-sm w-100 object-fit-cover"
                        style={{ height: "300px" }}
                        alt="Preview"
                      />
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                  <input 
                    id="imageInput"
                    type="file" 
                    className="d-none" 
                    accept="image/*"
                    onChange={onImageChange} 
                  />
                </div>

                <div className="mt-5">
                  <button 
                    type="submit" 
                    className="btn btn-dark btn-lg w-100 rounded-pill py-3 d-flex align-items-center justify-content-center gap-2 shadow-lg transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        <Save size={20} /> <span className="fw-bold">Xác nhận Lưu danh mục</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-input {
          border: 1px solid #f0f0f0;
          background-color: #fafafa;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .custom-input:focus {
          background-color: #fff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }
        .upload-zone {
          border: 2px dashed #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-zone:hover {
          background-color: #f8f9fa;
          border-color: #0d6efd;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .transition-all:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
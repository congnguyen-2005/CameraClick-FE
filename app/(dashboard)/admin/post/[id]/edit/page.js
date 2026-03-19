"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PostService from "../../../../../services/PostService";
import { 
  ArrowLeft, 
  Save, 
  Type, 
  FileText, 
  ImageIcon, 
  RefreshCw, 
  X,
  History
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditPost({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    PostService.get(id)
      .then((res) => {
        setForm(res.data.data);
      })
      .catch((err) => console.error("Lỗi tải bài viết:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("_method", "PUT"); // Cần thiết cho Laravel khi gửi file qua POST
    data.append("title", form.title);
    data.append("content", form.content);

    if (newImage) {
      data.append("image", newImage);
    }

    try {
      await PostService.update(id, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Cập nhật bài viết thành công!");
      router.push("/admin/post");
    } catch (error) {
      alert("❌ Lỗi cập nhật!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <RefreshCw className="text-primary animate-spin mb-3" size={40} />
      <span className="text-muted fw-light">Đang đồng bộ dữ liệu bài viết...</span>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 px-lg-5">
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <button 
            onClick={() => router.back()} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
          <div className="text-center">
            <h2 className="fw-black text-dark mb-0 text-uppercase ls-1">Hiệu Chỉnh Nội Dung</h2>
            <p className="text-muted small fw-light mb-0">Mã bài viết: #{id}</p>
          </div>
          <div style={{ width: "120px" }}></div>
        </div>

        <form onSubmit={submit} className="row g-4">
          {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white h-100 animate-fade-in">
              <div className="card-body p-4 p-lg-5">
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                    <Type size={14} className="me-1 mb-1" /> Tiêu đề bài viết
                  </label>
                  <input
                    className="form-control custom-input py-3 shadow-none border-0 bg-light fw-bold fs-5"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-0 h-100">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">
                    <FileText size={14} className="me-1 mb-1" /> Nội dung soạn thảo
                  </label>
                  <textarea
                    className="form-control custom-input shadow-none border-0 bg-light"
                    rows="15"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                    style={{ borderRadius: "16px", minHeight: "400px" }}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: HÌNH ẢNH & TÁC VỤ */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <ImageIcon size={20} className="text-primary" />
                  <h5 className="fw-bold mb-0">Quản lý hình ảnh</h5>
                </div>

                {/* ẢNH HIỆN TẠI */}
                <div className="mb-4 text-center">
                  <p className="small text-muted fw-bold text-uppercase ls-1 mb-2">Ảnh đang hiển thị</p>
                  <div className="rounded-4 overflow-hidden border shadow-sm">
                    <img
                      src={`NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api/storage/${form.image}`}
                      className="w-100 object-fit-cover"
                      style={{ height: "180px" }}
                      alt="Current"
                      onError={(e) => e.target.src = "/no-image.jpg"}
                    />
                  </div>
                </div>

                {/* CHỌN ẢNH MỚI */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Chọn ảnh thay thế</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control custom-input py-2"
                    onChange={handleImageChange}
                  />
                </div>

                {/* PREVIEW ẢNH MỚI */}
                {preview && (
                  <div className="mb-0 text-center animate-fade-in">
                    <p className="small text-primary fw-bold text-uppercase ls-1 mb-2">Bản xem trước ảnh mới</p>
                    <div className="position-relative rounded-4 overflow-hidden border border-primary shadow-sm">
                      <img src={preview} className="w-100 object-fit-cover" style={{ height: "180px" }} alt="New Preview" />
                      <button 
                        type="button" 
                        onClick={() => {setNewImage(null); setPreview(null);}}
                        className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-2 shadow"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="card border-0 shadow-lg rounded-4 bg-dark text-white p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="d-flex align-items-center gap-2 mb-3 opacity-75">
                <History size={16} />
                <span className="small">Cập nhật lần cuối: Vừa xong</span>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                disabled={submitting}
              >
                {submitting ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                Xác Nhận Lưu Thay Đổi
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; }
        .custom-input {
          border-radius: 12px;
          transition: 0.3s;
        }
        .custom-input:focus {
          background-color: #fff !important;
          border: 1px solid #0d6efd !important;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1) !important;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
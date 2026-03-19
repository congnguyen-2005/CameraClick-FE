"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostService from "../../../../services/PostService";
import { ArrowLeft, Save, Type, FileText, Image as ImageIcon, Send, X } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // Lưu link xem trước ảnh
  
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null, // Sẽ lưu File object thay vì URL string
    description: "", // Bổ sung để tránh lỗi thiếu field NOT NULL
  });

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra dung lượng 20MB
      if (file.size > 20 * 1024 * 1024) {
        alert("❌ File quá lớn! Vui lòng chọn ảnh dưới 20MB.");
        return;
      }
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file)); // Tạo link xem trước
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // QUAN TRỌNG: Dùng FormData để gửi được file ảnh lên Laravel
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("description", form.description || form.title.substring(0, 150));
      
      if (form.image) {
        formData.append("image", form.image);
      }

      await PostService.create(formData);
      
      alert("✅ Thêm bài viết thành công!");
      router.push("/admin/post");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("❌ Thêm bài viết thất bại: " + (err.response?.data?.message || "Lỗi hệ thống"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 px-lg-5">
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* HEADER BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <button 
            onClick={() => router.back()} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale bg-white"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Danh sách</span>
          </button>
          <div className="text-center">
            <h2 className="fw-black text-dark mb-0 text-uppercase ls-1">Soạn Thảo Bài Viết</h2>
            <p className="text-muted small fw-light mb-0">Hệ thống quản trị nội dung Alpha</p>
          </div>
          <div style={{ width: "120px" }}></div>
        </div>

        <form onSubmit={submit}>
          <div className="row g-4">
            {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white animate-fade-in h-100">
                <div className="bg-dark p-4 text-white d-flex align-items-center gap-3">
                  <div className="bg-primary p-2 rounded-3 shadow">
                    <Type size={20} />
                  </div>
                  <h5 className="mb-0 fw-bold small text-uppercase">Nội dung chính</h5>
                </div>

                <div className="card-body p-4 p-lg-5">
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">Tiêu đề bài viết</label>
                      <input
                        className="form-control custom-input py-3 shadow-none border-0 bg-light"
                        placeholder="Nhập tiêu đề thu hút..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-bold text-muted text-uppercase ls-1">Nội dung bài viết</label>
                      <textarea
                        className="form-control custom-input shadow-none border-0 bg-light"
                        rows="15"
                        placeholder="Kể câu chuyện của bạn..."
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        required
                        style={{ borderRadius: "16px" }}
                      ></textarea>
                    </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN PHỤ & ẢNH */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 bg-white mb-4 animate-fade-in">
                <div className="card-body p-4">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1 mb-3">
                    <ImageIcon size={14} className="me-1" /> Hình ảnh đại diện
                  </label>
                  
                  <div className="image-upload-wrapper text-center">
                    {!preview ? (
                      <div className="upload-placeholder p-5 border border-dashed rounded-4 bg-light cursor-pointer" 
                           onClick={() => document.getElementById('fileInput').click()}>
                        <ImageIcon size={48} className="text-muted mb-2 opacity-25" />
                        <p className="small text-muted m-0">Click để chọn ảnh<br/>(Tối đa 20MB)</p>
                      </div>
                    ) : (
                      <div className="position-relative">
                        <img src={preview} alt="Preview" className="img-fluid rounded-4 shadow-sm border" />
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                          onClick={() => { setPreview(null); setForm({ ...form, image: null }); }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <input 
                      type="file" 
                      id="fileInput" 
                      hidden 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 bg-dark p-4 sticky-top" style={{ top: "20px" }}>
                <h6 className="text-warning text-uppercase small fw-black ls-1 mb-4">Trạng thái xuất bản</h6>
                
                <div className="mb-4">
                    <label className="text-white-50 small mb-2">Mô tả ngắn (SEO)</label>
                    <textarea 
                        className="form-control bg-secondary bg-opacity-25 border-0 text-white small"
                        rows="4"
                        placeholder="Tóm tắt bài viết..."
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                    ></textarea>
                </div>

                <div className="d-grid gap-3">
                  <button 
                    type="submit" 
                    className="btn btn-warning btn-lg rounded-pill fw-bold text-dark d-flex align-items-center justify-content-center gap-2 py-3" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        <Save size={18} /> Lưu bài viết
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .bg-white { background: #fff !important; }
        .cursor-pointer { cursor: pointer; }
        .custom-input { border-radius: 12px; transition: 0.3s; }
        .custom-input:focus {
          background-color: #fff !important;
          border: 1px solid #ffc107 !important;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1) !important;
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .upload-placeholder:hover { background-color: #eee !important; border-color: #ffc107 !important; }
      `}</style>
    </div>
  );
}
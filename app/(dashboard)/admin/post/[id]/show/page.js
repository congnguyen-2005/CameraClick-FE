"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostService from "../../../../../services/PostService";
import { ArrowLeft, Edit3, Calendar, Tag, Hash, FileText, Share2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ShowPost({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    PostService.get(id)
      .then((res) => {
        setPost(res.data.data);
      })
      .catch(() => alert("❌ Lỗi tải bài viết"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="spinner-border text-primary border-4" role="status"></div>
      <span className="mt-3 text-muted fw-light">Đang chuẩn bị bản xem trước...</span>
    </div>
  );

  if (!post) return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="text-center">
        <h4 className="text-muted">Không tìm thấy nội dung bài viết.</h4>
        <button onClick={() => router.back()} className="btn btn-dark mt-3 rounded-pill">Quay lại</button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* ACTION BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            onClick={() => router.back()} 
            className="btn btn-white shadow-sm rounded-pill px-4 border-0 d-flex align-items-center gap-2 transition-all hover-scale"
          >
            <ArrowLeft size={18} /> <span className="small fw-bold">Danh sách</span>
          </button>
          
          <div className="d-flex gap-2">
            <button className="btn btn-white shadow-sm rounded-circle p-2 border-0 transition-all hover-scale">
                <Share2 size={18} className="text-muted" />
            </button>
            <button 
              onClick={() => router.push(`/admin/post/${id}/edit`)}
              className="btn btn-dark shadow-sm rounded-pill px-4 d-flex align-items-center gap-2 transition-all hover-scale"
            >
              <Edit3 size={18} /> <span className="small fw-bold">Chỉnh sửa bài viết</span>
            </button>
          </div>
        </div>

        {/* MAIN POST CARD */}
        <article className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white animate-fade-in">
          
          {/* COVER IMAGE */}
          <div className="position-relative" style={{ height: "450px" }}>
            <img
              src={post.image_url || "/no-image.jpg"}
              className="w-100 h-100 object-fit-cover"
              alt={post.title}
              onError={(e) => { e.target.src = "https://placehold.co/1200x800?text=No+Cover+Image"; }}
            />
            <div className="position-absolute bottom-0 start-0 p-4 w-100" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
              <span className="badge bg-primary px-3 py-2 rounded-pill mb-2">Đã xuất bản</span>
              <h1 className="display-5 fw-black text-white mb-0">{post.title}</h1>
            </div>
          </div>

          <div className="card-body p-4 p-lg-5">
            {/* META INFO */}
            <div className="row g-3 mb-5 pb-4 border-bottom">
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Hash size={16} className="text-primary" />
                  <small className="fw-bold uppercase ls-1">Mã: {id}</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Calendar size={16} className="text-primary" />
                  <small className="fw-bold uppercase ls-1">
                    {new Date(post.created_at || Date.now()).toLocaleDateString('vi-VN')}
                  </small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Tag size={16} className="text-primary" />
                  <small className="fw-bold uppercase ls-1">Blog Content</small>
                </div>
              </div>
              <div className="col-6 col-md-3 text-end">
                <div className="d-flex align-items-center gap-2 text-muted justify-content-end">
                  <FileText size={16} className="text-primary" />
                  <small className="fw-bold uppercase ls-1">~5 min read</small>
                </div>
              </div>
            </div>

            {/* CONTENT BODY */}
            <div className="post-content fs-5 text-dark lh-lg fw-light">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* FOOTER BAR */}
          <div className="card-footer bg-light border-0 p-4 text-center">
             <p className="text-muted small mb-0">Hết nội dung bài viết. Bạn có muốn thực hiện thay đổi nào không?</p>
          </div>
        </article>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 0.1em; }
        .uppercase { text-transform: uppercase; font-size: 0.75rem; }
        .btn-white { background: #fff; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05); }
        .post-content p {
          color: #2d3436;
          text-align: justify;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
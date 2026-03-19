"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, User, ArrowLeft, Clock, Share2, ChevronLeft } from "lucide-react";
import PostService from "../../../services/PostService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BlogDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const IMG_URL = "http://localhost:8000/storage/";

  useEffect(() => {
    setMounted(true);
    const fetchPostDetail = async () => {
      try {
        const res = await PostService.get(id);
        setPost(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPostDetail();
  }, [id]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow" style={{ color: "#CC6600" }} role="status"></div>
        <p className="mt-3 text-uppercase ls-2 small fw-bold">Đang mở trang kiến thức...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <h3 className="text-muted fw-light">Bài viết này đã được lưu trữ hoặc không tồn tại.</h3>
        <button onClick={() => router.push('/post')} className="btn btn-dark mt-4 px-5 rounded-pill uppercase ls-1 shadow-sm">
          Quay lại danh sách bài viết
        </button>
      </div>
    );
  }

  return (
    <div className="blog-detail-theme bg-white">
      {/* 1. TOP NAVIGATION */}
      <div className="container pt-5">
        <button 
          onClick={() => router.back()} 
          className="btn-back-luxury"
        >
          <ChevronLeft size={20} /> Quay lại kiến thức
        </button>
      </div>

      <article className="container py-5" style={{ maxWidth: "1250px" }}>
        {/* 2. HEADER SECTION */}
        <header className="mb-5">
          <div className="text-center mb-4">
            <span className="badge-category ">KIẾN THỨC NHIẾP ẢNH</span>
            <h1 className="post-display-title mt-1 mb-4 fs-1">
              {post.title}
            </h1>
          </div>
          
          <div className="post-meta-luxury border-top border-bottom py-3">
            <div className="meta-item">
              <Calendar size={16} />
              <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <User size={16} />
              <span>Tác giả: Admin CamStore</span>
            </div>
            <div className="meta-divider d-none d-md-block"></div>
            <div className="meta-item d-none d-md-flex">
              <Clock size={16} />
              <span>10 phút đọc</span>
            </div>
          </div>
        </header>

        {/* 3. HERO IMAGE */}
        <div className="hero-image-container mb-5">
          <img
            src={post.image?.startsWith('http') ? post.image : `${IMG_URL}${post.image}`}
            className="hero-img shadow-lg"
            alt={post.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000";
            }}
          />
        </div>

        {/* 4. MAIN CONTENT */}
        <div className="post-rich-content">
           <div 
             dangerouslySetInnerHTML={{ __html: post.detail || post.content }} 
             className="content-inner"
           />
        </div>

        {/* 5. FOOTER SECTION */}
        <footer className="mt-5 pt-5 border-top">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex gap-2 flex-wrap">
                <span className="tag-luxury">#Photography</span>
                <span className="tag-luxury">#SonyAlpha</span>
                <span className="tag-luxury">#CamStoreTips</span>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button className="btn-share-luxury shadow-sm">
                <Share2 size={18} /> Chia sẻ bài viết
              </button>
            </div>
          </div>
        </footer>
      </article>

      <style jsx>{`
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        
        .btn-back-luxury {
          background: none; border: none; color: #888;
          display: flex; align-items: center; gap: 5px;
          font-weight: 700; font-size: 0.85rem; text-transform: uppercase;
          transition: 0.3s ease; padding: 0;
        }
        .btn-back-luxury:hover { color: #CC6600; transform: translateX(-5px); }

        .badge-category {
          color: #CC6600; font-weight: 800; font-size: 0.75rem; letter-spacing: 2px;
        }

        .post-display-title {
          font-size: 3rem; font-weight: 900; color: #111; line-height: 1.1;
        }

        .post-meta-luxury {
          display: flex; justify-content: center; align-items: center;
          gap: 20px; color: #666; font-weight: 500; font-size: 0.9rem;
        }
        .meta-item { display: flex; align-items: center; gap: 8px; }
        .meta-divider { width: 1px; height: 15px; background: #ddd; }
        .meta-item :global(svg) { color: #CC6600; }

        .hero-image-container {
          border-radius: 24px; overflow: hidden;
          max-height: 550px;
        }
        .hero-img { width: 100%; height: 100%; object-fit: cover; }

        /* POST CONTENT STYLING */
        .post-rich-content {
          line-height: 2; font-size: 1.2rem; color: #222;
        }
        .content-inner :global(p) { margin-bottom: 2rem; }
        .content-inner :global(h2) { 
          font-weight: 800; margin-top: 3rem; margin-bottom: 1.5rem; 
          color: #111; font-size: 2rem;
        }
        .content-inner :global(img) {
          border-radius: 16px; margin: 2rem 0; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .content-inner :global(blockquote) {
          border-left: 4px solid #CC6600; padding: 1rem 2rem;
          background: #fdfdfd; font-style: italic; color: #555;
          margin: 2.5rem 0;
        }

        .tag-luxury {
          background: #f8f8f8; color: #444; padding: 8px 16px;
          border-radius: 8px; font-size: 0.85rem; font-weight: 600;
          transition: 0.3s; cursor: pointer; border: 1px solid #eee;
        }
        .tag-luxury:hover { background: #111; color: #fff; }

        .btn-share-luxury {
          background: #fff; border: 1px solid #111; color: #111;
          padding: 10px 24px; border-radius: 50px; font-weight: 700;
          font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;
          transition: 0.3s;
        }
        .btn-share-luxury:hover { background: #111; color: #fff; }

        @media (max-width: 768px) {
          .post-display-title { font-size: 2rem; }
          .post-meta-luxury { flex-direction: column; gap: 10px; }
          .meta-divider { display: none; }
        }
      `}</style>
    </div>
  );
}
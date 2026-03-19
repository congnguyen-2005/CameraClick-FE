"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Clock, Tag, ChevronRight } from "lucide-react";
import PostService from "../../services/PostService"; 
import "bootstrap/dist/css/bootstrap.min.css";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const IMG_URL = "http://localhost:8000/storage/";

  useEffect(() => {
    setMounted(true);
    const fetchPosts = async () => {
      try {
        const res = await PostService.getAll();
        const data = res.data.data || res.data || [];
        setPosts(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160) + "...";
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-white">
        <div className="loader-luxury"></div>
        <p className="mt-4 text-uppercase ls-2 small fw-bold">Đang tải kiến thức mới...</p>
      </div>
    );
  }

  return (
    <div className="blog-luxury-theme">
      <main className="bg-light pb-5 min-vh-100">
        
        {/* HERO SECTION */}
        <div className="bg-white border-bottom shadow-sm mb-5">
          <div className="container py-5">
            <nav className="mb-4">
              <ol className="breadcrumb small text-uppercase ls-1 fw-bold m-0 justify-content-center">
                <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Trang chủ</Link></li>
                <li className="breadcrumb-item active text-dark">Kiến thức Alpha</li>
              </ol>
            </nav>
            <div className="text-center">
              <h1 className="display-3 fw-black mb-3">BLOG <span className="text-orange">ALPHA</span></h1>
              <p className="text-muted lead mx-auto max-w-600">
                Nơi chia sẻ kỹ thuật nhiếp ảnh chuyên nghiệp và đánh giá thiết bị Sony Alpha chuyên sâu.
              </p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row g-4">
            {posts.length > 0 ? (
              posts.map((p, index) => {
                // Bài viết đầu tiên làm Featured Post (chiếm 12 cột trên mobile/tablet, 8 cột trên desktop)
                const isFeatured = index === 0;
                return (
                  <div className={isFeatured ? "col-12 mb-4" : "col-lg-4 col-md-6"} key={p.id}>
                    <article className={`post-card-luxury ${isFeatured ? 'featured' : ''}`}>
                      <div className="post-img-wrapper">
                        <Link href={`/post/${p.id}`}>
                          <img
                            src={p.image?.startsWith('http') ? p.image : `${IMG_URL}${p.image}`}
                            className="post-main-img"
                            alt={p.title}
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800"; }}
                          />
                        </Link>
                        <div className="post-category-badge">
                          <Tag size={12} /> {isFeatured ? 'Bài viết nổi bật' : 'Kiến thức'}
                        </div>
                      </div>

                      <div className="post-content">
                        <div className="post-meta">
                          <span className="meta-item">
                            <Calendar size={14} /> {new Date(p.created_at || Date.now()).toLocaleDateString("vi-VN")}
                          </span>
                          <span className="meta-divider"></span>
                          <span className="meta-item">
                            <Clock size={14} /> 5 phút đọc
                          </span>
                        </div>

                        <h3 className="post-title">
                          <Link href={`/post/${p.id}`}>{p.title}</Link>
                        </h3>

                        <p className="post-excerpt">
                          {stripHtml(p.detail || p.content)}
                        </p>

                        <div className="post-footer">
                          <Link href={`/post/${p.id}`} className="btn-read-more">
                            ĐỌC CHI TIẾT <ChevronRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5 mt-5">
                <BookOpen size={80} className="mb-4 opacity-10" />
                <h3 className="fw-bold">Hệ thống đang biên soạn nội dung</h3>
                <Link href="/" className="btn btn-dark rounded-pill px-5 py-3 mt-4">QUAY LẠI TRANG CHỦ</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .fw-black { font-weight: 900; }
        .text-orange { color: #CC6600; }
        .max-w-600 { max-width: 600px; }

        /* Loader Luxury */
        .loader-luxury {
          width: 50px; height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #CC6600;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Post Card Luxury */
        .post-card-luxury {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          height: 100%;
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }

        .post-card-luxury:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
          border-color: #CC6600;
        }

        .post-img-wrapper {
          position: relative;
          height: 260px;
          overflow: hidden;
        }

        /* Featured Card Style */
        .post-card-luxury.featured {
          flex-direction: row;
          max-height: 450px;
        }
        .post-card-luxury.featured .post-img-wrapper {
          flex: 1.2;
          height: auto;
        }
        .post-card-luxury.featured .post-content {
          flex: 1;
          padding: 3rem;
          justify-content: center;
        }

        .post-main-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 1s ease;
        }
        .post-card-luxury:hover .post-main-img { transform: scale(1.1); }

        .post-category-badge {
          position: absolute; top: 20px; left: 20px;
          background: #CC6600; color: #fff;
          padding: 6px 16px; border-radius: 50px;
          font-size: 10px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1px;
          display: flex; align-items: center; gap: 6px;
        }

        .post-content { padding: 2rem; display: flex; flex-direction: column; flex-grow: 1; }
        
        .post-meta { display: flex; align-items: center; gap: 15px; margin-bottom: 1rem; color: #999; font-size: 12px; font-weight: 600; }
        .meta-divider { width: 4px; height: 4px; background: #ddd; border-radius: 50%; }
        .meta-item { display: flex; align-items: center; gap: 6px; }

        .post-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.3; }
        .post-title a { color: #111; text-decoration: none; transition: 0.3s; }
        .post-title a:hover { color: #CC6600; }

        .post-excerpt { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        .post-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid #f0f0f0; }
        
        .btn-read-more {
          color: #111; text-decoration: none; font-weight: 800;
          font-size: 12px; letter-spacing: 1px;
          display: flex; align-items: center; gap: 8px;
          transition: 0.3s;
        }
        .btn-read-more:hover { color: #CC6600; transform: translateX(10px); }

        @media (max-width: 991px) {
          .post-card-luxury.featured { flex-direction: column; max-height: none; }
          .post-card-luxury.featured .post-content { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryService from "../../../../../services/categoryService";
import { ArrowLeft, Edit3, Calendar, Tag, Hash, Layout } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ShowCategory() {
  const { id } = useParams();
  const router = useRouter();
  const [cate, setCate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CategoryService.getById(id)
      .then(res => {
        setCate(res.data.data);
      })
      .catch(err => {
        console.error("Error fetching category:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!cate) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <Layout size={64} className="text-muted mb-3 opacity-25" />
      <h4 className="fw-bold text-muted">Không tìm thấy danh mục này!</h4>
      <button onClick={() => router.back()} className="btn btn-dark mt-3 rounded-pill px-4">Quay lại</button>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: "850px" }}>
        
        {/* TOP NAVIGATION */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button onClick={() => router.back()} className="btn btn-white shadow-sm rounded-pill px-3 border-0 d-flex align-items-center gap-2 transition-all">
            <ArrowLeft size={18} /> <span className="small fw-bold">Trở về</span>
          </button>
          <div className="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill">
            <Hash size={14} className="me-1 text-primary" /> 
            <span className="small fw-bold text-muted">ID: {id}</span>
          </div>
        </div>

        <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white animate-fade-in">
          <div className="row g-0">
            
            {/* LEFT SIDE: IMAGE PREVIEW */}
            <div className="col-md-5 bg-dark d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: "350px" }}>
              <img
                src={cate.image ? `NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api/${cate.image}` : "/no-image.png"}
                className="w-100 h-100 object-fit-cover opacity-75"
                alt={cate.name}
              />
            </div>

            {/* RIGHT SIDE: CONTENT */}
            <div className="col-md-7 p-4 p-lg-5">
              <div className="mb-4">
                <small className="text-primary fw-bold text-uppercase ls-wide">Thông tin danh mục</small>
                <h2 className="display-6 fw-black text-dark mb-0 mt-1">{cate.name}</h2>
                <div className="text-muted fst-italic mt-1">/{cate.slug}</div>
              </div>

              <div className="space-y-4">
                {/* DATA ROW 1 */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light transition-all border-start border-primary border-4">
                  <div className="bg-white p-2 rounded-2 shadow-sm text-primary">
                    <Tag size={20} />
                  </div>
                  <div>
                    <small className="text-muted d-block small uppercase fw-bold">Tên hiển thị</small>
                    <span className="fw-bold text-dark">{cate.name}</span>
                  </div>
                </div>

                {/* DATA ROW 2 */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light mt-3 transition-all">
                  <div className="bg-white p-2 rounded-2 shadow-sm text-muted">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <small className="text-muted d-block small uppercase fw-bold">Ngày khởi tạo</small>
                    <span className="text-dark fw-medium">
                      {new Date(cate.created_at).toLocaleDateString('vi-VN', { 
                        day: '2-digit', month: 'long', year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 pt-4 border-top d-flex gap-3">
                <Link 
                  href={`/admin/category/${id}/edit`} 
                  className="btn btn-warning flex-grow-1 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                >
                  <Edit3 size={18} /> Chỉnh sửa danh mục
                </Link>
                <button 
                  onClick={() => router.push("/admin/category")}
                  className="btn btn-outline-dark rounded-pill px-4 transition-all"
                >
                  Danh sách
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-wide { letter-spacing: 0.1em; font-size: 0.75rem; }
        .uppercase { font-size: 0.65rem; }
        .transition-all { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </div>
  );
}
"use client";
import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Carousel({ banners, loading }) {
  const API_URL = "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api/storage/";
  const carouselRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && banners && banners.length > 0) {
      // Dynamic import để tránh lỗi SSR trong Next.js
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
        if (carouselRef.current) {
          new bootstrap.Carousel(carouselRef.current, {
            interval: 6000, // Tăng thời gian dừng để người dùng đọc description
            ride: "carousel",
            pause: "hover",
          });
        }
      });
    }
  }, [mounted, banners]);

  // Loading Skeleton Luxury
  if (loading || !mounted) return (
    <div className="container py-4">
      <div className="w-100 bg-dark rounded-5 position-relative overflow-hidden" style={{ height: "550px" }}>
        <div className="shimmer-effect"></div>
      </div>
    </div>
  );

  const renderCarouselContent = (items) => (
    <div 
      id="homeCarousel" 
      ref={carouselRef} 
      className="carousel slide carousel-fade shadow-lg overflow-hidden rounded-5" 
      data-bs-ride="carousel"
    >
      {/* INDICATORS HIỆN ĐẠI */}
      <div className="carousel-indicators mb-4">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to={index}
            className={`indicator-line ${index === 0 ? "active" : ""}`}
            aria-current={index === 0 ? "true" : "false"}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {items.map((banner, index) => (
          <div 
            key={banner.id || index} 
            className={`carousel-item ${index === 0 ? "active" : ""}`} 
          >
            <div className="zoom-container">
              <img
                src={banner.image ? (banner.image.startsWith('http') ? banner.image : `${API_URL}${banner.image}`) : "/sliders/banner1.jpg"}
                className="d-block w-100 object-fit-cover"
                style={{ height: "550px" }}
                alt={banner.name || "Banner"}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000"; }} 
              />
            </div>

            {/* OVERLAY CAPTION LUXURY */}
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start px-md-5">
              <div className="caption-content p-4 rounded-4 animate-slide-up">
                {banner.name && (
                  <h1 className="display-4 fw-black text-white mb-2 text-uppercase ls-2">
                    {banner.name}
                  </h1>
                )}
                {banner.description && (
                  <p className="fs-5 text-white-50 fw-light mb-4 ls-1 max-w-450">
                    {banner.description}
                  </p>
                )}
                <button className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-uppercase ls-1 transition-all hover-scale shadow-warning">
                  Khám phá ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION BUTTONS */}
      <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
        <div className="control-btn-circle ms-3">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </div>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
        <div className="control-btn-circle me-3">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </div>
      </button>
    </div>
  );

  return (
    <div className="container py-4">
      {!banners || banners.length === 0 
        ? renderCarouselContent([{ image: "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?q=80&w=2000", name: "Sony Alpha Elite", description: "Định nghĩa lại giới hạn của nhiếp ảnh chuyên nghiệp." }]) 
        : renderCarouselContent(banners)
      }
      
      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 0.2em; }
        .ls-1 { letter-spacing: 0.1em; }
        .max-w-450 { max-width: 450px; }

        /* Hiệu ứng Zoom ảnh */
        .zoom-container { overflow: hidden; height: 100%; }
        .carousel-item.active .zoom-container img {
          animation: kenburns 10s ease-in-out infinite alternate;
        }

        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        /* Indicator Line Style */
        .indicator-line {
          width: 40px !important;
          height: 3px !important;
          border: none !important;
          background-color: rgba(255,255,255,0.3) !important;
          transition: all 0.3s ease !important;
          margin: 0 4px !important;
        }
        .indicator-line.active {
          width: 60px !important;
          background-color: #ffc107 !important;
        }

        /* Control Circle Style */
        .control-btn-circle {
          width: 50px;
          height: 50px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(5px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .control-btn-circle:hover { background: #ffc107; transform: scale(1.1); }

        /* Caption Animation */
        .caption-content {
          background: linear-gradient(to right, rgba(0,0,0,0.6), transparent);
          border-left: 5px solid #ffc107;
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Shimmer Loading */
        .shimmer-effect {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #1a1a1a, #2a2a2a, #1a1a1a);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .shadow-warning { box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4); }
        .hover-scale:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
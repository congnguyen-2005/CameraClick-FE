"use client";
import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Carousel({ banners, loading }) {
  // Logic xử lý link ảnh: Chuyển .../api thành .../storage
  const STORAGE_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') + "/storage/"
    : "https://cameraclick-be-production.up.railway.app/storage/";

  const carouselRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && banners && banners.length > 0) {
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
        if (carouselRef.current) {
          new bootstrap.Carousel(carouselRef.current, {
            interval: 6000,
            ride: "carousel",
            pause: "hover",
          });
        }
      });
    }
  }, [mounted, banners]);

  if (loading || !mounted) return (
    <div className="container py-4">
      <div className="w-100 bg-dark rounded-5 position-relative overflow-hidden" style={{ height: "550px" }}>
        <div className="shimmer-effect"></div>
      </div>
    </div>
  );

  const renderCarouselContent = (items) => (
    <div id="homeCarousel" ref={carouselRef} className="carousel slide carousel-fade shadow-lg overflow-hidden rounded-5" data-bs-ride="carousel">
      <div className="carousel-indicators mb-4">
        {items.map((_, index) => (
          <button key={index} type="button" data-bs-target="#homeCarousel" data-bs-slide-to={index} className={`indicator-line ${index === 0 ? "active" : ""}`}></button>
        ))}
      </div>

      <div className="carousel-inner">
        {items.map((banner, index) => (
          <div key={banner.id || index} className={`carousel-item ${index === 0 ? "active" : ""}`} >
            <div className="zoom-container">
              <img
                // KIỂM TRA LINK ẢNH: Nếu là link tuyệt đối (http) thì dùng luôn, nếu là tên file thì nối với STORAGE_URL
                src={banner.image ? (banner.image.startsWith('http') ? banner.image : `${STORAGE_URL}${banner.image}`) : "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"}
                className="d-block w-100 object-fit-cover"
                style={{ height: "550px" }}
                alt={banner.name || "Banner"}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"; }} 
              />
            </div>
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start px-md-5">
              <div className="caption-content p-4 rounded-4 animate-slide-up">
                <h1 className="display-4 fw-black text-white mb-2 text-uppercase ls-2">{banner.name || "CameraClick Elite"}</h1>
                <p className="fs-5 text-white-50 fw-light mb-4 ls-1 max-w-450">{banner.description || "Khám phá thế giới qua ống kính chuyên nghiệp."}</p>
                <button className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-uppercase ls-1 transition-all hover-scale shadow-warning">Khám phá ngay</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {!banners || banners.length === 0 ? renderCarouselContent([{ image: "", name: "Welcome to CameraClick" }]) : renderCarouselContent(banners)}
      <style jsx>{`
        /* Giữ nguyên phần CSS của bạn */
        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 0.2em; }
        .caption-content { background: linear-gradient(to right, rgba(0,0,0,0.7), transparent); border-left: 5px solid #ffc107; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer-effect { position: absolute; inset: 0; background: linear-gradient(90deg, #1a1a1a, #2a2a2a, #1a1a1a); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
      `}</style>
    </div>
  );
}
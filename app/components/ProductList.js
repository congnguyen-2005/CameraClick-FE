"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function ProductList({ title, products, loading }) {
  const [mounted, setMounted] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. SKELETON LOADING CAO CẤP
  if (loading || !mounted) {
    return (
      <div className="product-list-wrapper mb-5">
        <div className="skeleton-title mb-4"></div>
        <div className="row g-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <div className="skeleton-card" style={{ borderRadius: "24px", height: "380px" }}>
                <div className="skeleton-image" style={{ height: "220px", borderRadius: "24px 24px 0 0" }}></div>
                <div className="p-4">
                  <div className="skeleton-text mb-2" style={{ width: "40%" }}></div>
                  <div className="skeleton-text mb-3" style={{ width: "90%", height: "20px" }}></div>
                  <div className="d-flex justify-content-between mt-4 align-items-center">
                    <div className="skeleton-text" style={{ width: "50%", height: "25px" }}></div>
                    <div className="skeleton-icon" style={{ width: "40px", height: "40px", borderRadius: "12px" }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-wrapper mb-5 container-fluid px-0">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
        <h3 className="fw-black m-0 d-flex align-items-center gap-3" style={{ color: "#111", letterSpacing: "-0.5px" }}>
          <span className="title-accent"></span>
          {title}
        </h3>
        <Link href="/product" className="view-all-link">
          Xem tất cả <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="row g-4">
        {products.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <div className="luxury-product-card">
              
              {/* Image Container */}
              <div className="image-container">
                <Link href={`/product/${p.slug || p.id}`} className="img-anchor">
                  <img
                    src={p.thumbnail ? (p.thumbnail.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p.thumbnail}`) : "/no-image.jpg"}
                    alt={p.name}
                    className="product-img-zoom"
                    onError={(e) => { e.target.src = "/no-image.jpg"; }}
                  />
                </Link>
                
                {p.price_sale && (
                  <div className="badge-wrapper">
                    <span className="badge-luxury">SALE</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="product-info-body">
                <small className="category-label">
                   {p.category?.name || "LENS"}
                </small>
                
                <h6 className="product-name-title">
                  <Link href={`/product/${p.slug || p.id}`}>
                    {p.name}
                  </Link>
                </h6>
                
                <div className="price-action-row">
                  <div className="price-group">
                    <span className="price-current">
                      {p.price_buy.toLocaleString()}₫
                    </span>
                    {p.price_sale && (
                      <del className="price-old">
                        {(p.price_buy * 1.2).toLocaleString()}₫
                      </del>
                    )}
                  </div>
                  
                  <button className="cart-btn-luxury" aria-label="Add to cart">
                    <ShoppingBag size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        
        .title-accent {
          width: 4px; 
          height: 28px; 
          background-color: #CC6600; 
          display: inline-block; 
          border-radius: 10px;
        }

        .view-all-link {
          color: #6c757d;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: 0.3s;
        }
        .view-all-link:hover { color: #CC6600; }

        /* Luxury Card Styles */
        .luxury-product-card {
          height: 100%;
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid rgba(0,0,0,0.03);
        }
        
        .luxury-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: rgba(204, 102, 0, 0.1);
        }

        .image-container {
          position: relative;
          background: #f9f9fb;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .img-anchor {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .product-img-zoom {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .luxury-product-card:hover .product-img-zoom {
          transform: scale(1.1);
        }

        .badge-wrapper { position: absolute; top: 15px; left: 15px; }
        .badge-luxury {
          background-color: #CC6600;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 50px;
          letter-spacing: 1px;
        }

        .product-info-body { padding: 1.5rem; display: flex; flex-direction: column; }
        
        .category-label {
          color: #adb5bd;
          text-transform: uppercase;
          font-weight: 800;
          font-size: 10px;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .product-name-title {
          height: 44px;
          margin-bottom: 1rem;
        }
        .product-name-title :global(a) {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: 0.2s;
        }
        .product-name-title :global(a:hover) { color: #CC6600; }

        .price-action-row {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-group { display: flex; flex-direction: column; }
        .price-current { color: #111; font-weight: 900; font-size: 1.15rem; }
        .price-old { color: #adb5bd; font-size: 0.75rem; }

        .cart-btn-luxury {
          background-color: #111;
          color: #fff;
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .cart-btn-luxury:hover {
          background-color: #CC6600;
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(204, 102, 0, 0.3);
        }

        /* Skeleton Shimmer Styles */
        .skeleton-card, .skeleton-image, .skeleton-text, .skeleton-icon, .skeleton-title {
          background: #eee;
          background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        .skeleton-text { height: 12px; border-radius: 4px; }
        .skeleton-title { width: 250px; height: 35px; border-radius: 8px; }

        @keyframes shimmer {
          to { background-position-x: -200%; }
        }
      `}</style>
    </div>
  );
}
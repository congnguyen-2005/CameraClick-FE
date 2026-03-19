"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Star, Zap } from "lucide-react";

export default function ProductCard({ product, isLoading }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. REFINED SKELETON LOADING
  if (isLoading || !mounted) {
    return (
      <div className="skeleton-card">
        <div className="skeleton-image shimmer"></div>
        <div className="skeleton-content">
          <div className="skeleton-line shimmer w-50"></div>
          <div className="skeleton-line shimmer w-100"></div>
          <div className="skeleton-line shimmer w-75"></div>
          <div className="skeleton-price shimmer w-50"></div>
        </div>
      </div>
    );
  }

  const hasSale = product.sale_price > 0;
  const discountPercent = hasSale 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;

  return (
    <div className="product-luxury-card group">
      {/* IMAGE CONTAINER */}
      <div className="image-wrapper">
        <div className="badge-container">
          {hasSale && <span className="badge-sale">-{discountPercent}%</span>}
          {product.is_new && <span className="badge-new">NEW</span>}
        </div>

        <div className="quick-actions">
          <button className="action-btn" title="Thêm vào giỏ">
            <ShoppingCart size={18} />
          </button>
          <Link href={`/product/${product.id}`} className="action-btn" title="Xem nhanh">
            <Eye size={18} />
          </Link>
        </div>

        <img 
          src={product.image || "https://placehold.co/600x600/222/fff?text=Sony+Alpha"} 
          alt={product.name} 
          className="product-img "
        />
      </div>

      {/* CONTENT */}
      <div className="content-wrapper">
        <div className="category-tag">Sony Alpha Series</div>
        
        <Link href={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>

        <div className="rating-box">
          {[...Array(4)].map((_, i) => <Star key={i} size={12} fill="#FFB400" color="#FFB400" />)}
          <Star size={12} fill="#ddd" color="#ddd" />
          <span className="review-count">(24)</span>
        </div>

        <div className="price-container">
          {hasSale ? (
            <>
              <span className="current-price">{(product.sale_price).toLocaleString()}₫</span>
              <span className="old-price">{(product.price).toLocaleString()}₫</span>
            </>
          ) : (
            <span className="current-price">{(product.price).toLocaleString()}₫</span>
          )}
        </div>

        <button className="buy-now-btn">
          <Zap size={14} className="me-1" /> MUA NGAY
        </button>
      </div>

      <style jsx>{`
        /* --- MAIN CARD --- */
        .product-luxury-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid #f0f0f0;
          position: relative;
        }
        .product-luxury-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: #eee;
        }

        /* --- SKELETON STYLES --- */
        .skeleton-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
          height: 100%;
        }
        .skeleton-image { height: 240px; background: #f0f0f0; }
        .skeleton-content { padding: 20px; }
        .skeleton-line { height: 10px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; }
        .skeleton-price { height: 20px; background: #f0f0f0; border-radius: 4px; margin-top: 15px; }

        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* --- IMAGE & HOVER --- */
        .image-wrapper {
          position: relative;
          height: 240px;
          background: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .product-img { width: 80%; transition: transform 0.6s ease; }
        .product-luxury-card:hover .product-img { transform: scale(1.1); }

        .quick-actions {
          position: absolute; right: -50px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 10px; transition: all 0.3s ease;
        }
        .product-luxury-card:hover .quick-actions { right: 15px; }
        
        .action-btn {
          width: 40px; height: 40px; background: #fff; border: none; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.2s;
        }
        .action-btn:hover { background: #CC6600; color: #fff; }

        /* --- CONTENT & TYPOGRAPHY --- */
        .content-wrapper { padding: 20px; }
        .category-tag { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 1px; font-weight: 700; }
        .product-name {
          font-size: 1.1rem; font-weight: 700; color: #111; text-decoration: none !important;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          min-height: 2.8rem; transition: 0.2s;
        }
        .product-name:hover { color: #CC6600; }

        .price-container { display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px; }
        .current-price { font-size: 1.25rem; font-weight: 900; color: #111; }
        .old-price { font-size: 0.9rem; text-decoration: line-through; color: #bbb; }

        .buy-now-btn {
          width: 100%; background: #111; color: #fff; border: none; padding: 12px;
          border-radius: 12px; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;
          transition: 0.3s; opacity: 0; transform: translateY(10px);
        }
        .product-luxury-card:hover .buy-now-btn { opacity: 1; transform: translateY(0); }
        .buy-now-btn:hover { background: #CC6600; box-shadow: 0 8px 20px rgba(204, 102, 0, 0.3); }

        .badge-sale { background: #CC6600; color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 50px; font-weight: 800; }
        .badge-new { background: #111; color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 50px; font-weight: 800; }
      `}</style>
    </div>
  );
}
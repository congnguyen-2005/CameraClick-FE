"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, PackageX, CheckCircle2, ArrowRight } from "lucide-react";

export default function ProductSection({ title, products, link }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!products || products.length === 0 || !mounted) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <section className="container mb-5 py-4">
      {/* 1. Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3" 
           style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <h4 className="m-0 text-uppercase d-flex align-items-center gap-3" 
            style={{ fontWeight: 900, letterSpacing: "2px", color: "#111" }}>
          <span style={{
            width: "4px",
            height: "24px",
            backgroundColor: "#CC6600",
            borderRadius: "10px"
          }}></span>
          {title}
        </h4>
        {link && (
          <Link href={link} className="text-decoration-none small fw-bold text-muted d-flex align-items-center gap-1 transition-all explorer-link"
                style={{ fontSize: "0.8rem" }}>
            KHÁM PHÁ <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* 2. Grid Sản phẩm */}
      <div className="row g-4">
        {products.map((p) => {
          let stockQty = p.product_store?.qty !== undefined ? Number(p.product_store.qty) : Number(p.stock || 0);
          const isOutOfStock = stockQty <= 0;
          
          // QUÉT GIÁ SALE
          const hasSale = p.price_sale && Number(p.price_sale) > 0 && Number(p.price_sale) < Number(p.price_buy);
          const currentPrice = hasSale ? p.price_sale : p.price_buy;
          const discountPercent = hasSale ? Math.round((1 - p.price_sale / p.price_buy) * 100) : 0;

          return (
            <div className="col-6 col-md-4 col-lg-3" key={p.id}>
              <div className="luxury-card h-100 position-relative d-flex flex-column">
                
                {/* ẢNH & OVERLAY */}
                <div className="img-wrapper position-relative overflow-hidden" 
                     style={{ 
                        aspectRatio: "1/1", 
                        backgroundColor: "#f9f9f9", 
                        borderRadius: "20px 20px 0 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                     }}>
                  <Link href={`/product/${p.slug || p.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <img
                      src={p.thumbnail ? (p.thumbnail.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p.thumbnail}`) : "/no-image.jpg"}
                      alt={p.name}
                      className={`product-img ${isOutOfStock ? 'grayscale-img' : ''}`}
                      style={{ 
                        maxWidth: "85%", 
                        maxHeight: "85%", 
                        objectFit: "contain", 
                        transition: "transform 0.6s ease" 
                      }}
                    />
                  </Link>

                  {/* Badge Luxury / Sale */}
                  {hasSale && !isOutOfStock && (
                    <div className="badge-premium">SALE {discountPercent}%</div>
                  )}
                  
                  {isOutOfStock && (
                    <div className="stock-overlay">
                      <span className="badge-out">HẾT HÀNG</span>
                    </div>
                  )}

                  {!isOutOfStock && (
                    <button className="quick-buy-btn shadow-lg" title="Thêm vào giỏ hàng">
                       <ShoppingBag size={18} />
                    </button>
                  )}
                </div>

                {/* THÔNG TIN SẢN PHẨM */}
                <div className="p-3 d-flex flex-column flex-grow-1" 
                     style={{ border: "1px solid #f0f0f0", borderTop: "none", borderRadius: "0 0 20px 20px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 800, color: "#adb5bd", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    {p.category?.name || "ALPHA SERIES"}
                  </span>
                  
                  <h6 className="mt-1 mb-2 product-title-custom">
                    <Link href={`/product/${p.slug || p.id}`} className="text-decoration-none text-dark">
                       {p.name}
                    </Link>
                  </h6>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    {isOutOfStock ? (
                      <span className="status-tag status-warning">
                        <PackageX size={12} /> Tạm hết
                      </span>
                    ) : (
                      <span className="status-tag status-success">
                        <CheckCircle2 size={12} /> Sẵn sàng ({stockQty})
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    {hasSale ? (
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>
                          {formatPrice(p.price_buy)}
                        </span>
                        <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#dc3545" }}>
                          {formatPrice(p.price_sale)}
                        </span>
                      </div>
                    ) : (
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: "10px", color: "#999" }}>Giá niêm yết:</span>
                        <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#111" }}>
                          {formatPrice(p.price_buy)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .luxury-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          background: #fff;
        }
        .luxury-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .luxury-card:hover .product-img {
          transform: scale(1.1);
        }
        .product-title-custom {
          font-size: 0.95rem;
          font-weight: 700;
          height: 2.6rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.3;
        }
        .product-title-custom a:hover {
          color: #CC6600 !important;
        }
        .badge-premium {
          position: absolute;
          top: 15px; left: 15px;
          background: #dc3545; color: #fff;
          font-size: 10px; font-weight: 800;
          padding: 4px 12px; border-radius: 50px;
          z-index: 5;
        }
        .stock-overlay {
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center;
          z-index: 4;
        }
        .badge-out {
          background: #111; color: #fff;
          font-size: 11px; font-weight: 700;
          padding: 8px 18px; border-radius: 50px;
        }
        .quick-buy-btn {
          position: absolute; bottom: -60px; right: 15px;
          width: 46px; height: 46px; border-radius: 16px;
          background: #111; color: #fff; border: none;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s ease;
          z-index: 6;
        }
        .luxury-card:hover .quick-buy-btn {
          bottom: 15px;
        }
        .quick-buy-btn:hover {
          background: #CC6600;
          transform: scale(1.1);
        }
        .grayscale-img {
          filter: grayscale(100%);
          opacity: 0.5;
        }
        .status-tag {
          font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 6px;
          display: flex; align-items: center; gap: 6px;
          text-transform: uppercase;
        }
        .status-success { color: #2ecc71; background: rgba(46, 204, 113, 0.1); }
        .status-warning { color: #f39c12; background: rgba(243, 156, 18, 0.1); }
        .explorer-link:hover { color: #CC6600 !important; transform: translateX(5px); }
      `}</style>
    </section>
  );
}
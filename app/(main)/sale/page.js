"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ShoppingBag, Percent, Timer, Flame, Clock, Grid, Camera } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/product.css";
import ProductService from "../../services/productService";

// --- COMPONENT ĐẾM NGƯỢC ---
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(endDate).getTime();
      const distance = target - now;
      if (distance < 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        expired: false
      });
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) return <div className="badge bg-secondary rounded-pill">Kết thúc</div>;

  return (
    <div className="countdown-wrapper d-flex align-items-center gap-1 fw-bold">
      <div className="time-box">{timeLeft.days}d</div>
      <span>:</span>
      <div className="time-box">{timeLeft.hours.toString().padStart(2, '0')}</div>
      <span>:</span>
      <div className="time-box">{timeLeft.minutes.toString().padStart(2, '0')}</div>
      <span>:</span>
      <div className="time-box text-warning">{timeLeft.seconds.toString().padStart(2, '0')}s</div>
    </div>
  );
};

export default function SalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api";

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setLoading(true);
        const res = await ProductService.getSaleProducts();
        // Giả sử API trả về mảng sản phẩm trong res.data.data hoặc res.data
        const data = res.data?.data || res.data || [];
        setProducts(data);
      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleProducts();
  }, []);

  // Tự động phân tách danh mục từ dữ liệu trả về (Máy ảnh, Mirrorless, v.v.)
  const categories = useMemo(() => {
    const uniqueCats = new Set(products.map(p => p.category_name).filter(Boolean));
    return ["all", ...Array.from(uniqueCats)];
  }, [products]);

  // Lọc sản phẩm theo Category được chọn
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter(p => p.category_name === activeTab);
  }, [activeTab, products]);

  const mainSaleName = products.length > 0 ? products[0].sale_name : "Chương trình khuyến mãi";

  return (
    <div className="product-page-theme min-vh-100 pb-5 bg-light">
      
      {/* HERO BANNER */}
      <div className="sale-hero py-5 mb-4" style={{ background: "linear-gradient(135deg, #050505 0%, #121212 100%)", borderBottom: "3px solid #CC6600" }}>
        <div className="container text-center text-white">
          <div className="d-inline-flex align-items-center bg-warning text-dark px-3 py-1 rounded-pill mb-3 fw-bold small shadow">
            <Flame size={14} className="me-2" /> KHUYẾN MÃI GIỚI HẠN
          </div>
          <h1 className="display-5 fw-black mb-2 text-uppercase ls-2">
            {mainSaleName}
          </h1>
          <p className="opacity-50 lead small text-uppercase ls-1">Sở hữu ngay thiết bị Alpha với mức giá đặc quyền</p>
        </div>
      </div>

      <div className="container">
        {/* THANH PHÂN LOẠI DANH MỤC (CATEGORY TABS) */}
        <div className="d-flex justify-content-center mb-5">
            <div className="bg-white p-2 rounded-pill shadow-sm border d-inline-flex gap-1 overflow-auto max-w-100">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`btn rounded-pill px-4 py-2 fw-bold text-uppercase transition-all ls-1 ${
                            activeTab === cat ? "btn-dark shadow" : "btn-light text-muted border-0"
                        }`}
                        style={{ fontSize: "11px", whiteSpace: "nowrap" }}
                    >
                        {cat === "all" ? "Tất cả Deal" : cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div className="d-flex align-items-center">
            <Camera size={20} className="me-2 text-dark" />
            <h5 className="fw-bold m-0 text-uppercase ls-1">
              {activeTab === "all" ? "Mọi sản phẩm sale" : `Danh mục: ${activeTab}`}
            </h5>
          </div>
          <div className="small fw-bold text-muted">
            HIỂN THỊ {filteredProducts.length} KẾT QUẢ
          </div>
        </div>

        {/* DANH SÁCH SẢN PHẨM */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-5">
                <div className="spinner-border text-dark spinner-border-sm"></div>
                <p className="mt-2 text-muted x-small fw-bold ls-1">ĐANG TẢI ƯU ĐÃI...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div className="col-6 col-md-4 col-xl-3" key={p.id}>
                <div className="product-card-luxury h-100 shadow-sm overflow-hidden d-flex flex-column bg-white position-relative border-0 rounded-4">
                  
                  {/* Countdown Overlay */}
                  <div className="countdown-overlay shadow-sm">
                    <Clock size={12} className="me-1 text-warning" />
                    <CountdownTimer endDate={p.date_end} />
                  </div>

                  <div className="image-container bg-light position-relative" style={{ aspectRatio: '1/1' }}>
                    <Link href={`/product/${p.slug || p.id}`}>
                      <img
                        src={p.thumbnail ? (p.thumbnail.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p.thumbnail}`) : "/no-image.jpg"}
                        alt={p.name}
                        className="img-fluid main-img p-4 h-100 w-100 object-fit-contain"
                      />
                    </Link>
                    <div className="badge-percent-luxury">
                      -{Math.round(100 - (p.price_sale / p.price_buy) * 100)}%
                    </div>
                  </div>

                  <div className="card-body p-3 d-flex flex-column flex-grow-1">
                    <div className="mb-1">
                        <span className="text-warning fw-bold text-uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>
                            {p.category_name}
                        </span>
                    </div>
                    
                    <h6 className="fw-bold mb-3 product-title-limit fs-6 ls-1">
                      <Link href={`/product/${p.slug || p.id}`} className="text-dark text-decoration-none">
                        {p.name}
                      </Link>
                    </h6>

                    <div className="mt-auto">
                      <div className="d-flex flex-column mb-3">
                        <span className="text-muted text-decoration-line-through x-small">
                          {Number(p.price_buy).toLocaleString()}₫
                        </span>
                        <span className="price-text fs-5 fw-black text-danger">
                          {Number(p.price_sale).toLocaleString()}₫
                        </span>
                      </div>
                      <button className="btn btn-dark w-100 rounded-3 py-2 fw-bold border-0 shadow-sm transition-all hover-scale">
                        SĂN DEAL NGAY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted ls-1 small fw-bold">HIỆN KHÔNG CÓ SẢN PHẨM SALE TRONG DANH MỤC NÀY.</p>
              <button onClick={() => setActiveTab("all")} className="btn btn-dark btn-sm rounded-pill px-4">QUAY LẠI TẤT CẢ</button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .countdown-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 10px;
          border-radius: 50px;
          z-index: 10;
          font-size: 10px;
          display: flex;
          align-items: center;
          backdrop-filter: blur(4px);
        }
        .badge-percent-luxury {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #CC6600;
          color: white;
          font-weight: 900;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .time-box { min-width: 12px; text-align: center; }
        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .x-small { font-size: 10px; }
        .hover-scale:hover { transform: translateY(-2px); background: #CC6600 !important; }
        .transition-all { transition: all 0.3s ease; }
        .product-card-luxury { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .product-card-luxury:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}
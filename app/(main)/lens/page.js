"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  ShoppingBag, ChevronRight, SlidersHorizontal, 
  PackageX, CheckCircle2, Star, Maximize2, Loader2 
} from "lucide-react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import FsLightbox from "fslightbox-react"; 
import ProductService from "../../services/productService";
import CartService from "../../services/cartService";
import { useRouter } from "next/navigation";

export default function LensPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState({ id: 0, min: 0, max: Infinity });
  const [mounted, setMounted] = useState(false);

  // State xử lý giỏ hàng
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const [lightboxController, setLightboxController] = useState({ toggler: false, source: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api";

  const priceOptions = [
    { id: 0, label: "Tất cả mức giá", min: 0, max: Infinity },
    { id: 1, label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { id: 2, label: "10 – 30 triệu", min: 10000000, max: 30000000 },
    { id: 3, label: "Trên 30 triệu", min: 30000000, max: Infinity },
  ];

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await ProductService.getAll();
        const allData = res.data.data || [];
        // Lọc riêng ống kính (Cate ID = 2)
        const lensData = allData.filter(p => p.category_id === 2);
        setProducts(lensData);
      } catch (err) {
        console.error("Lỗi fetch ống kính:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HÀM ĐỊNH DẠNG GIÁ CHUẨN ---
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + "₫";
  };

  // --- LOGIC THÊM GIỎ HÀNG ---
  const handleAddToCart = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      router.push("/login");
      return;
    }

    setAddingId(p.id);
    try {
      await CartService.add({
        product_id: p.id,
        qty: 1
      });

      setSuccessId(p.id);
      window.dispatchEvent(new Event("storage")); // Cập nhật Header
      
      setTimeout(() => setSuccessId(null), 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi thêm giỏ hàng");
    } finally {
      setAddingId(null);
    }
  };

  const openLightbox = (imgSource) => {
    if (!imgSource || imgSource.includes("no-image.jpg")) return;
    setLightboxController({ toggler: !lightboxController.toggler, source: imgSource });
  };

  const filteredProducts = products.filter((p) => {
    const currentPrice = (p.price_sale && p.price_sale > 0) ? p.price_sale : p.price_buy;
    return currentPrice >= priceFilter.min && currentPrice <= priceFilter.max;
  });

  if (!mounted) return null;

  return (
    <div className="bg-light min-vh-100 pb-5 font-sans text-start">
      {/* 1. HERO & BREADCRUMB */}
      <div className="bg-white border-bottom py-4 mb-4">
        <div className="container">
          <nav className="mb-3">
            <ol className="breadcrumb small text-uppercase ls-1 m-0">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Trang chủ</Link></li>
              <li className="breadcrumb-item active text-dark fw-bold">Ống kính (Lens)</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-end mt-3">
            <div>
              <h1 className="display-6 fw-black text-dark mb-0 text-uppercase ls-1">Hệ thống ống kính Sony</h1>
              <p className="text-muted mt-2 mb-0">Độ phân giải vượt trội và hiệu ứng bokeh tuyệt đẹp.</p>
            </div>
            <div className="d-none d-md-block text-end">
                <span className="badge-luxury">{filteredProducts.length} Sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-2">
        <div className="row g-4">
          {/* 2. SIDEBAR FILTER */}
          <aside className="col-lg-3">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="filter-sidebar p-4 shadow-sm bg-white rounded-5 border-0">
                <div className="d-flex align-items-center mb-4 text-dark border-bottom pb-3">
                  <SlidersHorizontal size={18} className="me-2 text-warning" />
                  <h6 className="fw-bold mb-0 text-uppercase ls-1">Bộ lọc thông minh</h6>
                </div>

                <div className="filter-section mb-4">
                  <label className="text-muted x-small text-uppercase fw-bold ls-1 mb-3 d-block">Khoảng giá</label>
                  <div className="price-list">
                    {priceOptions.map((p) => (
                      <div 
                        key={p.id} 
                        className={`price-item ${priceFilter.id === p.id ? 'active' : ''}`}
                        onClick={() => setPriceFilter(p)}
                      >
                        <span className="dot"></span>
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="promo-card-luxury p-3 rounded-4 mt-5">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Star size={16} fill="#CC6600" color="#CC6600" />
                    <span className="fw-bold small text-white uppercase ls-1">Đặc quyền Alpha</span>
                  </div>
                  <p className="extra-small m-0 text-white-50">Tặng kèm kính lọc UV Carl Zeiss cho đơn hàng trên 20 triệu.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* 3. LENS GRID */}
          <main className="col-lg-9">
            <div className="row g-4">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div className="col-6 col-md-4" key={i}>
                    <div className="skeleton-card shimmer rounded-5" style={{ height: '400px' }}></div>
                  </div>
                ))
              ) : (
                filteredProducts.map((p) => {
                  const stockQty = p.product_store?.qty ?? p.stock ?? 0;
                  const isOutOfStock = stockQty <= 0;
                  const hasSale = p.price_sale > 0 && p.price_sale < p.price_buy;
                  const currentPrice = hasSale ? p.price_sale : p.price_buy;
                  
                  const thumb = p.thumbnail 
                    ? (p.thumbnail.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p.thumbnail}`) 
                    : "/no-image.jpg";

                  return (
                    <div className="col-6 col-md-4" key={p.id}>
                      <div className={`luxury-card h-100 ${isOutOfStock ? 'is-soldout' : ''}`}>
                        
                        {/* ẢNH CĂN GIỮA TUYỆT ĐỐI */}
                        <div className="img-container-luxury">
                          <Link href={`/product/${p.slug || p.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center p-3">
                            <img
                              src={thumb}
                              alt={p.name}
                              className="img-main-centered"
                            />
                          </Link>

                        
                          
                          {hasSale && !isOutOfStock && <div className="badge-luxury-sale">-{Math.round((1 - p.price_sale/p.price_buy)*100)}%</div>}
                          {isOutOfStock && (
                            <div className="soldout-overlay">
                               <span className="badge-soldout">HẾT HÀNG</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-white flex-grow-1 d-flex flex-column text-start">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="cat-tag-luxury">SONY LENS</small>
                            <div className="d-flex align-items-center gap-1">
                                <Star size={10} fill="#FFB400" color="#FFB400" />
                                <span className="x-small fw-bold">4.9</span>
                             </div>
                          </div>
                          <h6 className="product-title-luxury">
                            <Link href={`/product/${p.slug || p.id}`} className="text-dark text-decoration-none">
                              {p.name}
                            </Link>
                          </h6>

                          <div className="mt-auto pt-3 d-flex flex-column">
                            <div className="mb-3">
                                {isOutOfStock ? (
                                  <span className="status-tag out">Tạm hết hàng</span>
                                ) : (
                                  <span className="status-tag in">Sẵn kho: {stockQty}</span>
                                )}
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="price-group-luxury">
                                {hasSale ? (
                                  <>
                                    <div className="price-old-mini">{formatPrice(p.price_buy)}</div>
                                    <div className="price-main-luxury text-danger">{formatPrice(p.price_sale)}</div>
                                  </>
                                ) : (
                                  <div className="price-main-luxury">{formatPrice(p.price_buy)}</div>
                                )}
                              </div>
                              
                              <button 
                                className={`btn-cart-luxury ${isOutOfStock ? 'disabled' : ''} ${successId === p.id ? 'btn-success-anim' : ''}`} 
                                disabled={isOutOfStock || addingId === p.id}
                                onClick={(e) => handleAddToCart(e, p)}
                              >
                                {addingId === p.id ? <Loader2 size={18} className="animate-spin" /> : 
                                 successId === p.id ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} strokeWidth={2.5} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>

      <FsLightbox toggler={lightboxController.toggler} sources={[lightboxController.source]} />

      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .ls-2 { letter-spacing: 2px; }
        .x-small { font-size: 0.7rem; }
        
        .badge-luxury { background: #111; color: white; padding: 8px 16px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; }

        /* FILTER */
        .price-list { display: flex; flex-direction: column; gap: 8px; }
        .price-item { padding: 10px 15px; border-radius: 12px; font-size: 0.9rem; color: #666; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 12px; }
        .price-item:hover { background: #f8f9fa; color: #000; }
        .price-item.active { background: #111; color: #fff; font-weight: bold; }
        .price-item .dot { width: 6px; height: 6px; border-radius: 50%; background: #CC6600; opacity: 0; }
        .price-item.active .dot { opacity: 1; }
        .promo-card-luxury { background: #111; border-left: 4px solid #CC6600; }

        /* CARD */
        .luxury-card { background: white; border-radius: 28px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; transition: 0.4s; display: flex; flex-direction: column; }
        .luxury-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }

        /* ẢNH CĂN GIỮA */
        .img-container-luxury { aspect-ratio: 1/1; background: #fdfdfd; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .img-main-centered { max-width: 85%; max-height: 85%; object-fit: contain; transition: 0.6s; }
        .luxury-card:hover .img-main-centered { transform: scale(1.1); }

        .btn-cart-luxury { width: 46px; height: 46px; background: #111; color: #fff; border: none; border-radius: 15px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .btn-cart-luxury:hover { background: #CC6600; transform: scale(1.1); }
        .btn-cart-luxury.btn-success-anim { background: #198754 !important; }
        .btn-cart-luxury.disabled { background: #eee; color: #ccc; cursor: not-allowed; }

        .product-title-luxury { font-size: 0.95rem; font-weight: 700; height: 2.6rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-top: 8px; }
        .price-main-luxury { font-size: 1.15rem; font-weight: 900; color: #111; }
        .price-old-mini { font-size: 0.75rem; color: #999; text-decoration: line-through; }
        
        .status-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .status-tag.in { color: #2ecc71; }
        .status-tag.out { color: #e67e22; }

        .badge-luxury-sale { position: absolute; top: 15px; left: 15px; background: #dc3545; color: #fff; font-size: 10px; padding: 4px 10px; border-radius: 50px; font-weight: 800; z-index: 5; }
        .soldout-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
        .badge-soldout { background: #111; color: #fff; padding: 8px 16px; border-radius: 50px; font-size: 10px; font-weight: 800; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, ChevronRight, PackageX, CheckCircle2, 
  SlidersHorizontal, ArrowRight, Star, Loader2
} from "lucide-react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductService from "../../services/productService";
import CartService from "../../services/cartService";
import { useRouter } from "next/navigation";

export default function AccessoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState({ id: 0, min: 0, max: Infinity });
  const [mounted, setMounted] = useState(false);

  // State xử lý giỏ hàng
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api";

  const priceOptions = [
    { id: 0, label: "Tất cả mức giá", min: 0, max: Infinity },
    { id: 1, label: "Dưới 1 triệu", min: 0, max: 1000000 },
    { id: 2, label: "1 – 5 triệu", min: 1000000, max: 5000000 },
    { id: 3, label: "Trên 5 triệu", min: 5000000, max: Infinity },
  ];

  useEffect(() => {
    setMounted(true);
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        const res = await ProductService.getAll();
        const allData = res.data.data || [];
        // Lọc sản phẩm có Category ID = 3 (Phụ kiện)
        const accessoryData = allData.filter(p => p.category_id === 3);
        setProducts(accessoryData);
      } catch (err) {
        console.error("Lỗi fetch phụ kiện:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  // --- HÀM ĐỊNH DẠNG GIÁ ---
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + "₫";
  };

  // --- LOGIC THÊM GIỎ HÀNG ---
  const handleAddToCart = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để mua phụ kiện");
      router.push("/login");
      return;
    }

    setAddingId(p.id);
    try {
      await CartService.add({ product_id: p.id, qty: 1 });
      setSuccessId(p.id);
      window.dispatchEvent(new Event("storage")); // Thông báo Header cập nhật số lượng
      setTimeout(() => setSuccessId(null), 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi thêm giỏ hàng");
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const currentPrice = (p.price_sale && p.price_sale > 0) ? p.price_sale : p.price_buy;
    return currentPrice >= priceFilter.min && currentPrice <= priceFilter.max;
  });

  if (!mounted) return null;

  return (
    <div className="bg-light min-vh-100 pb-5 font-sans text-start">
      {/* 1. HERO & BREADCRUMB */}
      <div className="bg-white border-bottom py-4 mb-4 shadow-sm">
        <div className="container">
          <nav className="mb-3">
            <ol className="breadcrumb small text-uppercase ls-1 m-0">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Alpha</Link></li>
              <li className="breadcrumb-item active text-dark fw-bold">Phụ kiện & Hỗ trợ</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-end mt-3">
            <div>
              <h1 className="display-6 fw-black text-dark mb-0 text-uppercase ls-1">Hệ sinh thái Phụ kiện</h1>
              <p className="text-muted mt-2 mb-0">Pin, thẻ nhớ, chân máy và thiết bị âm thanh chuyên dụng.</p>
            </div>
            <div className="d-none d-md-block text-end">
               <span className="badge-total">{filteredProducts.length} Mẫu mã</span>
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
                  <h6 className="fw-bold mb-0 text-uppercase ls-1">Lọc theo ngân sách</h6>
                </div>

                <div className="price-filter-list">
                  {priceOptions.map((p) => (
                    <button 
                      key={p.id} 
                      onClick={() => setPriceFilter(p)}
                      className={`btn-filter-luxury ${priceFilter.id === p.id ? 'active' : ''}`}
                    >
                      <span className="dot"></span>
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="promo-card-mini rounded-4 p-3 mt-5">
                   <div className="d-flex align-items-center gap-2 mb-2">
                      <Star size={14} fill="#CC6600" color="#CC6600" />
                      <span className="fw-bold x-small uppercase text-white ls-1">Chính hãng Sony</span>
                   </div>
                   <p className="extra-small m-0 text-white-50">Tất cả phụ kiện được bảo hành 12 tháng 1 đổi 1 nếu có lỗi.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* 3. PRODUCT GRID */}
          <main className="col-lg-9">
            <div className="row g-4">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div className="col-6 col-md-4" key={i}>
                    <div className="skeleton-card shimmer rounded-5" style={{ height: '380px' }}></div>
                  </div>
                ))
              ) : (
                filteredProducts.map((p) => {
                  const stockQty = p.product_store?.qty ?? p.stock ?? 0;
                  const isOutOfStock = stockQty <= 0;
                  const hasSale = p.price_sale > 0 && p.price_sale < p.price_buy;
                  const thumb = p.thumbnail 
                    ? (p.thumbnail.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p.thumbnail}`) 
                    : "/no-image.jpg";

                  return (
                    <div className="col-6 col-md-4" key={p.id}>
                      <div className={`luxury-product-card h-100 ${isOutOfStock ? 'is-soldout' : ''}`}>
                        
                        {/* ẢNH CĂN GIỮA - FIX UI */}
                        <div className="img-container-luxury">
                          <Link href={`/product/${p.slug || p.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center p-3">
                            <img src={thumb} alt={p.name} className="img-main-centered" />
                          </Link>

                          {isOutOfStock && (
                            <div className="soldout-overlay">
                               <span className="badge-out">TẠM HẾT</span>
                            </div>
                          )}
                          {hasSale && !isOutOfStock && <div className="badge-sale-luxury">PROMO</div>}
                        </div>

                        <div className="p-4 bg-white flex-grow-1 d-flex flex-column">
                          <span className="cat-tag-luxury">GENUINE ACCESSORY</span>
                          <h6 className="product-title-luxury mt-2">
                            <Link href={`/product/${p.slug || p.id}`} className="text-dark text-decoration-none fw-bold">
                              {p.name}
                            </Link>
                          </h6>

                          <div className="mt-auto pt-3 d-flex flex-column">
                            <div className="mb-3">
                              {isOutOfStock ? (
                                <span className="status-tag-out">Hết hàng</span>
                              ) : (
                                <span className="status-tag-in">Sẵn có: {stockQty}</span>
                              )}
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="price-group">
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
            
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-5 bg-white rounded-5 mt-4 border border-secondary border-opacity-10 shadow-sm">
                <PackageX size={48} className="text-muted opacity-25 mb-3" />
                <h5 className="fw-bold">Không tìm thấy phụ kiện</h5>
                <p className="text-muted small">Vui lòng chọn khoảng giá khác.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .x-small { font-size: 0.7rem; }
        .badge-total { background: #111; color: white; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; }

        /* FILTER */
        .btn-filter-luxury {
          width: 100%; background: transparent; border: none; text-align: left; padding: 10px 15px; border-radius: 12px;
          font-size: 0.85rem; color: #666; transition: 0.3s; display: flex; align-items: center; gap: 12px; font-weight: 600;
        }
        .btn-filter-luxury:hover { background: #f8f9fa; color: #000; }
        .btn-filter-luxury.active { background: #111; color: white; }
        .btn-filter-luxury .dot { width: 6px; height: 6px; border-radius: 50%; background: #CC6600; opacity: 0; }
        .btn-filter-luxury.active .dot { opacity: 1; }
        .promo-card-mini { background: #111; border-left: 3px solid #CC6600; }

        /* PRODUCT CARD */
        .luxury-product-card { background: white; border-radius: 28px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; transition: 0.4s; display: flex; flex-direction: column; }
        .luxury-product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

        /* ẢNH CĂN GIỮA */
        .img-container-luxury { aspect-ratio: 1/1; background: #fdfdfd; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .img-main-centered { max-width: 85%; max-height: 85%; width: auto; height: auto; object-fit: contain; transition: 0.6s; }
        .luxury-product-card:hover .img-main-centered { transform: scale(1.1); }

        .cat-tag-luxury { font-size: 9px; font-weight: 800; color: #adb5bd; letter-spacing: 1.5px; text-transform: uppercase; }
        .product-title-luxury { height: 2.8rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

        .price-main-luxury { font-size: 1.2rem; font-weight: 900; color: #111; }
        .price-old-mini { font-size: 0.75rem; color: #999; text-decoration: line-through; }
        
        .status-tag-in { font-size: 10px; font-weight: 800; color: #2ecc71; text-transform: uppercase; }
        .status-tag-out { font-size: 10px; font-weight: 800; color: #e67e22; text-transform: uppercase; }

        .btn-cart-luxury { width: 44px; height: 44px; background: #111; color: #fff; border: none; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .btn-cart-luxury:hover { background: #CC6600; transform: scale(1.1); }
        .btn-cart-luxury.btn-success-anim { background: #198754 !important; }
        .btn-cart-luxury.disabled { background: #eee; color: #ccc; cursor: not-allowed; }

        .badge-sale-luxury { position: absolute; top: 15px; left: 15px; background: #CC6600; color: #fff; font-size: 9px; padding: 3px 10px; border-radius: 4px; font-weight: 800; z-index: 5; }
        .soldout-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
        .badge-out { background: #111; color: #fff; padding: 6px 15px; border-radius: 50px; font-weight: 700; font-size: 10px; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shimmer { background: linear-gradient(90deg, #f2f2f2 25%, #fafafa 50%, #f2f2f2 75%); background-size: 200% 100%; animation: loading 1.5s infinite linear; }
        @keyframes loading { to { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}
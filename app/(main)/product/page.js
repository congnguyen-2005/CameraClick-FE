"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, ChevronRight, PackageX, CheckCircle2, 
  SlidersHorizontal, Star, ArrowRight, Maximize2, Loader2
} from "lucide-react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import FsLightbox from "fslightbox-react"; 
import ProductService from "../../services/productService";
import CartService from "../../services/cartService";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

  // LOGIC THÊM VÀO GIỎ HÀNG: Trạng thái xử lý cho từng sản phẩm
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  // State cho Lightbox
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    source: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Cấu hình các mức giá lọc
  const priceFilters = [
    { label: "Tất cả mức giá", min: 0, max: Infinity },
    { label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { label: "10 - 30 triệu", min: 10000000, max: 30000000 },
    { label: "30 - 60 triệu", min: 30000000, max: 60000000 },
    { label: "Trên 60 triệu", min: 60000000, max: Infinity },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await ProductService.getAll();
        const allData = res.data.data || [];
        setProducts(allData);
        
        // Trích xuất danh mục (Sony, Canon, Mirrorless...) từ dữ liệu trả về
        const cats = allData
          .map(p => ({ id: p.category_id, name: p.category?.name }))
          .filter((v, i, a) => v.name && a.findIndex(x => x.id === v.id) === i);
        setCategories(cats);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      router.push("/login");
      return;
    }

    setAddingId(p.id);
    try {
      await CartService.add({
        product_id: p.id,
        qty: 1
      });

      // Hiệu ứng thành công
      setSuccessId(p.id);
      
      // Dispatch sự kiện cập nhật giỏ hàng cho Header
      window.dispatchEvent(new Event("storage"));
      
      setTimeout(() => {
        setSuccessId(null);
      }, 2000);

    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      alert(error.response?.data?.message || "Không thể thêm sản phẩm vào giỏ hàng");
    } finally {
      setAddingId(null);
    }
  };

  const openLightbox = (imgSource) => {
    if (!imgSource || imgSource.includes("undefined") || imgSource.includes("no-image.jpg")) {
      return;
    }
    setLightboxController({
      toggler: !lightboxController.toggler,
      source: imgSource,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const calculateDiscount = (original, sale) => {
    if (!sale || sale <= 0) return null;
    return Math.round((1 - (sale / original)) * 100);
  };

  // LOGIC LỌC SẢN PHẨM TỔNG HỢP
  const filteredProducts = products.filter((p) => {
    const matchesCategory = !activeCategory || p.category_id === activeCategory;
    const currentPrice = (p.price_sale && p.price_sale > 0) ? p.price_sale : p.price_buy;
    const matchesPrice = !priceRange || (currentPrice >= priceRange.min && currentPrice <= priceRange.max);
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="bg-light min-vh-100 pb-5 font-sans">
      {/* 1. THANH ĐIỀU HƯỚNG PHỤ */}
      <div className="bg-white border-bottom py-4 mb-4 shadow-sm">
        <div className="container">
          <nav className="mb-2">
            <ol className="breadcrumb small text-uppercase ls-1 m-0">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Trang chủ</Link></li>
              <li className="breadcrumb-item active text-dark fw-bold">Bộ sưu tập</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-end mt-3">
            <div className="text-start">
              <h1 className="display-6 fw-black text-dark mb-0 text-uppercase ls-1">Hệ sinh thái Alpha</h1>
              <p className="text-muted mt-2 mb-0">Thiết bị ghi hình chuyên nghiệp Canon, Sony, Mirrorless...</p>
            </div>
            <div className="d-none d-md-block">
              <span className="badge-total">{filteredProducts.length} Sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          
          {/* 2. SIDEBAR BỘ LỌC - ĐẦY ĐỦ */}
          <aside className="col-lg-3">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="bg-white p-4 rounded-4 shadow-sm border-0">
                <div className="d-flex align-items-center mb-4 text-dark border-bottom pb-3">
                  <SlidersHorizontal size={18} className="me-2 text-warning" />
                  <h6 className="fw-bold mb-0 text-uppercase ls-1 text-start">Bộ lọc thiết bị</h6>
                </div>

                {/* DANH MỤC: Mirrorless, Sony, Canon... */}
                <div className="mb-4 text-start">
                  <label className="text-muted x-small text-uppercase fw-bold ls-1 mb-3 d-block">Danh mục sản phẩm</label>
                  <div className="d-flex flex-column gap-2">
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className={`btn-filter-luxury ${!activeCategory ? 'active' : ''}`}
                    >
                      <span className="dot"></span> Tất cả sản phẩm
                    </button>
                    {categories.map(c => (
                      <button 
                        key={c.id}
                        onClick={() => setActiveCategory(c.id)}
                        className={`btn-filter-luxury ${activeCategory === c.id ? 'active' : ''}`}
                      >
                        <span className="dot"></span> {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KHOẢNG GIÁ */}
                <div className="mb-4 border-top pt-4 text-start">
                  <label className="text-muted x-small text-uppercase fw-bold ls-1 mb-3 d-block">Khoảng giá đầu tư</label>
                  <div className="d-flex flex-column gap-2">
                    {priceFilters.map((filter, index) => (
                      <button
                        key={index}
                        onClick={() => setPriceRange(filter.min === 0 && filter.max === Infinity ? null : filter)}
                        className={`btn-filter-luxury ${
                          (priceRange?.label === filter.label) || (!priceRange && filter.max === Infinity && filter.min === 0) ? 'active' : ''
                        }`}
                      >
                        <span className="dot"></span> {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ĐẶC QUYỀN */}
                <div className="pt-4 border-top text-start">
                  <label className="text-muted x-small text-uppercase fw-bold ls-1 mb-3 d-block">Đặc quyền Alpha</label>
                  <ul className="list-unstyled small d-flex flex-column gap-3 text-dark">
                    <li className="d-flex align-items-center"><CheckCircle2 size={14} className="text-success me-2"/> Bảo hành chính hãng 2 năm</li>
                    <li className="d-flex align-items-center"><CheckCircle2 size={14} className="text-success me-2"/> Trả góp 0% lãi suất</li>
                    <li className="d-flex align-items-center"><CheckCircle2 size={14} className="text-success me-2"/> Vệ sinh máy định kỳ free</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>

          {/* 3. DANH SÁCH SẢN PHẨM */}
          <main className="col-lg-9">
            <div className="row g-4">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="skeleton-card shimmer rounded-4"></div>
                  </div>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  let stockQty = p.product_store?.qty ?? p.stock ?? 0;
                  const isOutOfStock = stockQty <= 0;
                  const hasSale = p.price_sale && parseFloat(p.price_sale) > 0;
                  const discountPercent = calculateDiscount(p.price_buy, p.price_sale);
                  const thumb = p.thumbnail 
                    ? (p.thumbnail.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p.thumbnail}`) 
                    : "/no-image.jpg";

                  return (
                    <div className="col-6 col-md-4" key={p.id}>
                      <div className={`luxury-card ${isOutOfStock ? 'is-soldout' : ''}`}>
                        
                        {/* ẢNH: FIX CĂN GIỮA TUYỆT ĐỐI */}
                        <div className="card-img-container">
                          <Link href={`/product/${p.slug || p.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center p-3">
                            <img src={thumb} alt={p.name} className="img-main-luxury" />
                          </Link>
                          
                          {/* OVERLAY HÀNH ĐỘNG NHANH */}
                          <div className="quick-action-overlay">
                              <button 
                                className="btn-circle-luxury" 
                                title="Phóng to ảnh"
                                onClick={() => openLightbox(thumb)}
                              >
                                <Maximize2 size={18} />
                              </button>
                              <button className="btn-circle-luxury" title="So sánh">
                                <SlidersHorizontal size={18} />
                              </button>
                          </div>

                          {isOutOfStock && (
                            <div className="sold-out-overlay">
                               <span className="text-uppercase fw-bold ls-2">Hết hàng</span>
                            </div>
                          )}

                          {hasSale && !isOutOfStock && (
                            <div className="badge-luxury-sale">-{discountPercent}% OFF</div>
                          )}
                        </div>

                        <div className="p-4 text-start">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                             <span className="text-warning x-small fw-bold text-uppercase ls-1">
                               {p.category?.name || "Sony Alpha"}
                             </span>
                             <div className="d-flex align-items-center gap-1">
                                <Star size={10} fill="#FFB400" color="#FFB400" />
                                <span className="x-small fw-bold">4.9</span>
                             </div>
                          </div>

                          <h6 className="product-title-luxury">
                            <Link href={`/product/${p.slug || p.id}`} className="text-dark text-decoration-none">{p.name}</Link>
                          </h6>

                          <div className="d-flex justify-content-between align-items-end mt-4">
                            <div className="price-group">
                                {hasSale ? (
                                  <>
                                    <div className="price-main text-danger">{formatPrice(p.price_sale)}</div>
                                    <div className="price-old text-muted text-decoration-line-through x-small">{formatPrice(p.price_buy)}</div>
                                  </>
                                ) : (
                                  <div className="price-main">{formatPrice(p.price_buy)}</div>
                                )}
                                <div className={`stock-status ${isOutOfStock ? 'text-danger' : 'text-success'}`}>
                                    {isOutOfStock ? 'Tạm hết hàng' : `Sẵn có: ${stockQty}`}
                                </div>
                            </div>

                            {/* NÚT THÊM VÀO GIỎ HÀNG VỚI LOGIC FULL */}
                            <button 
                              className={`btn-cart-luxury ${isOutOfStock ? 'disabled' : ''} ${successId === p.id ? 'btn-success-anim' : ''}`} 
                              disabled={isOutOfStock || addingId === p.id}
                              onClick={(e) => handleAddToCart(e, p)}
                            >
                              {addingId === p.id ? (
                                <Loader2 size={20} className="animate-spin" />
                              ) : successId === p.id ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <ShoppingBag size={20} strokeWidth={2.5} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                   <PackageX size={48} className="text-muted mb-3" />
                   <h5 className="fw-bold">Không tìm thấy sản phẩm phù hợp</h5>
                   <p className="text-muted">Vui lòng điều chỉnh lại bộ lọc giá hoặc danh mục.</p>
                </div>
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
        :root {
          --sony-orange: #CC6600;
          --premium-dark: #111111;
          --sale-red: #e63946;
        }

        .badge-total {
          background: var(--premium-dark);
          color: white; padding: 8px 16px; border-radius: 50px;
          font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        }

        .btn-filter-luxury {
          background: transparent; border: none; text-align: left;
          padding: 10px 15px; border-radius: 12px; color: #555;
          font-size: 0.9rem; transition: 0.3s; display: flex; align-items: center;
        }
        .btn-filter-luxury .dot { width: 5px; height: 5px; background: #ccc; border-radius: 50%; margin-right: 10px; transition: 0.3s; }
        .btn-filter-luxury:hover { background: #f8f9fa; color: #000; }
        .btn-filter-luxury.active { background: var(--premium-dark); color: #fff; font-weight: 700; }
        .btn-filter-luxury.active .dot { background: var(--sony-orange); box-shadow: 0 0 8px var(--sony-orange); }

        .luxury-card {
          background: #fff; border-radius: 24px; border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden; height: 100%; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: relative;
        }
        .luxury-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); }

        /* FIX ẢNH CHÍNH GIỮA TUYỆT ĐỐI */
        .card-img-container {
          position: relative; background: #fdfdfd; aspect-ratio: 1/1;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .img-main-luxury {
          max-width: 85%; max-height: 85%; width: auto; height: auto; object-fit: contain;
          transition: transform 0.6s ease;
        }
        .luxury-card:hover .img-main-luxury { transform: scale(1.1); }

        .quick-action-overlay {
          position: absolute; right: -50px; top: 20px;
          display: flex; flex-direction: column; gap: 10px; transition: 0.4s; z-index: 10;
        }
        .luxury-card:hover .quick-action-overlay { right: 20px; }

        .btn-circle-luxury {
          width: 42px; height: 42px; border-radius: 50%; background: #fff;
          border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s; color: var(--premium-dark);
        }
        .btn-circle-luxury:hover { background: var(--sony-orange); color: #fff; }

        .badge-luxury-sale {
          position: absolute; top: 15px; left: 15px; background: var(--sale-red);
          color: #fff; padding: 5px 12px; border-radius: 50px;
          font-size: 10px; font-weight: 800; text-transform: uppercase; z-index: 5;
        }

        .sold-out-overlay {
          position: absolute; inset: 0; background: rgba(255,255,255,0.7);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2;
        }

        .product-title-luxury {
          font-size: 1rem; font-weight: 700; height: 2.8rem; line-height: 1.4;
          overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        .price-main { font-size: 1.25rem; font-weight: 900; color: var(--premium-dark); }
        .stock-status { font-size: 11px; font-weight: 600; margin-top: 4px; }

        .btn-cart-luxury {
          width: 50px; height: 50px; background: var(--premium-dark);
          color: #fff; border: none; border-radius: 18px;
          display: flex; align-items: center; justify-content: center; transition: 0.3s;
        }
        .btn-cart-luxury:hover:not(:disabled) { background: var(--sony-orange); transform: scale(1.1); }
        .btn-cart-luxury.disabled { background: #eee; color: #ccc; cursor: not-allowed; }
        .btn-success-anim { background: #198754 !important; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .skeleton-card { height: 400px; background: #f2f2f2; }
        .shimmer {
          background: linear-gradient(90deg, #f2f2f2 25%, #fafafa 50%, #f2f2f2 75%);
          background-size: 200% 100%; animation: loading 1.5s infinite linear;
        }
        @keyframes loading { to { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}
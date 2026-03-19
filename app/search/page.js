"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import Link from "next/link";
import { 
  ShoppingBag, SearchX, PackageX, CheckCircle2, 
  ChevronRight, Home, Mic, MicOff, RefreshCw, Maximize2, Flame 
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import FsLightbox from "fslightbox-react"; 
import ProductService from "../services/productService";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || ""; 

  const [products, setProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]); 
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isListening, setIsListening] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lightbox, setLightbox] = useState({ toggler: false, source: "" });
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

  useEffect(() => {
    setMounted(true);
    fetchData();
    fetchSalesData(); 
  }, [keyword]);

  const fetchSalesData = async () => {
    try {
      const res = await ProductService.getSaleProducts();
      // Chấp nhận cả res.data.data hoặc res.data
      const data = res.data?.data || res.data || [];
      setSaleProducts(data.slice(0, 4)); 
    } catch (error) {
      console.error("Lỗi quét sản phẩm sale:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (keyword) {
        const res = await ProductService.getAll({ search: keyword });
        const results = res.data.data || res.data || [];
        setProducts(results);
        setActiveCategory("all"); 
        
        if (results.length === 0) {
          const recRes = await ProductService.getAll({ limit: 4 });
          setRecommendations(recRes.data.data || recRes.data || []);
        }
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC PHÂN LOẠI DANH MỤC ĐỘNG ---
  const categories = useMemo(() => {
    // Xử lý linh hoạt cả p.category.name (index) và p.category_name (sale)
    const cats = products.map(p => p.category?.name || p.category_name).filter(Boolean);
    return ["all", ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter(p => (p.category?.name || p.category_name) === activeCategory);
  }, [activeCategory, products]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Trình duyệt không hỗ trợ giọng nói.");
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      router.push(`/search?keyword=${encodeURIComponent(txt)}`);
    };
    recognition.start();
  };

  if (!mounted) return null;

  return (
    <div className="container py-5 font-sans">
      {/* 1. HEADER */}
      <div className="row align-items-end mb-4 g-3">
        <div className="col-md-8">
          <nav className="mb-2">
            <ol className="breadcrumb small text-uppercase ls-1 p-0 m-0 text-muted">
              <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">Alpha</Link></li>
              <li className="breadcrumb-item active fw-bold text-dark">Tìm kiếm</li>
            </ol>
          </nav>
          <h2 className="fw-black display-5 text-uppercase ls-1 m-0">
            Kết quả: <span className="text-orange">"{keyword}"</span>
          </h2>
        </div>
        <div className="col-md-4 text-md-end">
           <button onClick={handleVoiceSearch} className={`btn-voice shadow-sm ${isListening ? 'listening' : ''}`}>
             {isListening && <div className="pulse-ring"></div>}
             {isListening ? <MicOff size={18} /> : <Mic size={18} />}
             <span className="ms-2 fw-bold small text-uppercase ls-1">Tìm bằng giọng nói</span>
           </button>
        </div>
      </div>

      {/* 2. CATEGORY TABS */}
      {!loading && products.length > 0 && (
        <div className="category-tabs-container mb-5 d-flex gap-2 overflow-auto pb-2 border-bottom">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn-tab-luxury ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat === "all" ? "Tất cả" : cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="row g-4">
          {[1,2,3,4].map(i => (
            <div className="col-6 col-md-3" key={i}>
              <div className="skeleton-card shimmer rounded-4" style={{ height: '350px' }}></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="row g-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} p={p} API_URL={API_URL} setLightbox={setLightbox} isSale={!!p.price_sale} />
          ))}
        </div>
      ) : (
        /* KHÔNG CÓ KẾT QUẢ */
        <div className="empty-search-ui text-center py-5">
           <div className="bg-white p-5 rounded-5 shadow-sm border mb-5">
              <SearchX size={80} className="text-muted opacity-25 mb-3" />
              <h2 className="fw-black text-uppercase">Không tìm thấy sản phẩm</h2>
              <p className="text-muted mb-4 mx-auto" style={{maxWidth: '450px'}}>
                Rất tiếc, Alpha chưa tìm thấy sản phẩm khớp với từ khóa của bạn.
              </p>
              <button onClick={() => {router.push('/product');}} className="btn btn-dark rounded-pill px-4 py-2 fw-bold shadow-lg">XEM TẤT CẢ SẢN PHẨM</button>
           </div>
           
           {/* HIỂN THỊ SALE KHI TRỐNG */}
           {saleProducts.length > 0 && (
              <div className="sale-recommendations pt-4 mb-5">
                 <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
                    <Flame size={24} className="text-danger animate-bounce" />
                    <h4 className="fw-bold m-0 text-uppercase ls-1">Deal hời đang diễn ra</h4>
                 </div>
                 <div className="row g-4 text-start">
                    {saleProducts.map((p) => (
                      <ProductCard key={p.id} p={p} API_URL={API_URL} setLightbox={setLightbox} isSale={true} />
                    ))}
                 </div>
              </div>
           )}

           {recommendations.length > 0 && saleProducts.length === 0 && (
              <div className="recommendations pt-4">
                 <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
                    <RefreshCw size={20} className="text-orange" />
                    <h4 className="fw-bold m-0 text-uppercase ls-1">Gợi ý cho bạn</h4>
                 </div>
                 <div className="row g-4 text-start">
                    {recommendations.map((p) => (
                      <ProductCard key={p.id} p={p} API_URL={API_URL} setLightbox={setLightbox} />
                    ))}
                 </div>
              </div>
           )}
        </div>
      )}

      <FsLightbox toggler={lightbox.toggler} sources={[lightbox.source]} />

      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .text-orange { color: #CC6600; }
        .btn-voice {
          background: #fff; border: 1px solid #ddd; padding: 10px 20px;
          border-radius: 50px; display: inline-flex; align-items: center;
          transition: 0.3s; position: relative;
        }
        .btn-voice.listening { background: #CC6600; color: #fff; border-color: #CC6600; }
        .pulse-ring {
          position: absolute; width: 100%; height: 100%; border: 2px solid #CC6600;
          border-radius: 50px; left: 0; top: 0; animation: pulse 1.5s infinite;
        }
        @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .btn-tab-luxury {
          background: #fff; border: 1px solid #eee; padding: 10px 25px;
          border-radius: 50px; font-size: 11px; font-weight: 800;
          text-transform: uppercase; color: #777; transition: 0.3s;
          white-space: nowrap;
        }
        .btn-tab-luxury.active { background: #111; color: #fff; border-color: #111; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

        .luxury-product-card {
          background: white; border-radius: 24px; overflow: hidden;
          transition: 0.4s; border: 1px solid rgba(0,0,0,0.05); height: 100%;
        }
        .luxury-product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
        
        .img-wrapper { 
          aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; 
          background: #fdfdfd; padding: 25px; position: relative; overflow: hidden;
        }
        .img-main { max-width: 100%; max-height: 100%; object-fit: contain; transition: 0.5s; }
        .luxury-product-card:hover .img-main { transform: scale(1.1); }

        .price-text { font-size: 1.2rem; font-weight: 900; color: #111; }
        .badge-sale-hot { position: absolute; top: 15px; left: 15px; background: #dc3545; color: white; padding: 4px 12px; border-radius: 50px; font-size: 10px; font-weight: 900; z-index: 2; }
        .badge-soldout { background: #111; color: #fff; padding: 6px 15px; border-radius: 50px; font-size: 10px; font-weight: 700; }
        .soldout-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); z-index: 1; }
      `}</style>
    </div>
  );
}

function ProductCard({ p, API_URL, setLightbox, isSale = false }) {
  const thumb = p.thumbnail ? (p.thumbnail.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p.thumbnail}`) : "/no-image.jpg";
  const stockQty = p.product_store?.qty ?? p.stock ?? 0;
  const isOutOfStock = stockQty <= 0;
  // Đồng nhất tên danh mục từ object hoặc string
  const categoryName = p.category?.name || p.category_name || "ALPHA SERIES";

  return (
    <div className="col-6 col-md-3">
      <div className="luxury-product-card shadow-sm d-flex flex-column">
        <div className="img-wrapper">
          <Link href={`/product/${p.slug || p.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center">
            <img src={thumb} alt={p.name} className="img-main" />
          </Link>
          <button 
            className="position-absolute bottom-0 end-0 m-3 btn btn-light btn-sm rounded-circle shadow-sm"
            style={{zIndex: 3}}
            onClick={() => setLightbox({ toggler: true, source: thumb })}
          >
            <Maximize2 size={14} />
          </button>
          {isSale && <div className="badge-sale-hot">SALE</div>}
          {isOutOfStock && <div className="soldout-overlay"><span className="badge-soldout text-uppercase">Tạm hết</span></div>}
        </div>
        <div className="p-4 bg-white flex-grow-1 border-top d-flex flex-column">
          <small className="text-warning fw-bold text-uppercase ls-1" style={{fontSize: '9px'}}>{categoryName}</small>
          <h6 className="fw-bold mt-1 mb-3 product-title-luxury">
            <Link href={`/product/${p.slug || p.id}`} className="text-dark text-decoration-none">{p.name}</Link>
          </h6>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div>
                {isSale || p.price_sale ? (
                    <>
                        <div className="text-muted text-decoration-line-through x-small" style={{fontSize: '10px'}}>
                          {Number(p.price_buy).toLocaleString()}₫
                        </div>
                        <div className="price-text text-danger">
                          {Number(p.price_sale).toLocaleString()}₫
                        </div>
                    </>
                ) : (
                    <span className="price-text">{Number(p.price_buy).toLocaleString()}₫</span>
                )}
            </div>
            <button className={`btn ${isOutOfStock ? 'btn-secondary disabled' : 'btn-dark'} btn-sm rounded-3 px-2 py-2`}>
                <ShoppingBag size={18}/>
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`.product-title-luxury { height: 2.5rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }`}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-5 text-center fw-bold">HỆ THỐNG ĐANG QUÉT DỮ LIỆU...</div>}>
      <SearchContent />
    </Suspense>
  );
}
"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Truck, ShieldCheck, CreditCard, RotateCcw, 
  ChevronRight, Camera, Aperture, Zap, Mail, UserPlus, ArrowRight
} from "lucide-react"; 
import "bootstrap/dist/css/bootstrap.min.css";

// Components (Giả định bạn đã có các component này)
import Carousel from "../components/Carousel";
import ProductSection from "../components/ProductSection";

// Services
import ProductService from "../services/productService";
import BannerService from "../services/BannerService";
import categoryService from "../services/categoryService"; 

export default function HomePage() {
  const [data, setData] = useState({
    new_products: [],
    cameras: [],
    lenses: [],
    accessories: []
  });
  const [banners, setBanners] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x800/222/fff?text=Sony+Alpha";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.replace(/^public\//, '');
    return `${API_URL}/storage/${cleanPath}`;
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [productRes, bannerRes, catRes] = await Promise.all([
          ProductService.getAll(),
          BannerService.getAll(),
          categoryService.getAll() 
        ]);

        const allProducts = productRes.data?.data || [];
        const allCats = catRes.data?.data || [];

        // Phân loại sản phẩm thông minh hơn dựa trên category_id hoặc name
        setData({
          new_products: [...allProducts].sort((a, b) => b.id - a.id).slice(0, 8),
          cameras: allProducts.filter(p => p.category_id === 1 || p.category_name?.toLowerCase().includes('máy')).slice(0, 8),
          lenses: allProducts.filter(p => p.category_id === 2 || p.category_name?.toLowerCase().includes('ống')).slice(0, 8),
          accessories: allProducts.filter(p => p.category_id === 3 || p.category_name?.toLowerCase().includes('phụ')).slice(0, 8),
        });

        setBanners(bannerRes.data?.data || []); 
        setCategories(allCats); 
      } catch (err) {
        console.error("Lỗi tải dữ liệu trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Cảm ơn bạn! Ưu đãi 15% đã được gửi tới: ${email}`);
    setEmail("");
  };

  return (
    <div className="bg-light min-vh-100 overflow-x-hidden">
      
      {/* 1. HERO CAROUSEL */}
      <section className="bg-white border-bottom border-light mb-5">
        <Carousel banners={banners} loading={loading} />
      </section>

      {/* 2. DỊCH VỤ NỔI BẬT - Glassmorphism touch */}
      <section className="container position-relative z-index-2" style={{ marginTop: "-3rem" }}>
        <div className="row g-0 shadow-lg rounded-4 overflow-hidden border-0">
          {[
            {icon: <Truck size={22} />, title: "Vận chuyển", desc: "Miễn phí từ 2Tr"},
            {icon: <ShieldCheck size={22} />, title: "Bảo hành", desc: "24 tháng Sony"},
            {icon: <CreditCard size={22} />, title: "Trả góp", desc: "0% lãi suất"},
            {icon: <RotateCcw size={22} />, title: "Đổi trả", desc: "7 ngày lỗi NSX"}
          ].map((item, i) => (
            <div key={i} className="col-6 col-lg-3 bg-white p-4 border-end border-light last-child-no-border">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-dark text-white rounded-circle">{item.icon}</div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark text-uppercase x-small">{item.title}</h6>
                  <span className="text-muted xx-small">{item.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="py-5">
        {loading ? (
           <div className="text-center py-5 min-vh-50">
             <div className="spinner-grow text-warning" role="status"></div>
             <p className="mt-3 text-muted ls-2 small uppercase">Khởi tạo không gian sáng tạo...</p>
           </div>
        ) : (
          <>
            {/* 3. DANH MỤC - Tinh chỉnh hiệu ứng Hover */}
            <section className="container py-5 mt-4">
                <div className="text-center mb-5">
                    <span className="text-muted x-small uppercase ls-2 mb-2 d-block">Lựa chọn của bạn</span>
                    <h2 className="fw-light uppercase ls-4 m-0">Hệ sinh thái Alpha</h2>
                    <div className="bg-dark mx-auto mt-3" style={{width: '30px', height: '2px'}}></div>
                </div>
                <div className="row g-4 scroll-mobile flex-nowrap flex-md-wrap overflow-auto pb-3">
                    {categories.map((cat) => (
                        <div key={cat.id} className="col-8 col-md-4 col-lg-2">
                            <Link href={`/category/${cat.id}`} className="text-decoration-none group">
                                <div className="luxury-cat-card rounded-circle-custom overflow-hidden bg-white shadow-sm border">
                                    <div className="cat-img-zoom h-100">
                                        <img 
                                            src={getImageUrl(cat.image || cat.thumbnail)} 
                                            alt={cat.name} 
                                            className="w-100 h-100 object-fit-cover transition-1s" 
                                        />
                                    </div>
                                    <div className="cat-content-overlay">
                                        <h5 className="text-white small fw-bold uppercase ls-1 mb-0">{cat.name}</h5>
                                        <ArrowRight size={14} className="text-warning mt-2 arrow-slide" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. SẢN PHẨM MỚI */}
            <section className="bg-white py-5 shadow-sm border-top border-bottom">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div className="d-flex align-items-center">
                            <Zap size={18} className="text-warning me-2 animate-pulse" />
                            <h4 className="fw-bold uppercase m-0 ls-1 fs-5">Sản phẩm mới ra mắt</h4>
                        </div>
                        <Link href="/product" className="text-dark small uppercase ls-1 text-decoration-none border-bottom border-dark pb-1">Xem tất cả</Link>
                    </div>
                    <ProductSection products={data.new_products} link="/product" />
                </div>
            </section>

            {/* 5. PARALLAX BANNER */}
            <section className="py-5">
                <div className="container">
                  <div className="position-relative rounded-5 overflow-hidden shadow-2xl" style={{ height: '500px' }}>
                      <img 
                          src="https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=2000" 
                          className="w-100 h-100 object-fit-cover parallax-effect" 
                          alt="Sony Mirrorless" 
                      />
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-dark d-flex align-items-center p-5">
                          <div className="col-lg-6 text-white text-start">
                              <h2 className="display-4 fw-bold mb-4 ls-1">A7R V <br/><span className="fw-light fst-italic text-warning">Power of Detail</span></h2>
                              <p className="lead opacity-75 mb-5 fw-light">Định nghĩa lại độ phân giải với chip xử lý AI chuyên biệt.</p>
                              <Link href="/product" className="btn btn-warning rounded-pill px-5 py-3 fw-bold uppercase ls-1 shadow-warning hover-scale">
                                  Khám phá ngay
                              </Link>
                          </div>
                      </div>
                  </div>
                </div>
            </section>

            {/* 6 & 7. MÁY ẢNH & ỐNG KÍNH */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-12">
                            <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                                <Camera size={18} className="me-2" />
                                <h4 className="fw-bold uppercase m-0 ls-1 fs-5">Mirrorless Cameras</h4>
                            </div>
                            <ProductSection products={data.cameras} />
                        </div>
                        <div className="col-12 mt-5">
                            <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                                <Aperture size={18} className="me-2" />
                                <h4 className="fw-bold uppercase m-0 ls-1 fs-5">G Master Lenses</h4>
                            </div>
                            <ProductSection products={data.lenses} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. ELITE MEMBERSHIP */}
            <section className="container mb-5 mt-5">
              <div className="bg-dark rounded-5 p-5 position-relative overflow-hidden text-white shadow-2xl border-0">
                <div className="row align-items-center position-relative z-index-2">
                  <div className="col-lg-7 mb-4 mb-lg-0">
                    <div className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold uppercase ls-1">Elite Alpha</div>
                    <h2 className="display-5 fw-bold mb-4 uppercase ls-1">Nhận đặc quyền <br/>Nhiếp ảnh chuyên nghiệp</h2>
                    <p className="opacity-75 fs-5 fw-light">Ưu đãi 15% cho thành viên mới và vé mời Workshop hàng tháng.</p>
                  </div>
                  <div className="col-lg-5">
                    <form onSubmit={handleSubscribe} className="bg-white-10 p-4 rounded-4 backdrop-blur shadow-inner">
                      <div className="input-group">
                        <input 
                          type="email" 
                          className="form-control bg-transparent border-white border-opacity-25 text-white py-3 shadow-none px-4" 
                          placeholder="Email của bạn..." 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="btn btn-warning px-4 fw-bold uppercase" type="submit">Join</button>
                      </div>
                      <div className="mt-3 d-flex align-items-center gap-2 opacity-50 small">
                        <UserPlus size={14} />
                        <span>Tham gia cùng 50,000+ người đam mê Sony.</span>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="glow-circle top-right"></div>
                <div className="glow-circle bottom-left"></div>
              </div>
            </section>
          </>
        )}
      </main>

      <style jsx>{`
        .uppercase { text-transform: uppercase; }
        .ls-4 { letter-spacing: 0.5rem; }
        .ls-2 { letter-spacing: 0.2rem; }
        .ls-1 { letter-spacing: 0.1rem; }
        .x-small { font-size: 0.75rem; }
        .xx-small { font-size: 0.65rem; }
        .transition-1s { transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-scale:hover { transform: scale(1.05); }
        
        .luxury-cat-card {
            height: 220px;
            position: relative;
            cursor: pointer;
        }
        .cat-content-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            padding-bottom: 2rem;
            transition: all 0.3s ease;
        }
        .luxury-cat-card:hover .cat-content-overlay {
            background: rgba(0,0,0,0.4);
            justify-content: center;
            padding-bottom: 0;
        }
        .arrow-slide {
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
        }
        .luxury-cat-card:hover .arrow-slide {
            opacity: 1;
            transform: translateX(0);
        }
        .luxury-cat-card:hover .transition-1s {
            transform: scale(1.15);
        }

        .bg-gradient-dark {
            background: linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
        }
        .backdrop-blur { backdrop-filter: blur(10px); }
        .bg-white-10 { background: rgba(255,255,255,0.08); }
        
        .glow-circle {
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(255,193,7,0.15) 0%, transparent 70%);
            border-radius: 50%;
            z-index: 1;
        }
        .top-right { top: -100px; right: -100px; }
        .bottom-left { bottom: -100px; left: -100px; }
        
        @media (max-width: 768px) {
            .scroll-mobile {
                padding-left: 1rem;
            }
            .luxury-cat-card { height: 180px; }
        }
      `}</style>
    </div>
  );
}
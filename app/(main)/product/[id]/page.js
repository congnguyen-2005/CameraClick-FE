"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ShoppingBag, CheckCircle, ShieldCheck, Truck, 
  ArrowLeft, Info, Star, Heart, Share2, Eye 
} from "lucide-react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

// import Footer from "../../../components/Footer";
import ProductService from "../../../services/productService";
import CartService from "../../../services/cartService";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api";

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // STATE SẢN PHẨM LIÊN QUAN
  const [mainImg, setMainImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // LOGIC THUỘC TÍNH
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const getFullImageUrl = (path) => {
    if (!path) return "/no-image.jpg";
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/^\/?(storage\/)+/, '');
    return `${API_URL}/storage/${cleanPath}`;
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // 1. Lấy chi tiết sản phẩm
    ProductService.getDetail(id)
      .then((res) => {
        const data = res.data.data || res.data;
        if (!data) {
          setError(true);
        } else {
          setProduct(data);
          setMainImg(getFullImageUrl(data.thumbnail || data.images?.[0]?.image));
          
          // Khởi tạo thuộc tính
          if (data.attributes && data.attributes.length > 0) {
             const initialAttrs = {};
             data.attributes.forEach(attr => {
               initialAttrs[attr.name] = ""; 
             });
             setSelectedAttributes(initialAttrs);
          }

          // 2. SAU KHI CÓ PRODUCT -> LẤY SẢN PHẨM LIÊN QUAN (CÙNG CATEGORY)
          if (data.category_id) {
             fetchRelatedProducts(data.category_id, data.id);
          }
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Hàm lấy sản phẩm liên quan
  const fetchRelatedProducts = async (categoryId, currentId) => {
    try {
      // Giả sử ProductService có hàm getList hoặc getRelated
      // Tham số truyền vào là category_id để lọc
      const res = await ProductService.getList({ category_id: categoryId, limit: 5 }); 
      const allItems = res.data.data || res.data || [];
      
      // Lọc bỏ sản phẩm đang xem và lấy 4 sản phẩm
      const related = allItems.filter(item => item.id !== currentId).slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm liên quan", err);
    }
  };

  const currentStock = product?.product_store?.qty ?? product?.stock ?? 0;
  const isSale = product?.price_sale && product?.price_sale > 0;

  const handleSelectAttribute = (name, value) => {
    setSelectedAttributes(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔒 Vui lòng đăng nhập để thực hiện mua hàng!");
      router.push("/login");
      return;
    }

    const missingAttrs = Object.keys(selectedAttributes).filter(key => !selectedAttributes[key]);
    if (missingAttrs.length > 0) {
      alert(`⚠️ Vui lòng chọn: ${missingAttrs.join(", ")}`);
      return;
    }

    try {
      setIsAdding(true);
      const res = await CartService.add({ 
        product_id: product.id, 
        qty: quantity,
        options: selectedAttributes 
      });

      if (res.data.status) {
        alert("✅ Sản phẩm đã được thêm vào giỏ hàng!");
        window.dispatchEvent(new Event("cartUpdate")); 
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng";
      alert(`❌ ${errorMsg}`);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-white">
      <div className="spinner-grow text-dark" role="status"></div>
    </div>
  );

  if (error || !product) return <div className="text-center py-5">Sản phẩm không tồn tại</div>;

  return (
    <div className="bg-white min-vh-100 font-sans pb-5">
      <main className="container py-4">
        {/* BREADCRUMB LUXURY */}
        <nav className="d-flex justify-content-between align-items-center mb-5 mt-2">
          <button onClick={() => router.back()} className="btn-back-luxury">
            <ArrowLeft size={18} /> <span>Trở lại cửa hàng</span>
          </button>
          <div className="d-flex gap-3">
             <button className="btn-icon-circle"><Heart size={18} /></button>
             <button className="btn-icon-circle"><Share2 size={18} /></button>
          </div>
        </nav>

        <div className="row g-5">
          {/* LEFT: GALLERY SECTION */}
          <div className="col-lg-7">
            <div className="row g-3 sticky-top" style={{ top: '100px' }}>
              <div className="col-2">
                <div className="thumb-gallery custom-scrollbar">
                  {[product.thumbnail, ...(product.images?.map(i => i.image) || [])].filter(Boolean).map((img, i) => (
                    <div 
                      key={i} 
                      className={`thumb-box ${mainImg === getFullImageUrl(img) ? "active" : ""}`}
                      onClick={() => setMainImg(getFullImageUrl(img))}
                    >
                      <img src={getFullImageUrl(img)} alt="thumbnail" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-10">
                <div className="main-preview-luxury shadow-sm position-relative overflow-hidden">
                   {isSale && <span className="luxury-sale-tag">SALE</span>}
                   <img src={mainImg} alt={product.name} className="img-fluid" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: INFO SECTION */}
          <div className="col-lg-5">
            <div className="product-info-wrapper">
              <span className="badge-category">{product.category?.name || "Sony Alpha Luxury"}</span>
              <h1 className="display-6 fw-bold text-dark mt-2 mb-3" style={{fontWeight: 800}}>{product.name}</h1>
              
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="d-flex text-warning">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                </div>
                <span className="text-muted small">(128 đánh giá)</span>
              </div>

              <div className="price-section-luxury mb-4">
                {isSale ? (
                  <div className="d-flex align-items-baseline gap-3">
                    <span className="price-now">{Number(product.price_sale).toLocaleString()}₫</span>
                    <del className="price-before">{Number(product.price_buy).toLocaleString()}₫</del>
                    <span className="badge-sale-percent">-{Math.round(100 - (product.price_sale / product.price_buy) * 100)}%</span>
                  </div>
                ) : (
                  <span className="price-now">{Number(product.price_buy).toLocaleString()}₫</span>
                )}
              </div>

              {/* SELECTION AREA */}
              <div className="attributes-selection-area mb-5">
                {product.attributes?.map((attr, index) => (
                  <div key={index} className="attribute-group mb-4">
                    <label className="attribute-label text-uppercase mb-3 d-block">
                      {attr.name}: <span className="selected-val fw-bold text-dark">{selectedAttributes[attr.name]}</span>
                    </label>
                    <div className="attribute-options d-flex flex-wrap gap-2">
                      {(attr.pivot?.value || attr.value).split(',').map((val, vIdx) => (
                        <button
                          key={vIdx}
                          type="button"
                          className={`attr-btn ${selectedAttributes[attr.name] === val.trim() ? "active" : ""}`}
                          onClick={() => handleSelectAttribute(attr.name, val.trim())}
                        >
                          {val.trim()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="stock-status-box mb-4">
                 <div className="d-flex align-items-center gap-2 mb-1">
                   <CheckCircle size={18} className={currentStock > 0 ? "text-success" : "text-danger"} />
                   <span className="fw-bold">{currentStock > 0 ? `Sẵn hàng tại Showroom (${currentStock})` : "Tạm hết hàng"}</span>
                 </div>
                 <small className="text-muted ps-4">Giao hàng miễn phí trong 2h tại nội thành</small>
              </div>

              {/* ACTION BUTTONS */}
              <div className="action-group-luxury mt-5 d-flex gap-3">
                <div className="qty-selector-luxury">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input type="text" value={quantity} readOnly />
                  <button onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}>+</button>
                </div>
                
                <button 
                  className="btn-buy-luxury flex-grow-1"
                  disabled={currentStock <= 0 || isAdding} 
                  onClick={handleAddToCart}
                >
                  {isAdding ? "Đang xử lý..." : "THÊM VÀO GIỎ HÀNG"}
                </button>
              </div>

              <div className="trust-badges mt-5 pt-4 border-top">
                <div className="d-flex justify-content-between">
                  <div className="badge-item"><ShieldCheck size={20}/> <span>Bảo hành 24T</span></div>
                  <div className="badge-item"><Truck size={20}/> <span>Giao nhanh 2H</span></div>
                  <div className="badge-item"><Info size={20}/> <span>Đổi trả 7 ngày</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SPECS & CONTENT SECTION */}
        <section className="mt-5 pt-5 border-top">
          <div className="tabs-container-luxury">
            <h3 className="text-center fw-bold mb-5 uppercase ls-2">Chi tiết kỹ thuật</h3>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="table-responsive shadow-sm rounded-4 overflow-hidden border">
                  <table className="table-luxury mb-0">
                    <tbody>
                      {product.attributes?.map((attr, i) => (
                        <tr key={i}>
                          <td className="spec-label">{attr.name}</td>
                          <td className="spec-value">{attr.pivot ? attr.pivot.value : attr.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="content-detail-luxury mt-5 px-lg-5" dangerouslySetInnerHTML={{ __html: product.content }} />
              </div>
            </div>
          </div>
        </section>

        {/* --- SẢN PHẨM LIÊN QUAN (RELATED PRODUCTS) --- */}
        {relatedProducts.length > 0 && (
          <section className="mt-5 pt-5 border-top">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-black text-uppercase ls-1 m-0">Sản phẩm liên quan</h3>
              <Link href="/product" className="text-decoration-none fw-bold text-orange small d-flex align-items-center gap-1">
                XEM TẤT CẢ <ArrowLeft size={14} className="rotate-180" />
              </Link>
            </div>

            <div className="row g-4">
              {relatedProducts.map((relItem) => {
                 const relIsSale = relItem.price_sale && relItem.price_sale > 0;
                 return (
                   <div key={relItem.id} className="col-6 col-md-3">
                     <Link href={`/product/${relItem.slug || relItem.id}`} className="text-decoration-none">
                       <div className="card-related-luxury h-100">
                         <div className="related-img-box position-relative">
                           {relIsSale && <span className="badge-sale-sm">SALE</span>}
                           <img 
                             src={getFullImageUrl(relItem.thumbnail)} 
                             alt={relItem.name} 
                             className="img-fluid"
                           />
                         </div>
                         <div className="related-info p-3">
                           <h6 className="related-name text-dark fw-bold mb-2 line-clamp-2">{relItem.name}</h6>
                           <div className="related-price">
                             {relIsSale ? (
                               <>
                                 <span className="fw-black text-dark me-2">{Number(relItem.price_sale).toLocaleString()}₫</span>
                                 <del className="text-muted small">{Number(relItem.price_buy).toLocaleString()}₫</del>
                               </>
                             ) : (
                               <span className="fw-black text-dark">{Number(relItem.price_buy).toLocaleString()}₫</span>
                             )}
                           </div>
                         </div>
                       </div>
                     </Link>
                   </div>
                 );
              })}
            </div>
          </section>
        )}

      </main>

      <style jsx global>{`
        .font-sans { font-family: 'Inter', -apple-system, sans-serif; }
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .text-orange { color: #CC6600; }
        .rotate-180 { transform: rotate(180deg); }
        .fw-black { font-weight: 900; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.5em; }

        /* ... (Các CSS cũ giữ nguyên) ... */
        .attribute-label { font-size: 11px; font-weight: 800; color: #888; letter-spacing: 1px; }
        .attr-btn {
          border: 1.5px solid #eee; background: #fff; padding: 8px 18px;
          border-radius: 8px; font-size: 13px; font-weight: 700;
          transition: all 0.2s ease; cursor: pointer;
        }
        .attr-btn:hover { border-color: #111; }
        .attr-btn.active { background: #111; color: #fff; border-color: #111; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        .btn-back-luxury {
          background: #fff; border: 1px solid #eee; color: #111;
          padding: 8px 16px; border-radius: 50px;
          display: flex; align-items: center; gap: 8px;
          font-weight: 700; transition: 0.3s;
        }
        .btn-back-luxury:hover { background: #111; color: #fff; transform: translateX(-5px); }
        
        .btn-icon-circle {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid #eee; background: white;
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s;
        }
        .btn-icon-circle:hover { background: #111; color: #fff; }

        .thumb-gallery { display: flex; flex-direction: column; gap: 12px; }
        .thumb-box {
          border-radius: 12px; border: 2.5px solid transparent;
          overflow: hidden; cursor: pointer; transition: 0.3s;
          aspect-ratio: 1/1;
        }
        .thumb-box img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-box.active { border-color: #CC6600; }

        .main-preview-luxury {
          background: #fdfdfd; border-radius: 24px;
          height: 550px; display: flex; align-items: center;
          justify-content: center; padding: 40px; border: 1px solid #f0f0f0;
        }
        .luxury-sale-tag {
          position: absolute; top: 20px; left: 20px;
          background: #CC6600; color: #fff; padding: 5px 15px;
          font-weight: 900; font-size: 12px; border-radius: 4px;
        }

        .badge-category {
          color: #CC6600; font-weight: 800; text-transform: uppercase;
          font-size: 12px; letter-spacing: 1.5px;
        }

        .price-now { font-size: 2.5rem; font-weight: 800; color: #111; }
        .price-before { font-size: 1.2rem; color: #999; text-decoration: line-through; }
        .badge-sale-percent {
          background: #111; color: white; padding: 4px 12px;
          border-radius: 6px; font-weight: 700; font-size: 14px;
        }

        .qty-selector-luxury {
          display: flex; border: 1.5px solid #111; border-radius: 12px;
          overflow: hidden; background: #fff;
        }
        .qty-selector-luxury button {
          border: none; background: #f8f8f8; width: 45px; font-size: 20px; font-weight: bold;
        }
        .qty-selector-luxury input {
          border: none; width: 50px; text-align: center; font-weight: 800; font-size: 18px;
        }

        .btn-buy-luxury {
          background: #111; color: white; border: none; height: 56px;
          border-radius: 12px; font-weight: 800; letter-spacing: 1px;
          transition: 0.3s;
        }
        .btn-buy-luxury:hover:not(:disabled) { background: #CC6600; transform: translateY(-3px); }

        .badge-item { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; color: #888; }

        .table-luxury { width: 100%; border-collapse: collapse; }
        .spec-label { 
          width: 35%; background: #fafafa; padding: 20px 25px; 
          font-weight: 800; font-size: 12px; color: #777;
          border-bottom: 1px solid #fff; text-transform: uppercase;
        }
        .spec-value { 
          padding: 20px 25px; border-bottom: 1px solid #f5f5f5; 
          font-weight: 500; font-size: 15px; color: #111;
        }

        .content-detail-luxury img { max-width: 100%; height: auto; border-radius: 20px; margin: 30px 0; }
        .content-detail-luxury p { line-height: 2; color: #444; margin-bottom: 20px; }

        /* STYLE MỚI CHO SẢN PHẨM LIÊN QUAN */
        .card-related-luxury {
           background: #fff; border: 1px solid #eee; border-radius: 16px;
           overflow: hidden; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-related-luxury:hover {
           transform: translateY(-8px);
           box-shadow: 0 15px 30px rgba(0,0,0,0.08);
           border-color: #CC6600;
        }
        .related-img-box {
           background: #fdfdfd; padding: 20px; text-align: center;
           border-bottom: 1px solid #f5f5f5; aspect-ratio: 1/1;
           display: flex; align-items: center; justify-content: center;
        }
        .badge-sale-sm {
           position: absolute; top: 10px; left: 10px;
           background: #CC6600; color: #fff; font-size: 10px; 
           font-weight: 800; padding: 3px 8px; border-radius: 4px;
        }
        .related-name { font-size: 14px; transition: 0.2s; }
        .card-related-luxury:hover .related-name { color: #CC6600 !important; }
      `}</style>
    </div>
  );
}
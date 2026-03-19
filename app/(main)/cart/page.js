"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, ShoppingBag, CreditCard, ShieldCheck, Box, ArrowLeft } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartService from "../../services/cartService";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchCartData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CartService.getCart();
      const data = res.data?.data || res.data || [];
      setCart(data);
    } catch (error) {
      if (error.response?.status === 401) router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // HÀM QUAN TRỌNG: LẤY GIÁ ĐÚNG ĐỂ TÍNH TIỀN VÀ HIỂN THỊ
  const getPriceData = (product) => {
    if (!product) return { current: 0, old: 0, hasSale: false, percent: 0 };
    const buy = Number(product.price_buy || 0);
    const sale = Number(product.price_sale || 0);
    const hasSale = sale > 0 && sale < buy;
    return {
      current: hasSale ? sale : buy,
      old: buy,
      hasSale: hasSale,
      percent: hasSale ? Math.round(100 - (sale / buy) * 100) : 0
    };
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await CartService.updateQty(id, qty);
      fetchCartData();
    } catch (e) { alert("Lỗi cập nhật"); }
  };

  const removeItem = async (id) => {
    if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
      await CartService.remove(id);
      fetchCartData();
    }
  };

  // TỔNG TIỀN DỰA TRÊN GIÁ SALE
  const subtotal = cart.reduce((acc, item) => {
    const priceInfo = getPriceData(item.product);
    return acc + (priceInfo.current * item.qty);
  }, 0);

  const renderOptions = (options) => {
    if (!options) return null;
    try {
      const parsed = typeof options === 'string' ? JSON.parse(options) : options;
      return Object.entries(parsed).map(([k, v]) => (
        <span key={k} className="badge bg-light text-dark border me-2 fw-normal py-1 px-2" style={{fontSize: '11px'}}>
          <Box size={10} className="me-1 text-orange" />{k}: <strong>{v}</strong>
        </span>
      ));
    } catch (e) { return null; }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center fw-bold">ĐANG CẬP NHẬT GIỎ HÀNG...</div>;

  return (
    <div className="bg-light min-vh-100 py-5 font-sans">
      <div className="container">
        <h2 className="fw-black text-uppercase mb-5 ls-1 d-flex align-items-center gap-3">
          <div className="bg-dark text-white p-2 rounded-3"><ShoppingBag size={24} /></div>
          Giỏ hàng của bạn
        </h2>

        {cart.length === 0 ? (
          <div className="bg-white p-5 rounded-5 text-center shadow-sm border">
            <h4 className="text-muted">Giỏ hàng đang trống</h4>
            <Link href="/product" className="btn btn-dark mt-3 px-5 rounded-pill">MUA SẮM NGAY</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="bg-white rounded-5 shadow-sm border overflow-hidden">
                {cart.map((item) => {
                  const p = item.product;
                  const priceInfo = getPriceData(p);
                  return (
                    <div key={item.id} className="d-flex align-items-center p-4 border-bottom cart-item-hover transition-all">
                      <div className="position-relative">
                        <img src={p?.thumbnail?.startsWith('http') ? p.thumbnail : `${API_URL}/storage/${p?.thumbnail}`} width={110} height={110} className="rounded-4 border p-2 object-fit-contain bg-white" />
                        {priceInfo.hasSale && <span className="badge bg-danger position-absolute top-0 start-0 m-1" style={{fontSize: '10px'}}>-{priceInfo.percent}%</span>}
                      </div>
                      
                      <div className="ms-4 flex-grow-1">
                        <h6 className="fw-bold text-dark mb-1">{p?.name}</h6>
                        <div className="mb-2 d-flex flex-wrap gap-1">{renderOptions(item.options)}</div>
                        <div className="d-flex align-items-center gap-2">
                           <span className="fw-black text-orange fs-5">{priceInfo.current.toLocaleString()}₫</span>
                           {priceInfo.hasSale && <del className="text-muted small">{priceInfo.old.toLocaleString()}₫</del>}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-4">
                        <div className="d-flex border rounded-3 overflow-hidden shadow-sm bg-light">
                          <button className="btn btn-sm px-3 fw-bold border-0" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                          <span className="px-3 py-1 bg-white fw-black" style={{minWidth: '40px', textAlign: 'center'}}>{item.qty}</span>
                          <button className="btn btn-sm px-3 fw-bold border-0" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                        </div>
                        <button className="btn text-danger p-0 hover-scale transition-all" onClick={() => removeItem(item.id)}><Trash2 size={22}/></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-5 shadow-sm border sticky-top" style={{top: '20px'}}>
                <h5 className="fw-black text-uppercase mb-4 border-bottom pb-3 ls-1">Tóm tắt đơn hàng</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính</span>
                  <span className="fw-bold">{subtotal.toLocaleString()}₫</span>
                </div>
                <div className="d-flex justify-content-between mb-4 pt-3 border-top">
                  <span className="fw-black fs-5">Tổng cộng</span>
                  <span className="fw-black text-orange fs-3">{subtotal.toLocaleString()}₫</span>
                </div>
                <button onClick={() => router.push("/checkout")} className="btn btn-dark w-100 py-3 fw-black rounded-4 shadow-sm text-uppercase ls-1">
                  Tiến hành thanh toán
                </button>
                <div className="text-center mt-3 small text-muted">
                  <ShieldCheck size={14} className="text-success me-1"/> Chính sách bảo mật Sony Việt Nam
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .text-orange { color: #CC6600; }
        .ls-1 { letter-spacing: 1px; }
        .cart-item-hover:hover { background-color: #fafafa; }
        .hover-scale:hover { transform: scale(1.1); }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}
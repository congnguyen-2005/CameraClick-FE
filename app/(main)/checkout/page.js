"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, User, Phone, Mail, FileText, CheckCircle, Smartphone, Globe, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderService from "../../services/orderService";
import CartService from "../../services/cartService";
import UserService from "../../services/userService";

export default function CheckoutPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

  // State dữ liệu
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // State trạng thái
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    payment_method: "cod"
  });

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + "₫";
  };

  // Load dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const [cartResult, userResult] = await Promise.allSettled([
          CartService.getCart(),
          UserService.getProfile()
        ]);

        if (cartResult.status === 'fulfilled') {
          const cartData = cartResult.value.data.data || cartResult.value.data || [];
          if (cartData.length === 0) {
            router.push("/product");
            return;
          }
          setCart(cartData);

          const t = cartData.reduce((sum, item) => {
            const price = (item.product.price_sale > 0 && item.product.price_sale < item.product.price_buy) 
                          ? item.product.price_sale 
                          : item.product.price_buy;
            return sum + (Number(price) * item.qty);
          }, 0);
          setTotal(Math.round(t));
        }

        if (userResult.status === 'fulfilled') {
          const user = userResult.value.data.data || userResult.value.data;
          if (user) {
            setFormData(prev => ({
              ...prev,
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              address: user.address || ""
            }));
          }
        }
      } catch (error) {
        console.error("Lỗi hệ thống:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const getFullImageUrl = (path) => {
    if (!path) return "/no-image.jpg";
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path.replace(/^\/?(storage\/)+/, '')}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);

    const orderPayload = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        note: formData.note,
      },
      payment_method: formData.payment_method,
      total_money: total,
      order_details: cart.map(item => ({
        product_id: item.product_id,
        qty: item.qty,
        price: (item.product.price_sale > 0 && item.product.price_sale < item.product.price_buy) 
               ? item.product.price_sale 
               : item.product.price_buy
      }))
    };

    try {
      const response = await OrderService.checkout(orderPayload);

      if (response.data.status) {
        // Xử lý VNPay redirect
        if (response.data.payment_url) {
          window.location.href = response.data.payment_url;
          return;
        }

        // Xử lý COD thành công
        setSuccess(true);
        // Dispatch sự kiện để cập nhật badge giỏ hàng ở Header nếu có
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      const errorMsg = error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.";
      alert(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
      <Loader2 className="animate-spin text-warning mb-3" size={40} />
      <p className="text-muted fw-bold">Đang tải thông tin thanh toán...</p>
    </div>
  );

  if (success) return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="text-center bg-white p-5 rounded-5 shadow-sm border animate-fade-in" style={{ maxWidth: "550px" }}>
        <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
          <CheckCircle size={80} className="text-success" />
        </div>
        <h2 className="fw-black text-dark mb-3 text-uppercase ls-1">Đặt hàng thành công!</h2>
        <p className="text-muted mb-4 fs-6 px-3">
          Cảm ơn bạn đã tin tưởng Sony Alpha Store. Đơn hàng của bạn đang được xử lý. 
          Hệ thống sẽ gửi thông tin xác nhận qua email trong ít phút.
        </p>
        <div className="d-grid gap-3 px-4">
          <Link href="/orders" className="btn btn-dark py-3 fw-bold rounded-4 text-uppercase ls-1 shadow-sm">Xem lịch sử đơn hàng</Link>
          <Link href="/product" className="btn btn-outline-dark py-3 fw-bold rounded-4 text-uppercase ls-1">Tiếp tục mua sắm</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 pb-5 font-sans">
      <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <Link href="/cart" className="text-dark text-decoration-none d-flex align-items-center gap-2 fw-bold small text-uppercase ls-1">
            <ArrowLeft size={18} /> Quay lại giỏ hàng
          </Link>
          <div className="fw-black text-uppercase ls-1 h5 mb-0">Thanh toán an toàn</div>
          <div className="d-flex gap-2">
            <ShieldCheck size={20} className="text-success" />
            <span className="small text-muted fw-bold">SSL Secure</span>
          </div>
        </div>
      </div>

      <div className="container">
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-lg-7">
            {/* Thông tin người nhận */}
            <div className="card border-0 shadow-sm rounded-5 p-4 mb-4">
              <h5 className="fw-black text-uppercase ls-1 mb-4 border-bottom pb-3 d-flex align-items-center gap-2">
                <User size={20} className="text-warning" /> 1. Thông tin giao hàng
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-black text-uppercase">Họ và tên *</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0 rounded-4 px-3 fs-6" name="name" value={formData.name} onChange={handleChange} required placeholder="Họ và tên người nhận" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-black text-uppercase">Số điện thoại *</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0 rounded-4 px-3 fs-6" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Số điện thoại liên lạc" />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-black text-uppercase">Email nhận hóa đơn *</label>
                  <input type="email" className="form-control form-control-lg bg-light border-0 rounded-4 px-3 fs-6" name="email" value={formData.email} onChange={handleChange} required placeholder="Địa chỉ email" />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-black text-uppercase">Địa chỉ chi tiết *</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0 rounded-4 px-3 fs-6" name="address" value={formData.address} onChange={handleChange} required placeholder="Số nhà, tên đường, phường/xã..." />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-black text-uppercase">Ghi chú đơn hàng</label>
                  <textarea className="form-control bg-light border-0 rounded-4 px-3 fs-6" name="note" rows="3" onChange={handleChange} placeholder="Chỉ dẫn giao hàng, ví dụ: Giao giờ hành chính..."></textarea>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="card border-0 shadow-sm rounded-5 p-4">
              <h5 className="fw-black text-uppercase ls-1 mb-4 border-bottom pb-3 d-flex align-items-center gap-2">
                <CreditCard size={20} className="text-warning" /> 2. Phương thức thanh toán
              </h5>

              <div className="payment-options">
                <label className={`payment-card mb-3 ${formData.payment_method === 'cod' ? 'active' : ''}`}>
                  <input type="radio" name="payment_method" value="cod" checked={formData.payment_method === 'cod'} onChange={handleChange} className="d-none" />
                  <div className="d-flex align-items-center gap-3 w-100">
                    <div className="icon-box"><Smartphone size={24} /></div>
                    <div className="flex-grow-1">
                      <div className="fw-black text-uppercase ls-1 small">Thanh toán khi nhận hàng (COD)</div>
                      <div className="small text-muted">Nhận hàng và thanh toán tiền mặt cho nhân viên giao hàng</div>
                    </div>
                    <div className="check-mark"><CheckCircle size={20} /></div>
                  </div>
                </label>

                <label className={`payment-card ${formData.payment_method === 'vnpay' ? 'active' : ''}`}>
                  <input type="radio" name="payment_method" value="vnpay" checked={formData.payment_method === 'vnpay'} onChange={handleChange} className="d-none" />
                  <div className="d-flex align-items-center gap-3 w-100">
                    <div className="icon-box"><Globe size={24} /></div>
                    <div className="flex-grow-1">
                      <div className="fw-black text-uppercase ls-1 small">Thanh toán Online (VNPAY)</div>
                      <div className="small text-muted">Thanh toán qua ứng dụng Ngân hàng, Thẻ ATM, Visa/Mastercard</div>
                    </div>
                    <div className="check-mark"><CheckCircle size={20} /></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-5 p-4 sticky-top" style={{ top: "100px" }}>
              <h5 className="fw-black text-uppercase ls-1 mb-4 border-bottom pb-3">Tóm tắt đơn hàng</h5>
              
              <div className="order-summary-list mb-4 custom-scrollbar">
                {cart.map((item, index) => {
                  const product = item.product;
                  const price = (product.price_sale > 0 && product.price_sale < product.price_buy) 
                                ? product.price_sale 
                                : product.price_buy;
                  return (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div className="position-relative">
                        <img src={getFullImageUrl(product.thumbnail)} width="70" height="70" className="rounded-4 border object-fit-contain bg-white p-1" alt={product.name} />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark border border-white">
                          {item.qty}
                        </span>
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <div className="fw-bold small text-dark mb-0 text-truncate" style={{maxWidth: "200px"}}>{product.name}</div>
                        <div className="text-warning fw-black small">{formatCurrency(price)}</div>
                      </div>
                      <div className="fw-black text-dark">{formatCurrency(price * item.qty)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small fw-bold text-uppercase">Tạm tính</span>
                  <span className="fw-bold text-dark">{formatCurrency(total)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                  <span className="text-muted small fw-bold text-uppercase">Vận chuyển</span>
                  <span className="text-success fw-black small text-uppercase">Miễn phí</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-black text-dark text-uppercase">Tổng cộng</span>
                  <span className="h3 fw-black text-warning mb-0">{formatCurrency(total)}</span>
                </div>
                
                <button type="submit" className="btn btn-warning w-100 py-3 fw-black rounded-4 shadow hover-scale transition-all d-flex align-items-center justify-content-center gap-2 text-uppercase ls-1" disabled={processing}>
                  {processing ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .font-sans { font-family: 'Inter', -apple-system, sans-serif; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .payment-card {
          width: 100%;
          border: 2px solid #f0f0f0;
          padding: 20px;
          border-radius: 20px;
          display: flex;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .payment-card.active {
          border-color: #ffc107;
          background-color: #fffdf5;
        }
        .payment-card .check-mark { color: #f0f0f0; transition: 0.3s; }
        .payment-card.active .check-mark { color: #ffc107; }
        .icon-box {
          width: 50px;
          height: 50px;
          background: #f8f9fa;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111;
        }
        .payment-card.active .icon-box { background: #ffc107; color: white; }

        .order-summary-list {
          max-height: 350px;
          overflow-y: auto;
          padding-right: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        
        .hover-scale:hover { transform: translateY(-3px); }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
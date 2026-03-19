"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  CreditCard, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  ShoppingBag
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderService from "../../../services/orderService";

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
           router.push("/login");
           return;
        }
        
        const res = await OrderService.getDetail(params.id);
        setOrder(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Không tìm thấy đơn hàng hoặc bạn không có quyền xem.");
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDetail();
  }, [params.id, router]);

  // Helper: Trạng thái Luxury
  const getStatusBadge = (status) => {
    switch (parseInt(status)) {
      case 0: return <span className="badge-luxury badge-pending"><Clock size={14} className="me-1"/> Đang xử lý</span>;
      case 1: return <span className="badge-luxury badge-shipping"><Truck size={14} className="me-1"/> Đang giao hàng</span>;
      case 2: return <span className="badge-luxury badge-success"><CheckCircle2 size={14} className="me-1"/> Hoàn thành</span>;
      case 3: return <span className="badge-luxury badge-danger"><XCircle size={14} className="me-1"/> Đã hủy</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
       <div className="spinner-luxury"></div>
       <p className="mt-3 fw-bold ls-1 uppercase small text-muted">Đang tải chi tiết đơn hàng...</p>
    </div>
  );

  if (!order) return null;

  return (
    <div className="bg-light min-vh-100 font-sans pb-5">
      
      {/* HEADER BAR */}
      <div className="bg-white border-bottom py-4 mb-4 shadow-sm">
        <div className="container">
           <Link href="/orders" className="text-decoration-none text-muted d-inline-flex align-items-center fw-bold hover-orange mb-3 transition-all">
             <ArrowLeft size={18} className="me-2" /> Quay lại danh sách
           </Link>
           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
             <div className="d-flex align-items-center gap-3">
                <div className="icon-box-header">
                   <ShoppingBag size={24} className="text-white" />
                </div>
                <div>
                   <h2 className="fw-black m-0 ls-1 text-uppercase">Đơn hàng #{order.id}</h2>
                   <p className="text-muted small mb-0">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
             </div>
             <div>{getStatusBadge(order.status)}</div>
           </div>
        </div>
      </div>

      <div className="container animate-fade-in">
        <div className="row g-4">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-white py-3 fw-bold border-bottom d-flex align-items-center gap-2">
                <Package size={20} className="text-orange" /> 
                <span className="text-uppercase ls-1 small fw-black">Danh sách sản phẩm</span>
              </div>
              <div className="table-responsive">
                <table className="table mb-0 align-middle table-hover">
                  <thead className="bg-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 py-3 border-0">Sản phẩm</th>
                      <th className="text-center py-3 border-0">SL</th>
                      <th className="text-end py-3 border-0">Đơn giá</th>
                      <th className="text-end pe-4 py-3 border-0">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_details?.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-4 py-3 border-bottom-0">
                          <div className="d-flex align-items-center">
                            <div className="img-wrapper border rounded-3 p-1 me-3">
                               <img 
                                 src={item.product?.thumbnail ? (item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `${API_URL}/storage/${item.product.thumbnail}`) : "/no-image.jpg"} 
                                 className="object-fit-contain w-100 h-100 rounded-2"
                                 alt={item.product?.name}
                               />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1">{item.product?.name}</div>
                              <small className="text-muted d-block">Mã SP: <span className="fw-bold text-dark">#{item.product_id}</span></small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center fw-bold text-muted border-bottom-0">x{item.qty}</td>
                        <td className="text-end text-muted border-bottom-0">{Number(item.price).toLocaleString()}₫</td>
                        <td className="text-end fw-black text-dark pe-4 border-bottom-0">{(item.price * item.qty).toLocaleString()}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* TOTAL FOOTER */}
              <div className="card-footer bg-light py-4 px-4 border-top-0">
                 <div className="d-flex justify-content-end">
                    <div style={{minWidth: '250px'}}>
                       <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted small">Tạm tính:</span>
                          <span className="fw-bold">{Number(order.total_money).toLocaleString()}₫</span>
                       </div>
                       <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted small">Phí vận chuyển:</span>
                          <span className="fw-bold text-success">Miễn phí</span>
                       </div>
                       <div className="border-top my-2"></div>
                       <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-black text-uppercase small ls-1">Tổng cộng:</span>
                          <span className="h4 fw-black text-orange m-0">{Number(order.total_money).toLocaleString()}₫</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN KHÁCH HÀNG */}
          <div className="col-lg-4">
            {/* Customer Info Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 position-relative overflow-hidden">
               <div className="decorative-stripe"></div>
               <h6 className="fw-black text-uppercase text-muted mb-4 small ls-1 border-bottom pb-2">Thông tin giao hàng</h6>
               
               <div className="info-row d-flex mb-3">
                  <div className="icon-circle-small me-3"><User size={16}/></div>
                  <div>
                     <div className="text-muted extra-small uppercase fw-bold">Người nhận</div>
                     <div className="fw-bold text-dark">{order.name}</div>
                  </div>
               </div>

               <div className="info-row d-flex mb-3">
                  <div className="icon-circle-small me-3"><Phone size={16}/></div>
                  <div>
                     <div className="text-muted extra-small uppercase fw-bold">Số điện thoại</div>
                     <div className="fw-bold text-dark">{order.phone}</div>
                  </div>
               </div>

               <div className="info-row d-flex">
                  <div className="icon-circle-small me-3"><MapPin size={16}/></div>
                  <div>
                     <div className="text-muted extra-small uppercase fw-bold">Địa chỉ</div>
                     <div className="fw-bold text-dark lh-sm">{order.address}</div>
                  </div>
               </div>
            </div>

            {/* Order Info Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
               <h6 className="fw-black text-uppercase text-muted mb-4 small ls-1 border-bottom pb-2">Thông tin thanh toán</h6>
               
               <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="d-flex align-items-center text-muted small fw-bold">
                     <Calendar size={16} className="me-2 text-orange"/> Ngày đặt hàng
                  </span>
                  <span className="fw-bold text-dark">{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
               </div>

               <div className="d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center text-muted small fw-bold">
                     <CreditCard size={16} className="me-2 text-orange"/> Phương thức
                  </span>
                  <span className="badge bg-light text-dark border px-3 py-2 fw-bold">
                     {order.payment_method?.toUpperCase() || 'COD'}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-sans { font-family: 'Inter', -apple-system, sans-serif; }
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .text-orange { color: #CC6600; }
        .hover-orange:hover { color: #CC6600 !important; }
        .transition-all { transition: 0.3s; }
        .extra-small { font-size: 10px; letter-spacing: 0.5px; }
        .uppercase { text-transform: uppercase; }

        /* Loading Spinner */
        .spinner-luxury {
          width: 40px; height: 40px; border: 3px solid #f3f3f3;
          border-top: 3px solid #CC6600; border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Header Icon */
        .icon-box-header {
          width: 50px; height: 50px; background: #111;
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        /* Product Image Wrapper */
        .img-wrapper {
          width: 60px; height: 60px; background: #fff;
          display: flex; align-items: center; justify-content: center;
        }

        /* Small Icons */
        .icon-circle-small {
          width: 32px; height: 32px; border-radius: 50%; background: #f8f9fa;
          color: #555; display: flex; align-items: center; justify-content: center;
          border: 1px solid #eee;
        }

        /* Decorative Stripe */
        .decorative-stripe {
          position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          background: #CC6600;
        }

        /* Badges */
        .badge-luxury {
          padding: 8px 16px; border-radius: 30px; font-size: 11px;
          font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
          display: inline-flex; align-items: center;
        }
        .badge-pending { background: #FFF4E5; color: #B75500; border: 1px solid #FFE0B2; }
        .badge-shipping { background: #E3F2FD; color: #1565C0; border: 1px solid #BBDEFB; }
        .badge-success { background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; }
        .badge-danger { background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; }

        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
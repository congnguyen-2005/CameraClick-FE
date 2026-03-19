"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderService from "../../../../../services/orderService";
import { 
  ArrowLeft, Printer, Package, User, MapPin, 
  CreditCard, Calendar, CheckCircle2 
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OrderShowPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

  useEffect(() => {
    OrderService.getDetail(id)
      .then((res) => setOrder(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-warning" /></div>;
  if (!order) return <div className="p-5 text-center text-danger fw-bold">Không tìm thấy đơn hàng!</div>;

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => router.back()} className="btn btn-light rounded-pill d-flex align-items-center gap-2 border shadow-sm">
          <ArrowLeft size={18} /> <span className="fw-bold">QUAY LẠI</span>
        </button>
        <button className="btn btn-dark rounded-pill d-flex align-items-center gap-2 px-4 shadow">
          <Printer size={18} /> IN HÓA ĐƠN
        </button>
      </div>

      <div className="row g-4">
        {/* BÊN TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-black text-uppercase ls-1"><Package className="me-2" /> Kiện hàng #{order.id}</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr className="small text-muted text-uppercase fw-bold">
                      <th className="ps-4">Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th className="text-end pe-4">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_details?.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={item.product?.thumbnail?.startsWith('http') ? item.product.thumbnail : `${API_URL}/storage/${item.product?.thumbnail}`} 
                              alt={item.product_name} 
                              className="rounded-3 border" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-dark">{item.product_name}</div>
                              <div className="x-small text-muted">SKU: ALPHA-{item.product_id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{Number(item.price).toLocaleString()}₫</td>
                        <td>x{item.qty}</td>
                        <td className="text-end pe-4 fw-bold">{Number(item.amount).toLocaleString()}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white p-4 border-top-0">
               <div className="d-flex justify-content-end">
                  <div style={{ width: '250px' }}>
                     <div className="d-flex justify-content-between mb-2"><span className="text-muted">Tạm tính:</span> <span>{Number(order.total_money).toLocaleString()}₫</span></div>
                     <div className="d-flex justify-content-between mb-2"><span className="text-muted">Phí vận chuyển:</span> <span>0₫</span></div>
                     <hr />
                     <div className="d-flex justify-content-between fw-black fs-5"><span>TỔNG CỘNG:</span> <span className="text-primary">{Number(order.total_money).toLocaleString()}₫</span></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* BÊN PHẢI: THÔNG TIN KHÁCH HÀNG & TRẠNG THÁI */}
        <div className="col-lg-4">
          {/* TRẠNG THÁI */}
          <div className="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white p-3">
            <label className="small opacity-50 text-uppercase fw-bold mb-2">Trạng thái hiện tại</label>
            <div className="d-flex align-items-center gap-2 fs-5 fw-bold text-warning">
               <CheckCircle2 /> {order.status === 0 ? "CHỜ DUYỆT" : order.status === 1 ? "ĐÃ XÁC NHẬN" : order.status === 2 ? "ĐANG GIAO" : order.status === 3 ? "HOÀN TẤT" : "ĐÃ HỦY"}
            </div>
          </div>

          {/* KHÁCH HÀNG */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 border-bottom pb-2"><User size={18} className="me-2"/> Khách hàng</h6>
              <div className="fw-bold">{order.name}</div>
              <div className="text-muted small">{order.email}</div>
              <div className="text-muted small">{order.phone}</div>
            </div>
          </div>

          {/* ĐỊA CHỈ */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 border-bottom pb-2"><MapPin size={18} className="me-2"/> Giao hàng tới</h6>
              <div className="small text-muted">{order.address}</div>
              <div className="mt-2 p-2 bg-light rounded small text-dark">
                 <b>Ghi chú:</b> {order.note || "Không có ghi chú"}
              </div>
            </div>
          </div>

          {/* THANH TOÁN */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 border-bottom pb-2"><CreditCard size={18} className="me-2"/> Thanh toán</h6>
              <div className="small">Phương thức: <span className="badge bg-secondary">Chuyển khoản / COD</span></div>
              <div className="small mt-1">Thời gian: {new Date(order.created_at).toLocaleString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .x-small { font-size: 11px; }
      `}</style>
    </div>
  );
}
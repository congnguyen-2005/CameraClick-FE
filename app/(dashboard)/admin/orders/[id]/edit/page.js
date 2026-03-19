"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderService from "../../../../../services/orderService";
import { Save, X, AlertTriangle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OrderEditPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    status: 0,
    note: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.getDetail(id)
      .then((res) => {
        const d = res.data.data;
        setFormData({
          name: d.name || "",
          phone: d.phone || "",
          address: d.address || "",
          status: d.status,
          note: d.note || ""
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await OrderService.update(id, formData);
      alert("Cập nhật đơn hàng thành công!");
      router.push("/admin/orders");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể cập nhật"));
    }
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-dark" /></div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4">
               <h4 className="mb-0 fw-black text-uppercase ls-1">Chỉnh sửa đơn hàng #{id}</h4>
               <p className="small mb-0 opacity-50">Cập nhật thông tin vận chuyển và trạng thái</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">Tên khách hàng</label>
                  <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>

                <div className="row mb-3">
                   <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase">Số điện thoại</label>
                      <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                   </div>
                   <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase">Trạng thái đơn</label>
                      <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}>
                         <option value={0}>Chờ duyệt</option>
                         <option value={1}>Đã duyệt</option>
                         <option value={2}>Đang giao</option>
                         <option value={3}>Hoàn thành</option>
                         <option value={4}>Đã hủy</option>
                      </select>
                   </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">Địa chỉ giao hàng</label>
                  <textarea className="form-control" rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-uppercase">Ghi chú admin</label>
                  <input type="text" className="form-control" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
                </div>

                <div className="p-3 bg-warning-subtle rounded-3 mb-4 d-flex gap-3">
                   <AlertTriangle className="text-warning" />
                   <span className="small text-warning-emphasis">Việc thay đổi trạng thái sẽ gửi thông báo email cho khách hàng. Hãy cẩn trọng!</span>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-dark rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                    <Save size={18}/> LƯU THAY ĐỔI
                  </button>
                  <button type="button" onClick={() => router.back()} className="btn btn-outline-secondary rounded-pill px-4">
                    HỦY
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`.fw-black { font-weight: 900; } .ls-1 { letter-spacing: 1px; }`}</style>
    </div>
  );
}
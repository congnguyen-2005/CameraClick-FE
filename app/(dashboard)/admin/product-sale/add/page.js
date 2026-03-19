"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Percent, Calendar, Package, ArrowLeft, Zap, Save, Tag, ShoppingCart } from "lucide-react";
import productSaleService from "../../../../services/productSaleService";
import productService from "../../../../services/productService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddProductSale() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    productService.getAll().then((res) => {
      const data = res?.data?.data ?? res?.data ?? [];
      setAllProducts(data);
    });
  }, []);

  const addItem = (e) => {
    const pId = parseInt(e.target.value);
    if (!pId) return;
    const exists = selectedItems.find((item) => item.product_id === pId);
    if (exists) return alert("Sản phẩm này đã có trong danh sách!");

    const prod = allProducts.find((p) => p.id === pId);
    setSelectedItems([...selectedItems, {
      product_id: prod.id,
      name: prod.name,
      price_buy: prod.price_buy,
      price_sale: Math.round(prod.price_buy * 0.9), // Mặc định giảm 10%
      discount_percent: 10,
      thumbnail: prod.thumbnail
    }]);
    e.target.value = "";
  };

  const removeItem = (id) => setSelectedItems(selectedItems.filter((item) => item.product_id !== id));

  const updateItem = (id, field, value) => {
    const newItems = selectedItems.map((item) => {
      if (item.product_id === id) {
        let updatedItem = { ...item, [field]: value };
        if (field === "discount_percent") {
          updatedItem.price_sale = Math.round(item.price_buy - (item.price_buy * value) / 100);
        } else if (field === "price_sale") {
          updatedItem.discount_percent = (((item.price_buy - value) / item.price_buy) * 100).toFixed(1);
        }
        return updatedItem;
      }
      return item;
    });
    setSelectedItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return alert("⚠️ Vui lòng chọn ít nhất 1 sản phẩm!");
    if (!dateBegin || !dateEnd) return alert("⚠️ Vui lòng chọn thời gian chiến dịch!");
    if (new Date(dateBegin) >= new Date(dateEnd)) return alert("❌ Thời gian kết thúc phải sau thời gian bắt đầu!");

    setLoading(true);
    try {
      // Gửi mảng các yêu cầu tạo khuyến mãi
      const requests = selectedItems.map(item => productSaleService.create({
        name: campaignName,
        product_id: item.product_id,
        price_sale: item.price_sale,
        date_begin: dateBegin,
        date_end: dateEnd,
        status: 1
      }));
      await Promise.all(requests);
      alert("✅ Đã kích hoạt chiến dịch khuyến mãi thành công!");
      router.push("/admin/product-sale");
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra khi lưu dữ liệu.");
    } finally { setLoading(false); }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 px-lg-5 font-sans">
      <div className="container-fluid">
        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center gap-3">
             <div className="bg-dark p-3 rounded-4 shadow">
                <Tag size={28} className="text-white" />
             </div>
             <div>
                <h2 className="fw-black text-dark mb-0 text-uppercase ls-1">Thiết lập Flash Sale</h2>
                <p className="text-muted mb-0">Tạo mới các chương trình ưu đãi cho hệ sinh thái Alpha</p>
             </div>
          </div>
          <button onClick={() => router.back()} className="btn btn-white rounded-pill px-4 shadow-sm border d-flex align-items-center gap-2 transition-all hover-scale">
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại danh sách</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="row g-4">
          {/* SIDEBAR CẤU HÌNH */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '30px' }}>
              <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                <Zap size={20} className="text-warning" />
                <h5 className="fw-bold mb-0">Thông tin chiến dịch</h5>
              </div>

              <div className="mb-4">
                <label className="form-label uppercase fw-black text-muted">Tên chương trình</label>
                <input
                  type="text"
                  className="form-control custom-input py-3 shadow-none border-0 bg-light"
                  placeholder="VD: Khuyến mãi Tết Nguyên Đán 2026"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label uppercase fw-black text-muted">Bắt đầu từ</label>
                <div className="input-group">
                   <span className="input-group-text bg-light border-0"><Calendar size={16}/></span>
                   <input type="datetime-local" className="form-control custom-input border-0 bg-light" value={dateBegin} onChange={(e) => setDateBegin(e.target.value)} required />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label uppercase fw-black text-danger">Kết thúc lúc (Để đếm ngược)</label>
                <div className="input-group">
                   <span className="input-group-text bg-light border-0"><Calendar size={16} className="text-danger"/></span>
                   <input type="datetime-local" className="form-control custom-input border-0 bg-light fw-bold text-danger" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} required />
                </div>
              </div>

              <div className="bg-dark text-white p-4 rounded-4 mt-4 shadow-lg border-start border-warning border-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small opacity-75 text-uppercase ls-1">Sản phẩm áp dụng:</span>
                  <span className="badge bg-warning text-dark fw-black">{selectedItems.length}</span>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-warning w-100 rounded-pill py-3 fw-black d-flex align-items-center justify-content-center gap-2 shadow transition-all hover-scale"
                  disabled={loading || selectedItems.length === 0}
                >
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : <Save size={20} />}
                  KÍCH HOẠT SALE
                </button>
              </div>
            </div>
          </div>

          {/* DANH SÁCH BIẾN ĐỔI GIÁ */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-white border-0 py-4 px-4">
                 <div className="row align-items-center">
                    <div className="col-md-5">
                        <h5 className="fw-bold mb-0 text-dark">Lựa chọn sản phẩm</h5>
                    </div>
                    <div className="col-md-7">
                        <div className="input-group border-0 rounded-pill px-3 py-1 bg-light">
                          <span className="input-group-text bg-transparent border-0 text-muted"><ShoppingCart size={18}/></span>
                          <select className="form-select bg-transparent border-0 shadow-none fs-6 fw-medium" onChange={addItem}>
                            <option value="">Tìm sản phẩm muốn giảm giá...</option>
                            {allProducts.map((p) => (
                              <option key={p.id} value={p.id}>{p.name} - (Gốc: {Number(p.price_buy).toLocaleString()}₫)</option>
                            ))}
                          </select>
                        </div>
                    </div>
                 </div>
              </div>

              <div className="table-responsive px-4 pb-4">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-muted small uppercase ls-1 border-bottom">
                      <th className="border-0 pb-3">Sản phẩm</th>
                      <th className="border-0 pb-3 text-center">Giá hiện tại</th>
                      <th className="border-0 pb-3 text-center" style={{width: '130px'}}>Giảm %</th>
                      <th className="border-0 pb-3 text-center" style={{width: '200px'}}>Giá khuyến mãi</th>
                      <th className="border-0 pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <Package size={60} className="text-muted opacity-10 mb-3" />
                          <p className="text-muted fw-bold">Vui lòng chọn sản phẩm từ danh sách bên trên</p>
                        </td>
                      </tr>
                    ) : (
                      selectedItems.map((item) => (
                        <tr key={item.product_id} className="item-row transition-all border-bottom">
                          <td className="py-4">
                            <div className="fw-bold text-dark">{item.name}</div>
                            <div className="x-small text-muted text-uppercase">SKU: ALPHA-{item.product_id}</div>
                          </td>
                          <td className="text-center text-muted fw-medium">
                              {Number(item.price_buy).toLocaleString()}₫
                          </td>
                          <td className="text-center">
                            <div className="input-group input-group-sm rounded-3 overflow-hidden border">
                              <input
                                type="number"
                                className="form-control border-0 text-center fw-bold text-danger py-2"
                                value={item.discount_percent}
                                onChange={(e) => updateItem(item.product_id, "discount_percent", e.target.value)}
                              />
                              <span className="input-group-text bg-light border-0 px-2"><Percent size={12} /></span>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="input-group input-group-sm rounded-3 overflow-hidden border">
                              <input
                                type="number"
                                className="form-control border-0 text-center fw-black text-success py-2"
                                value={item.price_sale}
                                onChange={(e) => updateItem(item.product_id, "price_sale", e.target.value)}
                              />
                              <span className="input-group-text bg-light border-0 px-2 fw-bold">₫</span>
                            </div>
                          </td>
                          <td className="text-end">
                            <button type="button" onClick={() => removeItem(item.product_id)} className="btn btn-light btn-sm rounded-circle p-2 text-danger">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-4 border border-dashed text-center">
                <p className="small text-muted mb-0">
                    Hệ thống sẽ tự động cập nhật giá mới trên website ngay khi bạn nhấn <b>Kích Hoạt Sale</b>. 
                    Khi hết thời hạn, giá sẽ tự động quay về mức ban đầu.
                </p>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .transition-all { transition: all 0.2s ease; }
        .custom-input {
          border-radius: 10px;
        }
        .uppercase { text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
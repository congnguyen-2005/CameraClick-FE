"use client";

import { useEffect, useState, useMemo } from "react";
import productstoreService from "../../../services/productstoreService";
import productService from "../../../services/productService";
import { useRouter } from "next/navigation";
import { 
  Package, 
  History, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ArrowUpRight,
  Database,
  Loader2,
  AlertCircle
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InventoryAdmin() {
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState([]);

  const IMAGE_URL = `${process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api"}/storage/`;

  // Sử dụng chuỗi rỗng để tránh dính số 0 ở đầu
  const [form, setForm] = useState({ id: null, product_id: null, qty: "", price_root: "" });
  const [importForm, setImportForm] = useState({ product_id: "", qty: "", price_root: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [stockRes, prodRes] = await Promise.all([
        productstoreService.index(),
        productService.getAll()
      ]);
      const stockData = stockRes?.data || [];
      setStocks(stockData);
      setProducts(prodRes?.data?.data || prodRes?.data || []);
      
      // Kiểm tra cảnh báo hàng sắp hết (dưới 10 đơn vị)
      const lowStock = stockData.filter(item => Number(item.qty) < 10);
      setAlerts(lowStock);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const totalValue = stocks.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price_root)), 0);
    const lowStockCount = stocks.filter(item => Number(item.qty) < 10).length;
    const totalQty = stocks.reduce((sum, item) => sum + Number(item.qty), 0);
    return { totalValue, lowStockCount, totalQty };
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => s.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [stocks, searchTerm]);

  // Hàm xử lý nhập liệu số: Loại bỏ số 0 ở đầu và ký tự không phải số
  const handleNumberInputChange = (e, setter, currentForm) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    setter({ ...currentForm, [name]: cleanValue });
  };

  const handleQuickImport = async (e) => {
    e.preventDefault();
    if (!importForm.product_id || !importForm.qty || !importForm.price_root) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const data = {
        ...importForm,
        qty: Number(importForm.qty),
        price_root: Number(importForm.price_root)
      };
      await productstoreService.importStock(data);
      setImportForm({ product_id: "", qty: "", price_root: "" });
      loadData();
      alert("Nhập kho thành công!");
    } catch (err) { alert("Lỗi nhập kho"); }
  };

  const handleTransaction = async (type) => {
    if (!form.qty || !form.price_root) {
      alert("Vui lòng nhập số lượng và giá");
      return;
    }
    try {
      const data = {
        product_id: form.product_id,
        qty: Number(form.qty),
        price_root: Number(form.price_root)
      };
      if (type === 'import') {
        await productstoreService.importStock(data);
      } else {
        await productstoreService.exportStock(data);
      }
      resetForm();
      loadData();
      alert("Giao dịch thành công!");
    } catch (err) { alert("Lỗi giao dịch"); }
  };

  const resetForm = () => setForm({ id: null, product_id: null, qty: "", price_root: "" });

  return (
    <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100">
      {/* CẢNH BÁO TỰ ĐỘNG */}
      {alerts.length > 0 && (
        <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 d-flex align-items-start gap-3 mb-4 animate-pulse">
          <AlertCircle size={28} className="text-danger flex-shrink-0" />
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-1">Cảnh báo tồn kho thấp!</h6>
            <div className="d-flex flex-wrap gap-2">
              {alerts.map(item => (
                <span key={item.id} className="badge bg-danger rounded-pill px-2 py-1">
                  {item.product?.name}: {item.qty} SP
                </span>
              ))}
            </div>
          </div>
          <button className="btn-close" onClick={() => setAlerts([])}></button>
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2" style={{ fontWeight: 900 }}>
            <Database className="text-primary" size={32} /> Quản Trị Kho Hàng
          </h2>
          <p className="text-muted fw-light mb-0">Theo dõi dòng chảy hàng hóa và tối ưu vốn tồn kho</p>
        </div>
        <button className="btn btn-dark rounded-pill px-4 shadow-sm d-flex align-items-center gap-2 fw-bold" onClick={() => router.push('/admin/inventory/history')}>
          <History size={18} /> Lịch sử giao dịch
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-primary border-5">
            <small className="text-muted text-uppercase fw-bold ls-1">Tổng vốn tồn kho</small>
            <h3 className="fw-black mt-2 mb-0" style={{ fontWeight: 900 }}>{stats.totalValue.toLocaleString()} ₫</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-warning border-5">
            <small className="text-muted text-uppercase fw-bold ls-1">Mặt hàng sắp hết</small>
            <h3 className="fw-black mt-2 mb-0 text-warning" style={{ fontWeight: 900 }}>{stats.lowStockCount} Sản phẩm</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-success border-5">
            <small className="text-muted text-uppercase fw-bold ls-1">Tổng số lượng tồn</small>
            <h3 className="fw-black mt-2 mb-0 text-success" style={{ fontWeight: 900 }}>{stats.totalQty.toLocaleString()} SP</h3>
          </div>
        </div>
      </div>

      {/* QUICK IMPORT PANEL */}
      <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
        <div className="card-header bg-dark text-white py-3 px-4 d-flex align-items-center gap-2">
          <PlusCircle size={20} className="text-primary" />
          <h5 className="mb-0 fw-bold">Nhập hàng nhanh vào hệ thống</h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleQuickImport} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Sản phẩm</label>
              <select className="form-select custom-input" value={importForm.product_id} onChange={(e) => setImportForm({...importForm, product_id: e.target.value})} required>
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Giá vốn (₫)</label>
              <input type="text" name="price_root" className="form-control custom-input" value={importForm.price_root} onChange={(e) => handleNumberInputChange(e, setImportForm, importForm)} placeholder="0" required />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold text-muted text-uppercase">Số lượng</label>
              <input type="text" name="qty" className="form-control custom-input text-center" value={importForm.qty} onChange={(e) => handleNumberInputChange(e, setImportForm, importForm)} placeholder="0" required />
            </div>
            <div className="col-md-3 text-end">
              <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" style={{ backgroundColor: '#CC6600', borderColor: '#CC6600' }}>Xác nhận nhập kho</button>
            </div>
          </form>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Danh mục tồn kho hiện tại</h5>
          <div className="input-group rounded-pill bg-light border px-3 py-1 w-25">
            <span className="input-group-text bg-transparent border-0 text-muted"><Search size={18}/></span>
            <input type="text" className="form-control bg-transparent border-0 shadow-none fs-6" placeholder="Tìm tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="small text-uppercase text-muted">
                <th className="ps-4 py-3">Sản phẩm</th>
                <th className="text-center">Số lượng</th>
                <th>Giá vốn gốc</th>
                <th>Trạng thái</th>
                <th className="text-end pe-4">Giao dịch nhanh</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-5"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
              ) : filteredStocks.map((item) => {
                const isLow = Number(item.qty) < 10;
                const isActive = form.id === item.id;
                return (
                  <tr key={item.id} className={isActive ? "table-active" : ""}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img src={`${IMAGE_URL}${item.product?.thumbnail}`} className="rounded-3 border" style={{ width: "50px", height: "50px", objectFit: "cover" }} alt="" />
                        <div>
                          <div className="fw-bold text-dark mb-0">{item.product?.name}</div>
                          <span className="badge bg-light text-muted border small">ID: {item.product_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className={`fs-5 fw-bold ${Number(item.qty) === 0 ? 'text-danger' : isLow ? 'text-warning' : 'text-success'}`} style={{ fontWeight: 900 }}>
                        {Number(item.qty).toLocaleString()}
                      </div>
                    </td>
                    <td className="fw-bold text-dark">{Number(item.price_root).toLocaleString()} ₫</td>
                    <td>
                      {Number(item.qty) === 0 ? (
                        <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2 border border-danger">HẾT HÀNG</span>
                      ) : isLow ? (
                        <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2 border border-warning">SẮP HẾT</span>
                      ) : (
                        <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 border border-success">ỔN ĐỊNH</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      {isActive ? (
                        <div className="d-flex gap-2 justify-content-end align-items-center animate-fade-in">
                          <input type="text" name="price_root" className="form-control form-control-sm text-center" style={{width: '90px'}} placeholder="Giá" value={form.price_root} onChange={(e) => handleNumberInputChange(e, setForm, form)} />
                          <input type="text" name="qty" className="form-control form-control-sm text-center" style={{width: '60px'}} placeholder="SL" value={form.qty} onChange={(e) => handleNumberInputChange(e, setForm, form)} />
                          <button className="btn btn-sm btn-success rounded-3" onClick={() => handleTransaction('import')}><TrendingUp size={16}/></button>
                          <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleTransaction('export')}><TrendingDown size={16}/></button>
                          <button className="btn btn-sm btn-secondary rounded-3" onClick={resetForm}>Hủy</button>
                        </div>
                      ) : (
                        <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold" onClick={() => setForm({ id: item.id, product_id: item.product_id, qty: "", price_root: item.price_root.toString() })}>
                          <ArrowUpRight size={14} className="me-1" /> Giao dịch
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .ls-1 { letter-spacing: 0.05em; }
        .custom-input {
          border: 1px solid #eee;
          background-color: #fafafa;
          border-radius: 12px;
          padding: 0.7rem 1rem;
          transition: 0.3s;
        }
        .custom-input:focus {
          background-color: #fff;
          border-color: #CC6600;
          box-shadow: 0 0 0 4px rgba(204, 102, 0, 0.1);
        }
        .bg-danger-subtle { background-color: #fff5f5; }
        .bg-warning-subtle { background-color: #fff9db; }
        .bg-success-subtle { background-color: #ebfbee; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react"; // Thêm Suspense ở đây
import productstoreService from "../../../../services/productstoreService";
import { 
  ArrowLeft, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  Package, 
  DollarSign, 
  FileText,
  RefreshCw,
  Search,
  Calendar
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

// 1. Tách phần nội dung sử dụng useSearchParams ra một component riêng
function InventoryHistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product_id = searchParams.get("product_id");

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (product_id) {
        res = await productstoreService.historyByProduct(product_id);
      } else {
        res = await productstoreService.historyLog(); 
      }
      
      const data = res?.data?.data || res?.data || [];
      setLogs(data);
    } catch (error) {
      console.error("❌ Lỗi tải nhật ký:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [product_id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredLogs = logs.filter(log => 
    log.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.id?.toString().includes(searchTerm)
  );

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
      <div className="spinner-luxury mb-3"></div>
      <span className="text-muted fw-bold ls-1 uppercase small">Đang truy xuất nhật ký kho...</span>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 font-sans pb-5">
      <div className="container py-5">
        
        {/* HEADER SECTION */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div className="d-flex align-items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="btn-back-luxury"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="fw-black text-dark mb-1 text-uppercase ls-1">Nhật Ký Giao Dịch</h2>
              <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                {product_id ? (
                  <>
                    <Package size={14} className="text-primary"/> 
                    Sản phẩm: <span className="fw-bold text-dark">#{product_id} - {logs[0]?.product_name || "Đang tải..."}</span>
                  </>
                ) : (
                  <>
                    <Calendar size={14} className="text-primary"/>
                    Báo cáo biến động kho hàng toàn hệ thống
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="search-box-luxury d-none d-md-flex">
            <Search size={18} className="text-muted" />
            <input 
                type="text" 
                placeholder="Tìm mã GD hoặc tên sản phẩm..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* LOGS TABLE CARD */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-dark text-white">
                <tr className="small text-uppercase ls-2">
                  <th className="py-4 ps-4 border-0">Mã GD</th>
                  {!product_id && <th className="py-4 border-0">Sản phẩm</th>}
                  <th className="py-4 border-0">Loại giao dịch</th>
                  <th className="py-4 border-0 text-center">Biến động</th>
                  <th className="py-4 border-0">Giá vốn (Gốc)</th>
                  <th className="py-4 border-0 pe-4 text-end">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={product_id ? 5 : 6} className="text-center py-5">
                      <div className="opacity-25 mb-3"><Package size={60} className="mx-auto" /></div>
                      <p className="text-muted fw-bold">Không tìm thấy dữ liệu giao dịch phù hợp.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => {
                    const isImport = item.type === "import" || item.qty > 0;
                    return (
                      <tr key={item.id} className="border-bottom-subtle">
                        <td className="ps-4 py-4 fw-bold text-muted">#{item.id}</td>
                        {!product_id && (
                          <td>
                            <div className="fw-bold text-dark">{item.product_name}</div>
                            <small className="text-muted">ID: {item.product_id}</small>
                          </td>
                        )}
                        <td>
                          <div className={`status-badge-luxury ${isImport ? 'is-in' : 'is-out'}`}>
                            {isImport ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                            <span>{isImport ? "NHẬP KHO" : "XUẤT KHO"}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`fs-5 fw-black ${isImport ? 'text-success' : 'text-danger'}`}>
                            {isImport ? `+${Math.abs(item.qty)}` : `-${Math.abs(item.qty)}`}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1 fw-bold">
                            <span className="text-muted small">₫</span>
                            {Number(item.price_root || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="pe-4 text-end">
                          <div className="text-dark small fw-bold">
                            {new Date(item.created_at).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="text-muted extra-small">
                            {new Date(item.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY INFO */}
        <div className="mt-4 d-flex justify-content-between align-items-center">
          <div className="badge-total-luxury">
            <FileText size={14} /> HIỂN THỊ {filteredLogs.length} BẢN GHI
          </div>
          <button onClick={loadHistory} className="btn-refresh-luxury">
            <RefreshCw size={16} /> LÀM MỚI
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Component chính bọc Suspense để vượt qua lỗi build của Vercel
export default function InventoryHistoryPage() {
  return (
    <Suspense fallback={
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
            <div className="spinner-border text-dark mb-3"></div>
            <span className="text-muted small uppercase">Đang chuẩn bị dữ liệu...</span>
        </div>
    }>
      <InventoryHistoryContent />
      <style jsx global>{`
        .fw-black { font-weight: 900; }
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .extra-small { font-size: 11px; }

        .btn-back-luxury {
          width: 45px; height: 45px; border-radius: 50%; border: none;
          background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s;
        }
        .btn-back-luxury:hover { background: #111; color: #fff; transform: scale(1.1); }

        .search-box-luxury {
          background: #fff; padding: 10px 20px; border-radius: 50px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #eee;
          display: flex; align-items: center; gap: 10px; width: 350px;
        }
        .search-box-luxury input { border: none; outline: none; font-size: 14px; width: 100%; }

        .status-badge-luxury {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 15px; border-radius: 50px; font-size: 10px; font-weight: 800;
        }
        .status-badge-luxury.is-in { background: #ebfbee; color: #2ecc71; }
        .status-badge-luxury.is-out { background: #fff5f5; color: #e74c3c; }

        .badge-total-luxury {
          background: #111; color: #fff; padding: 8px 20px;
          border-radius: 12px; font-size: 11px; font-weight: 800;
          display: flex; align-items: center; gap: 8px;
        }

        .btn-refresh-luxury {
          background: none; border: 1px solid #ddd; padding: 8px 20px;
          border-radius: 12px; font-size: 11px; font-weight: 800;
          display: flex; align-items: center; gap: 8px; transition: 0.3s;
        }
        .btn-refresh-luxury:hover { background: #f8f8f8; border-color: #111; }

        .spinner-luxury {
          width: 40px; height: 40px; border: 3px solid #f3f3f3;
          border-top: 3px solid #CC6600; border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .border-bottom-subtle { border-bottom: 1px solid rgba(0,0,0,0.03); }
      `}</style>
    </Suspense>
  );
}
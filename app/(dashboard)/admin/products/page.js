  "use client";

  import Link from "next/link";
  import { useEffect, useState, useMemo } from "react";
  import ProductService from "../../../services/productService";
  import "bootstrap/dist/css/bootstrap.min.css";
  // Giả sử bạn dùng FontAwesome, nếu không hãy dùng Lucide-React
  import { Plus, Edit3, Trash2, Package, Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

  export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Số lượng sản phẩm mỗi trang

    const load = async () => {
      try {
        setLoading(true);
        const res = await ProductService.getAll();
        const data = res.data;
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data.data)) list = data.data;
        else if (data.data && Array.isArray(data.data.data)) list = data.data.data;
        setProducts(list);
      } catch (err) {
        console.error("Lỗi load products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load();
    }, []);

    // Logic Tìm kiếm & Phân trang
    const filteredProducts = useMemo(() => {
      return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toString().includes(searchTerm)
      );
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    const currentItems = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage]);

    useEffect(() => {
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    }, [searchTerm]);

    const remove = async (id) => {
      if (!confirm("⚠️ Bạn có chắc muốn xóa sản phẩm này?")) return;
      try {
        await ProductService.delete(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert("❌ Xóa thất bại!");
      }
    };

    const getImageUrl = (path) => {
      if (!path) return "https://placehold.co/400x400?text=No+Image";
      if (path.startsWith("http")) return path;
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`;
    };

    const getStock = (p) => p.product_store?.qty ?? p.stock ?? 0;

    return (
      <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100">
        {/* HEADER SECTION */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <h2 className="fw-black display-6 text-dark mb-1">Hệ Thống Sản Phẩm</h2>
            <p className="text-muted fw-light">Quản lý kho hàng và danh mục cao cấp</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link href="/admin/products/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm border-0 d-inline-flex align-items-center gap-2 transition-all">
              <Plus size={20} />
              <span className="small fw-bold">Thêm sản phẩm mới</span>
            </Link>
          </div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group input-group-merge border rounded-pill px-3 py-1 bg-light">
                  <span className="input-group-text bg-transparent border-0 text-muted">
                    <Search size={18} />
                  </span>
                  <input 
                    type="text" 
                    className="form-control bg-transparent border-0 shadow-none mt-1" 
                    placeholder="Tìm theo tên hoặc mã ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light border-bottom">
                <tr>
                  <th className="py-4 ps-4 text-muted fw-bold small uppercase">ID</th>
                  <th className="py-4 text-muted fw-bold small uppercase">Sản Phẩm</th>
                  <th className="py-4 text-muted fw-bold small uppercase">Danh Mục</th>
                  <th className="py-4 text-muted fw-bold small uppercase text-center">Giá Bán</th>
                  <th className="py-4 text-muted fw-bold small uppercase text-center">Tồn Kho</th>
                  <th className="py-4 text-end pe-4 text-muted fw-bold small uppercase">Hành Động</th>
                </tr>
              </thead>
              <tbody className="border-0">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="placeholder-glow">
                      <td colSpan="6" className="py-4 text-center">
                        <div className="placeholder col-10 rounded-pill py-3 bg-light"></div>
                      </td>
                    </tr>
                  ))
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <Package size={48} className="text-muted mb-3 opacity-20" />
                      <p className="text-muted">Không tìm thấy sản phẩm nào</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((p) => {
                    const stock = getStock(p);
                    return (
                      <tr key={p.id} className="transition-all">
                        <td className="ps-4">
                          <span className="badge bg-light text-dark border fw-medium">#{p.id}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={getImageUrl(p.thumbnail)}
                              className="rounded-3 shadow-sm border"
                              style={{ width: "52px", height: "52px", objectFit: "cover" }}
                              alt=""
                            />
                            <div>
                              <div className="fw-bold text-dark mb-0">{p.name}</div>
                              <small className="text-muted fs-xs">SKU: {p.id * 1234}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted fw-medium">{p.category?.name || "—"}</span>
                        </td>
                        <td className="text-center">
                          <span className="fw-black text-dark">
                            {p.price_buy ? Number(p.price_buy).toLocaleString("vi-VN") : "0"} <small>₫</small>
                          </span>
                        </td>
                        <td className="text-center">
                          {stock === 0 ? (
                            <span className="dot-status bg-danger shadow-danger"></span>
                          ) : stock < 10 ? (
                            <span className="dot-status bg-warning shadow-warning"></span>
                          ) : (
                            <span className="dot-status bg-success shadow-success"></span>
                          )}
                          <span className={`ms-2 fw-bold ${stock === 0 ? 'text-danger' : 'text-dark'}`}>
                            {stock} <small className="fw-light text-muted">pcs</small>
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <div className="btn-group shadow-sm rounded-pill overflow-hidden border">
                            <Link href={`/admin/products/${p.id}/edit`} className="btn btn-white btn-sm px-3 border-end border-0" title="Sửa">
                              <Edit3 size={16} className="text-muted" />
                            </Link>
                            <button onClick={() => remove(p.id)} className="btn btn-white btn-sm px-3 border-0" title="Xóa">
                              <Trash2 size={16} className="text-danger" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="card-footer bg-white border-0 py-4 px-4 border-top">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <span className="text-muted small fw-medium">
                  Đang xem {currentItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} 
                  đến {Math.min(currentPage * itemsPerPage, filteredProducts.length)} 
                  trong tổng số {filteredProducts.length} kết quả
                </span>
              </div>
              <div className="col-md-6">
                <nav>
                  <ul className="pagination pagination-sm justify-content-center justify-content-md-end mb-0 gap-1">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link rounded-circle border-0 shadow-sm mx-1" onClick={() => setCurrentPage(p => p - 1)}>
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button 
                          className={`page-link rounded-circle border-0 shadow-sm mx-1 ${currentPage === i + 1 ? 'bg-dark text-white' : 'bg-white text-dark'}`} 
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link rounded-circle border-0 shadow-sm mx-1" onClick={() => setCurrentPage(p => p + 1)}>
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .transition-all { transition: all 0.2s ease; }
          .transition-all:hover { background-color: #fbfbfb; transform: scale(1.002); }
          .fw-black { font-weight: 900; }
          .fs-xs { font-size: 0.75rem; }
          .dot-status {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .shadow-success { box-shadow: 0 0 8px rgba(25, 135, 84, 0.5); }
          .shadow-warning { box-shadow: 0 0 8px rgba(255, 193, 7, 0.5); }
          .shadow-danger { box-shadow: 0 0 8px rgba(220, 53, 69, 0.5); }
          .page-link {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
            transition: 0.3s;
          }
          .page-link:hover { background-color: #000 !important; color: #fff !important; }
          .btn-white { background: #fff; }
          .btn-white:hover { background: #f8f9fa; }
          .uppercase { letter-spacing: 0.05em; font-size: 0.7rem; }
        `}</style>
      </div>
    );
  }
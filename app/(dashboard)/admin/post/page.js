"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import PostService from "../../../services/PostService";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText, 
  ChevronRight,
  MoreHorizontal 
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await PostService.getAll();
      const data = res.data;
      setPosts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    const ok = confirm("⚠️ Bạn có chắc muốn xóa bài viết này vĩnh viễn không?");
    if (!ok) return;

    try {
      await PostService.delete(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (e) {
      alert("Xóa thất bại!");
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [posts, searchTerm]);

  return (
    <div className="container-fluid py-5 px-lg-5 bg-light min-vh-100">
      {/* HEADER SECTION */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="fw-black display-6 text-dark mb-1 d-flex align-items-center gap-3">
            <FileText size={36} className="text-primary" /> Quản Lý Bài Viết
          </h2>
          <p className="text-muted fw-light ps-5">Biên tập nội dung và truyền thông thương hiệu</p>
        </div>
        <div className="col-md-6 text-md-end">
          <Link href="/admin/post/add" className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2 transition-all hover-scale">
            <Plus size={20} />
            <span className="small fw-bold">Viết bài mới</span>
          </Link>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="input-group border rounded-pill px-3 py-1 bg-light">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 shadow-none mt-1" 
                  placeholder="Tìm tiêu đề bài viết..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLE CARD */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light border-bottom text-uppercase">
              <tr className="small text-muted fw-bold">
                <th className="py-4 ps-4" style={{ width: "80px" }}>ID</th>
                <th className="py-4" style={{ width: "120px" }}>Hình ảnh</th>
                <th className="py-4">Nội dung bài viết</th>
                <th className="py-4 text-center">Trạng thái</th>
                <th className="py-4 text-end pe-4" style={{ width: "200px" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border text-primary opacity-50" role="status"></div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Không tìm thấy bài viết nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((p) => (
                  <tr key={p.id} className="transition-all">
                    <td className="ps-4">
                      <span className="badge bg-light text-dark border fw-medium px-2 py-1">#{p.id}</span>
                    </td>
                    <td>
                      <div className="rounded-3 overflow-hidden shadow-sm border" style={{ width: "80px", height: "55px" }}>
                        <img
                          src={p.image_url || "/no-image.jpg"}
                          className="w-100 h-100 object-fit-cover"
                          alt={p.title}
                          onError={(e) => { e.target.src = "/no-image.jpg"; }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark fs-6 mb-1">{p.title}</div>
                      <div className="small text-muted fw-light text-truncate" style={{ maxWidth: "400px" }}>
                        {p.slug || "Chưa có đường dẫn tĩnh"}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 border border-success-subtle small fw-bold">
                        Đã xuất bản
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                        <Link href={`/admin/post/${p.id}/show`} className="btn btn-white btn-sm px-3 py-2 border-end" title="Xem">
                          <Eye size={16} className="text-info" />
                        </Link>
                        <Link href={`/admin/post/${p.id}/edit`} className="btn btn-white btn-sm px-3 py-2 border-end" title="Sửa">
                          <Edit3 size={16} className="text-warning" />
                        </Link>
                        <button onClick={() => remove(p.id)} className="btn btn-white btn-sm px-3 py-2 border-0" title="Xóa">
                          <Trash2 size={16} className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-scale:hover { transform: scale(1.02); }
        .btn-white { background: #fff; border: none; }
        .btn-white:hover { background: #f8f9fa; }
        .table-hover tbody tr:hover { background-color: #fbfbfb; }
      `}</style>
    </div>
  );
}
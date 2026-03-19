"use client";

import { useEffect, useState } from "react";
import BannerService from "../../../services/BannerService";
import Link from "next/link";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Layers, 
  Hash, 
  Search,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

function BannerList() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            setLoading(true);
            const res = await BannerService.getAll();
            setBanners(res.data.data || []);
        } catch (error) {
            console.error("Lỗi tải banner:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tác phẩm nghệ thuật này khỏi hệ thống?")) {
            try {
                await BannerService.delete(id);
                setBanners(banners.filter((b) => b.id !== id));
            } catch (error) {
                alert("Không thể xóa banner. Vui lòng thử lại sau.");
            }
        }
    };

    const filteredBanners = banners.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-banner-page min-vh-100 py-5 px-4 bg-light">
            <div className="container-fluid max-width-1200">
                
                {/* HEADER SECTION */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
                    <div>
                        <h2 className="fw-black text-dark mb-1 text-uppercase ls-2">Quản lý Visual</h2>
                        <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                            <ImageIcon size={14} className="text-primary" /> Hệ thống hiển thị Banner & Slide cao cấp
                        </p>
                    </div>

                    <div className="d-flex gap-3 align-items-center">
                        <div className="search-wrapper">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm banner..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link href="/admin/banner/add" className="btn-luxury-add">
                            <Plus size={20} /> <span>THÊM MỚI</span>
                        </Link>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="luxury-card-container shadow-sm border-0 rounded-4 bg-white overflow-hidden">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th className="ps-4 py-4 text-muted small text-uppercase ls-1 border-0"><Hash size={14} className="me-1"/> ID</th>
                                    <th className="py-4 text-muted small text-uppercase ls-1 border-0">Tác phẩm / Banner</th>
                                    <th className="py-4 text-muted small text-uppercase ls-1 border-0"><Layers size={14} className="me-1"/> Vị trí</th>
                                    <th className="py-4 text-muted small text-uppercase ls-1 border-0 text-center">Thứ tự</th>
                                    <th className="pe-4 py-4 text-muted small text-uppercase ls-1 border-0 text-end">Quản lý</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-dark spinner-border-sm" role="status"></div>
                                            <span className="ms-3 text-muted small ls-1">Đang truy xuất dữ liệu...</span>
                                        </td>
                                    </tr>
                                ) : filteredBanners.length > 0 ? (
                                    filteredBanners.map((item) => (
                                        <tr key={item.id} className="luxury-row">
                                            <td className="ps-4 fw-bold text-muted small">#{item.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="banner-preview-wrapper shadow-sm">
                                                        <img
                                                            src={item.image_url?.startsWith('http') ? item.image_url : `${API_URL}/storage/${item.image_url}`}
                                                            alt={item.name}
                                                            onError={(e) => e.target.src = '/no-image.jpg'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-1 fw-bold text-dark">{item.name}</h6>
                                                        <span className="badge-luxury-status">Hoạt động</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="position-tag">{item.position}</span>
                                            </td>
                                            <td className="text-center fw-black text-primary">{item.sort_order}</td>
                                            <td className="pe-4 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link
                                                        href={`/admin/banner/${item.id}/edit`}
                                                        className="btn-action edit"
                                                        title="Chỉnh sửa nội dung"
                                                    >
                                                        <Edit3 size={16} />
                                                    </Link>
                                                    <button
                                                        className="btn-action delete"
                                                        onClick={() => handleDelete(item.id)}
                                                        title="Gỡ bỏ banner"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <ImageIcon size={48} className="opacity-20 mb-3" />
                                            <p className="mb-0">Không tìm thấy banner nào phù hợp.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&display=swap');
                
                .admin-banner-page {
                    font-family: 'Inter', sans-serif;
                    background-color: #f8f9fa;
                }
                .max-width-1200 { max-width: 1200px; margin: 0 auto; }
                .fw-black { font-weight: 900; }
                .ls-2 { letter-spacing: 2px; }
                .ls-1 { letter-spacing: 1px; }

                /* Search Wrapper */
                .search-wrapper {
                    position: relative;
                    background: #fff;
                    border-radius: 50px;
                    padding: 8px 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    border: 1px solid #eee;
                }
                .search-wrapper input {
                    border: none;
                    outline: none;
                    margin-left: 10px;
                    font-size: 14px;
                    width: 200px;
                }
                .search-icon { color: #adb5bd; }

                /* Add Button */
                .btn-luxury-add {
                    background: #111;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 13px;
                    letter-spacing: 1px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: 0.3s;
                }
                .btn-luxury-add:hover {
                    background: #CC6600;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(204,102,0,0.2);
                }

                /* Table Styling */
                .luxury-card-container {
                    border: 1px solid rgba(0,0,0,0.05) !important;
                }
                .luxury-row {
                    transition: 0.2s;
                }
                .luxury-row:hover {
                    background-color: #fcfcfc;
                }

                /* Image Preview */
                .banner-preview-wrapper {
                    width: 140px;
                    height: 70px;
                    border-radius: 12px;
                    overflow: hidden;
                    background: #eee;
                    border: 2px solid #fff;
                }
                .banner-preview-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: 0.5s;
                }
                .luxury-row:hover .banner-preview-wrapper img {
                    transform: scale(1.1);
                }

                /* Badges & Tags */
                .badge-luxury-status {
                    background: #e6fcf5;
                    color: #0ca678;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 2px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .position-tag {
                    background: #f1f3f5;
                    color: #495057;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 600;
                }

                /* Action Buttons */
                .btn-action {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    transition: 0.3s;
                    text-decoration: none;
                }
                .btn-action.edit { background: #f8f9fa; color: #111; }
                .btn-action.edit:hover { background: #111; color: #fff; }
                .btn-action.delete { background: #fff5f5; color: #fa5252; }
                .btn-action.delete:hover { background: #fa5252; color: #fff; }
            `}</style>
        </div>
    );
}

export default BannerList;
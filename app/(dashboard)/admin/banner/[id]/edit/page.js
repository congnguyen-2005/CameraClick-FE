"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import BannerService from "../../../../../services/BannerService";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  RefreshCw, 
  Layers, 
  Link as LinkIcon, 
  AlignLeft,
  CheckCircle,
  AlertCircle,
  Upload
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BannerEdit() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        name: "",
        link: "",
        position: "slideshow",
        sort_order: 0,
        description: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api";

    const fetchBanner = useCallback(async () => {
        try {
            setLoading(true);
            const res = await BannerService.getById(id);
            const data = res.data.data;

            setFormData({
                name: data.name,
                link: data.link ?? "",
                position: data.position,
                sort_order: data.sort_order,
                description: data.description ?? ""
            });

            // Xử lý link ảnh từ server
            const fullImageUrl = data.image_url?.startsWith('http') 
                ? data.image_url 
                : `${API_URL}/storage/${data.image_url}`;
            setPreviewImage(fullImageUrl);
        } catch (error) {
            setStatusMsg({ type: "danger", text: "Không thể tải dữ liệu banner." });
        } finally {
            setLoading(false);
        }
    }, [id, API_URL]);

    useEffect(() => {
        fetchBanner();
    }, [fetchBanner]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setStatusMsg({ type: "danger", text: "Kích thước ảnh tối đa là 2MB." });
                return;
            }
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
            setStatusMsg({ type: "", text: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMsg({ type: "", text: "" });

        const data = new FormData();
        data.append("name", formData.name);
        data.append("link", formData.link);
        data.append("position", formData.position);
        data.append("sort_order", formData.sort_order);
        data.append("description", formData.description);
        
        if (imageFile) {
            data.append("image", imageFile);
        }

        // Laravel yêu cầu giả lập PUT khi gửi FormData qua POST
        data.append("_method", "PUT");

        try {
            const res = await BannerService.update(id, data);
            if (res.data.status) {
                setStatusMsg({ type: "success", text: "Cập nhật banner thành công!" });
                setTimeout(() => router.push("/admin/banner"), 1500);
            }
        } catch (error) {
            setStatusMsg({ type: "danger", text: error.response?.data?.message || "Lỗi cập nhật." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
            <RefreshCw className="text-warning animate-spin mb-3" size={40} />
            <span className="text-muted fw-bold ls-1 uppercase small">Đang nạp dữ liệu...</span>
        </div>
    );

    return (
        <div className="admin-banner-edit py-5 min-vh-100 bg-light">
            <div className="container" style={{ maxWidth: "1000px" }}>
                
                {/* HEADER SECTION */}
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <Link href="/admin/banner" className="btn-back-luxury shadow-sm">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="fw-black text-dark mb-1 text-uppercase ls-2">Hiệu chỉnh Banner</h2>
                            <p className="text-muted small mb-0">Chỉnh sửa nội dung số cho ID: <span className="text-warning fw-bold">#{id}</span></p>
                        </div>
                    </div>
                </div>

                {statusMsg.text && (
                    <div className={`alert-luxury alert-${statusMsg.type} mb-4 animate-fade-in`}>
                        {statusMsg.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{statusMsg.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* CỘT TRÁI: CẤU HÌNH CHÍNH */}
                        <div className="col-lg-7">
                            <div className="card-luxury p-4 shadow-sm border-0 h-100">
                                <div className="mb-4">
                                    <label className="label-luxury"><ImageIcon size={14} className="me-2"/> Tên Banner</label>
                                    <input 
                                        type="text" 
                                        className="input-luxury" 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        required 
                                    />
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="label-luxury"><Layers size={14} className="me-2"/> Vị trí</label>
                                        <select 
                                            className="select-luxury" 
                                            value={formData.position} 
                                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        >
                                            <option value="slideshow">Slideshow Chính</option>
                                            <option value="ads">Quảng cáo Phụ</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="label-luxury">Thứ tự ưu tiên</label>
                                        <input 
                                            type="number" 
                                            className="input-luxury" 
                                            value={formData.sort_order} 
                                            onChange={(e) => setFormData({...formData, sort_order: e.target.value})} 
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="label-luxury"><LinkIcon size={14} className="me-2"/> Đường dẫn (URL)</label>
                                    <input 
                                        type="text" 
                                        className="input-luxury text-primary" 
                                        placeholder="https://..." 
                                        value={formData.link} 
                                        onChange={(e) => setFormData({...formData, link: e.target.value})} 
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="label-luxury"><AlignLeft size={14} className="me-2"/> Mô tả chi tiết</label>
                                    <textarea 
                                        className="input-luxury" 
                                        rows={4} 
                                        value={formData.description} 
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="d-flex gap-3 mt-auto pt-3">
                                    <button type="submit" className="btn-luxury-submit flex-grow-1" disabled={isSubmitting}>
                                        {isSubmitting ? <RefreshCw className="animate-spin me-2" size={18} /> : <Save className="me-2" size={18} />}
                                        {isSubmitting ? "ĐANG CẬP NHẬT..." : "LƯU THAY ĐỔI"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI: HÌNH ẢNH */}
                        <div className="col-lg-5">
                            <div className="card-luxury p-4 shadow-sm border-0 h-100">
                                <label className="label-luxury">Hình ảnh hiển thị</label>
                                <div className="image-edit-zone mt-2">
                                    {previewImage ? (
                                        <div className="preview-container shadow-sm">
                                            <img src={previewImage} alt="Preview" className="img-fluid rounded-3" />
                                            <label htmlFor="fileInput" className="change-img-overlay">
                                                <Upload size={24} />
                                                <span className="fw-bold mt-2">Thay đổi ảnh</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="no-image-placeholder">
                                            <ImageIcon size={48} className="text-muted" />
                                        </div>
                                    )}
                                    <input 
                                        id="fileInput" 
                                        type="file" 
                                        className="d-none" 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                    />
                                </div>
                                <div className="mt-4 p-3 bg-light rounded-3 border">
                                    <p className="small text-muted mb-0">
                                        <AlertCircle size={14} className="me-1" />
                                        <strong>Lưu ý:</strong> Hãy chọn ảnh có độ phân giải cao để đảm bảo chất lượng hiển thị trên màn hình Retina.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
                .fw-black { font-weight: 900; }
                .ls-2 { letter-spacing: 2px; }
                .ls-1 { letter-spacing: 1px; }

                .btn-back-luxury {
                    width: 45px; height: 45px; border-radius: 50%; border: none;
                    background: #fff; color: #111; display: flex;
                    align-items: center; justify-content: center; transition: 0.3s;
                    text-decoration: none;
                }
                .btn-back-luxury:hover { background: #111; color: #fff; transform: translateX(-5px); }

                .card-luxury { background: #fff; border-radius: 24px; }

                .label-luxury {
                    display: block; font-size: 11px; font-weight: 800;
                    color: #999; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px;
                }

                .input-luxury, .select-luxury {
                    width: 100%; padding: 14px 20px; border-radius: 12px;
                    border: 1px solid #eee; background: #fdfdfd; font-size: 14px; transition: 0.3s;
                }
                .input-luxury:focus, .select-luxury:focus {
                    outline: none; border-color: #CC6600; background: #fff;
                    box-shadow: 0 0 0 4px rgba(204, 102, 0, 0.1);
                }

                .image-edit-zone { position: relative; border-radius: 16px; overflow: hidden; background: #fafafa; }
                .preview-container { position: relative; width: 100%; cursor: pointer; }
                .change-img-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.4); color: #fff; display: flex;
                    flex-direction: column; align-items: center; justify-content: center;
                    opacity: 0; transition: 0.3s; border-radius: 12px;
                }
                .preview-container:hover .change-img-overlay { opacity: 1; }

                .btn-luxury-submit {
                    background: #111; color: #fff; border: none; padding: 16px;
                    border-radius: 12px; font-weight: 800; letter-spacing: 1px; transition: 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                .btn-luxury-submit:hover { background: #CC6600; transform: translateY(-3px); }

                .alert-luxury {
                    padding: 15px 25px; border-radius: 15px; font-size: 14px;
                    font-weight: 600; display: flex; align-items: center; gap: 12px;
                }
                .alert-success { background: #ebfbee; color: #2ecc71; border: 1px solid #d3f9d8; }
                .alert-danger { background: #fff5f5; color: #fa5252; border: 1px solid #ffe3e3; }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
}
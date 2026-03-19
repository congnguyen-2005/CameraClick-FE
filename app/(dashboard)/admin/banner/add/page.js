"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BannerService from "../../../../services/BannerService";
import { 
  ArrowLeft, 
  UploadCloud, 
  Save, 
  X, 
  Image as ImageIcon, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BannerAdd() {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [position, setPosition] = useState("slideshow");
    const [sortOrder, setSortOrder] = useState("1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();

    // Xử lý khi chọn file ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                setMessage({ type: "danger", text: "Kích thước ảnh không được vượt quá 2MB" });
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Tạo link xem trước
            setMessage({ type: "", text: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: "", text: "" });
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("position", position);
        formData.append("sort_order", sortOrder);
        
        if (image) {
            formData.append("image", image); 
        } else {
            setMessage({ type: "danger", text: "Vui lòng chọn hình ảnh cho banner" });
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await BannerService.create(formData);
            if (res.data.status) {
                setMessage({ type: "success", text: "Tác phẩm đã được khởi tạo thành công!" });
                setTimeout(() => router.push("/admin/banner"), 1500);
            }
        } catch (error) {
            console.error("Lỗi chi tiết:", error.response?.data);
            setMessage({ 
                type: "danger", 
                text: error.response?.data?.message || "Có lỗi xảy ra trong quá trình lưu trữ" 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-banner-add min-vh-100 py-5 bg-light">
            <div className="container" style={{ maxWidth: "800px" }}>
                
                {/* HEADER SECTION */}
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            onClick={() => router.back()} 
                            className="btn-back-luxury shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="fw-black text-dark mb-1 text-uppercase ls-2">Khởi Tạo Banner</h2>
                            <p className="text-muted small mb-0">Thiết lập giao diện thị giác cho hệ thống Alpha</p>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`alert-luxury alert-${message.type} mb-4 animate-fade-in`}>
                        {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* CỘT TRÁI: THÔNG TIN */}
                        <div className="col-md-7">
                            <div className="card-luxury p-4 shadow-sm h-100">
                                <div className="mb-4">
                                    <label className="label-luxury">Tiêu đề Banner</label>
                                    <input 
                                        type="text" 
                                        className="input-luxury" 
                                        placeholder="Ví dụ: Spring Collection 2026"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} 
                                        required 
                                    />
                                </div>

                                <div className="row mb-4">
                                    <div className="col-sm-6">
                                        <label className="label-luxury">Vị trí hiển thị</label>
                                        <select 
                                            className="select-luxury" 
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                        >
                                            <option value="slideshow">Slideshow Chính</option>
                                            <option value="ads">Quảng cáo Sidebar</option>
                                            <option value="footer">Chân trang</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="label-luxury">Thứ tự ưu tiên</label>
                                        <input 
                                            type="number" 
                                            className="input-luxury" 
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="d-flex gap-3 mt-auto pt-3">
                                    <button 
                                        type="submit" 
                                        className="btn-luxury-submit flex-grow-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <Save size={18} className="me-2" />
                                        )}
                                        {isSubmitting ? "ĐANG LƯU..." : "XÁC NHẬN LƯU"}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-luxury-cancel"
                                        onClick={() => router.back()}
                                    >
                                        HỦY
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI: HÌNH ẢNH */}
                        <div className="col-md-5">
                            <div className="card-luxury p-4 shadow-sm text-center h-100 d-flex flex-column justify-content-center">
                                <label className="label-luxury mb-3 text-start">Visual Preview</label>
                                
                                <div className={`upload-zone ${preview ? 'has-image' : ''}`}>
                                    {preview ? (
                                        <div className="position-relative w-100 h-100">
                                            <img src={preview} alt="Preview" className="img-preview" />
                                            <button 
                                                type="button" 
                                                className="btn-remove-img" 
                                                onClick={() => {setImage(null); setPreview(null);}}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="imageInput" className="upload-placeholder">
                                            <UploadCloud size={48} className="text-muted mb-2" />
                                            <span className="fw-bold d-block">Tải ảnh lên</span>
                                            <small className="text-muted">Nhấn để chọn file</small>
                                        </label>
                                    )}
                                    <input 
                                        id="imageInput"
                                        type="file" 
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <p className="mt-3 extra-small text-muted italic">
                                    Khuyên dùng tỉ lệ 21:9 cho Slideshow và 1:1 cho Ads.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
                .fw-black { font-weight: 900; }
                .ls-2 { letter-spacing: 2px; }
                .extra-small { font-size: 11px; }

                .btn-back-luxury {
                    width: 45px; height: 45px; border-radius: 50%; border: none;
                    background: #fff; color: #111; display: flex;
                    align-items: center; justify-content: center; transition: 0.3s;
                }
                .btn-back-luxury:hover { background: #111; color: #fff; transform: translateX(-5px); }

                .card-luxury { background: #fff; border-radius: 24px; border: none; }

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

                /* Upload Zone */
                .upload-zone {
                    flex-grow: 1; border: 2px dashed #eee; border-radius: 16px;
                    background: #fafafa; min-height: 250px; position: relative;
                    display: flex; align-items: center; justify-content: center; overflow: hidden;
                }
                .upload-zone.has-image { border-style: solid; border-color: #f0f0f0; }
                .upload-placeholder { cursor: pointer; padding: 40px; }
                .img-preview { width: 100%; height: 100%; object-fit: cover; }
                .btn-remove-img {
                    position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9);
                    border: none; width: 30px; height: 30px; border-radius: 50%; display: flex;
                    align-items: center; justify-content: center; color: #ff4d4d;
                }

                /* Action Buttons */
                .btn-luxury-submit {
                    background: #111; color: #fff; border: none; padding: 14px;
                    border-radius: 12px; font-weight: 800; letter-spacing: 1px; transition: 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                .btn-luxury-submit:hover { background: #CC6600; transform: translateY(-3px); }

                .btn-luxury-cancel {
                    background: #f1f3f5; color: #495057; border: none; padding: 0 25px;
                    border-radius: 12px; font-weight: 800; transition: 0.3s;
                }
                .btn-luxury-cancel:hover { background: #e9ecef; }

                .alert-luxury {
                    padding: 15px 25px; border-radius: 15px; font-size: 14px;
                    font-weight: 600; display: flex; align-items: center; gap: 12px;
                }
                .alert-success { background: #ebfbee; color: #2ecc71; border: 1px solid #d3f9d8; }
                .alert-danger { background: #fff5f5; color: #fa5252; border: 1px solid #ffe3e3; }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
}
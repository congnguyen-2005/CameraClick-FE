"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductService from "../../../../services/productService";
import CategoryService from "../../../../services/categoryService";
import AttributeService from "../../../../services/attributeService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Plus, Trash2, ArrowLeft, Save, Image as ImageIcon } from "lucide-react"; // Import thêm icon

export default function AddProduct() {
  const router = useRouter();

  /* ================== STATE (Giữ nguyên logic của bạn) ================== */
  const [form, setForm] = useState({
    name: "",
    price_buy: "",
    stock: "",
    category_id: "",
    description: "",
    content: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [attributes, setAttributes] = useState([]); 
  const [attributeOptions, setAttributeOptions] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [saving, setSaving] = useState(false);

  /* ================== LOAD DATA ================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, attrRes] = await Promise.all([
          CategoryService.getAll(),
          AttributeService.getAll()
        ]);
        const catData = catRes.data?.data || catRes.data || [];
        setCategories(Array.isArray(catData) ? catData : []);
        const attrData = attrRes.data?.data || attrRes.data || [];
        setAttributeOptions(Array.isArray(attrData) ? attrData : []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    loadData();
  }, []);

  /* ================== HANDLERS ================== */
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 
      setPreview(URL.createObjectURL(file));
    }
  };

  const addAttribute = () => setAttributes([...attributes, { attribute_id: "", value: "" }]);
  const removeAttribute = (index) => setAttributes(attributes.filter((_, i) => i !== index));
  const updateAttribute = (index, key, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][key] = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category_id || !form.price_buy) return alert("Vui lòng nhập đầy đủ!");
    setSaving(true);
    try {
      const formData = new FormData();
      const slug = form.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      formData.append("name", form.name);
      formData.append("slug", slug);
      formData.append("price_buy", form.price_buy);
      formData.append("category_id", form.category_id);
      formData.append("stock", form.stock || 0); 
      formData.append("description", form.description || "");
      formData.append("content", form.content || "");
      if (image instanceof File) formData.append("thumbnail", image);
      attributes.forEach((attr, index) => {
        if (attr.attribute_id && attr.value) {
          formData.append(`attributes[${index}][attribute_id]`, attr.attribute_id);
          formData.append(`attributes[${index}][value]`, attr.value);
        }
      });
      await ProductService.create(formData);
      router.push("/admin/products");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu"));
    } finally { setSaving(false); }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-black text-dark mb-1">Thiết Kế Sản Phẩm</h2>
            <p className="text-muted fw-light">Khởi tạo kiệt tác mới trong bộ sưu tập của bạn</p>
          </div>
          <button onClick={() => router.back()} className="btn btn-outline-dark rounded-pill px-4 d-flex align-items-center gap-2 transition-all">
            <ArrowLeft size={18} /> <span className="small fw-bold">Quay lại</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="row g-4">
          {/* LEFT COLUMN: Thông tin chính */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold mb-4 text-dark border-start border-primary border-4 ps-3">Thông Tin Cơ Bản</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Tên Sản Phẩm</label>
                  <input type="text" className="form-control custom-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Máy ảnh Sony Alpha A7R IV" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Danh Mục</label>
                  <select className="form-select custom-input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Giá Niêm Yết (VND)</label>
                  <input type="number" className="form-control custom-input fw-bold text-primary" value={form.price_buy} onChange={(e) => setForm({ ...form, price_buy: e.target.value })} placeholder="0.00" required />
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-4 text-dark border-start border-primary border-4 ps-3">Mô Tả Sản Phẩm</h5>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Tóm tắt ngắn</label>
                <textarea className="form-control custom-input" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
              </div>
              <div>
                <label className="form-label small fw-bold text-muted text-uppercase">Nội dung chi tiết</label>
                <textarea className="form-control custom-input" rows="6" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}></textarea>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Media & Attributes */}
          <div className="col-lg-4">
            {/* THUMBNAIL */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white text-center">
              <h5 className="fw-bold mb-4 text-dark text-start border-start border-primary border-4 ps-3">Hình Ảnh</h5>
              <div className="upload-zone rounded-4 mb-3" onClick={() => document.getElementById('avatarInput').click()}>
                {preview ? (
                  <img src={preview} alt="Preview" className="img-fluid rounded-4 shadow-sm" style={{ maxHeight: '250px', objectFit: 'cover' }} />
                ) : (
                  <div className="py-5 text-muted">
                    <ImageIcon size={48} strokeWidth={1} className="mb-2" />
                    <p className="small mb-0">Nhấp để tải lên ảnh đại diện</p>
                  </div>
                )}
              </div>
              <input id="avatarInput" type="file" className="d-none" accept="image/*" onChange={onFileChange} />
              <div className="col-12 text-start">
                  <label className="form-label small fw-bold text-muted text-uppercase">Tồn Kho Ban Đầu</label>
                  <input type="number" className="form-control custom-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
              </div>
            </div>

            {/* ATTRIBUTES */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-4 text-dark border-start border-primary border-4 ps-3">Thuộc Tính</h5>
              {attributes.map((attr, index) => (
                <div className="bg-light p-3 rounded-3 mb-3 position-relative animate-fade-in" key={index}>
                  <select className="form-select custom-input mb-2 form-control-sm" value={attr.attribute_id} onChange={(e) => updateAttribute(index, "attribute_id", e.target.value)}>
                    <option value="">-- Loại --</option>
                    {attributeOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                  </select>
                  <input type="text" className="form-control custom-input form-control-sm" placeholder="Giá trị..." value={attr.value} onChange={(e) => updateAttribute(index, "value", e.target.value)} />
                  <button type="button" className="btn btn-link text-danger p-0 position-absolute top-0 end-0 mt-1 me-2" onClick={() => removeAttribute(index)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm rounded-pill w-100 d-flex align-items-center justify-content-center gap-2" onClick={addAttribute}>
                <Plus size={16} /> Thêm thuộc tính
              </button>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-4">
              <button type="submit" className="btn btn-dark btn-lg w-100 rounded-pill shadow-lg d-flex align-items-center justify-content-center gap-2 py-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm"></span> : <Save size={20} />}
                <span className="fw-bold">Xác Nhận Lưu</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .custom-input {
          border: 1px solid #f0f0f0;
          background-color: #fafafa;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }
        .custom-input:focus {
          background-color: #fff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }
        .upload-zone {
          border: 2px dashed #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-zone:hover {
          background-color: #f8f9fa;
          border-color: #0d6efd;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
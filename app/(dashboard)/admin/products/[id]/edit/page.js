"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ProductService from "../../../../../services/productService";
import CategoryService from "../../../../../services/categoryService";
import AttributeService from "../../../../../services/attributeService";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Save, ArrowLeft, Image as ImageIcon, Settings, 
  Tag, Info, DollarSign, Package, Trash2, Plus 
} from "lucide-react";

export default function EditProduct({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price_buy: "",
    stock: "",
    category_id: "",
    description: "",
    content: "",
  });

  const [productAttributes, setProductAttributes] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, attrRes] = await Promise.all([
          ProductService.get(id),
          CategoryService.getAll(),
          AttributeService.getAll()
        ]);

        setCategories(categoryRes.data?.data || categoryRes.data || []);
        setAllAttributes(attrRes.data?.data || attrRes.data || []);

        const p = productRes.data.data ?? productRes.data;
        setForm({
          name: p.name || "",
          price_buy: p.price_buy || "",
          stock: p.stock ?? (p.product_store?.qty ?? 0),
          category_id: p.category_id || "",
          description: p.description || "",
          content: p.content || "",
        });

        if (p.attributes) {
          const formattedAttrs = p.attributes.map(attr => ({
            attribute_id: attr.id,
            value: attr.pivot?.value || attr.value
          }));
          setProductAttributes(formattedAttrs);
        }

        setImagePreview(
          p.thumbnail ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${p.thumbnail}` : null
        );

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addAttribute = () => setProductAttributes([...productAttributes, { attribute_id: "", value: "" }]);
  const removeAttribute = (index) => setProductAttributes(productAttributes.filter((_, i) => i !== index));
  const handleAttrChange = (index, field, val) => {
    const newAttrs = [...productAttributes];
    newAttrs[index][field] = val;
    setProductAttributes(newAttrs);
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("_method", "PUT");
      data.append("name", form.name);
      data.append("price_buy", form.price_buy);
      data.append("category_id", form.category_id);
      data.append("description", form.description || "");
      data.append("content", form.content || "");
      data.append("stock", form.stock || 0);
      data.append("attributes", JSON.stringify(productAttributes));

      if (newImage) data.append("thumbnail", newImage);

      await ProductService.update(id, data);
      router.push("/admin/products");
    } catch (err) {
      alert("❌ Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="spinner-border text-primary mb-3" role="status"></div>
      <span className="text-muted fw-light">Đang đồng bộ dữ liệu sản phẩm...</span>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container shadow-lg p-0 rounded-4 overflow-hidden bg-white animate-fade-in">
        {/* HEADER BAR */}
        <div className="bg-dark p-4 d-flex justify-content-between align-items-center text-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary p-2 rounded-3">
              <Settings size={24} />
            </div>
            <div>
              <h4 className="mb-0 fw-bold">Chỉnh sửa sản phẩm</h4>
              <small className="opacity-50">Mã định danh: #{id}</small>
            </div>
          </div>
          <button onClick={() => router.back()} className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2">
            <ArrowLeft size={18} /> <span className="d-none d-md-inline">Quay lại</span>
          </button>
        </div>

        <form onSubmit={submit} className="p-4 p-lg-5">
          <div className="row g-5">
            {/* LEFT COLUMN: Main Info */}
            <div className="col-lg-7">
              <section className="mb-5">
                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2 border-start border-primary border-4 ps-3">
                  <Info size={20} className="text-primary" /> Thông tin cơ bản
                </h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted uppercase">Tên sản phẩm</label>
                    <input className="form-control custom-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted uppercase">Danh mục</label>
                    <select className="form-select custom-input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted uppercase">Giá niêm yết (₫)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 custom-input-side"><DollarSign size={16}/></span>
                      <input type="number" className="form-control custom-input border-start-0 ps-0 fw-bold text-primary" value={form.price_buy} onChange={(e) => setForm({ ...form, price_buy: e.target.value })} required />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2 border-start border-info border-4 ps-3">
                  <Tag size={20} className="text-info" /> Nội dung chi tiết
                </h5>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted uppercase">Mô tả ngắn</label>
                  <textarea className="form-control custom-input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted uppercase">Chi tiết sản phẩm</label>
                  <textarea className="form-control custom-input" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Media & Attributes */}
            <div className="col-lg-5">
              <section className="card border-0 bg-light p-4 rounded-4 mb-4">
                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                  <ImageIcon size={20} className="text-warning" /> Hình ảnh đại diện
                </h5>
                <div className="text-center">
                  <div className="preview-container mb-3 mx-auto shadow-sm rounded-4 overflow-hidden border-dashed">
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="img-fluid" style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="py-5 text-muted fst-italic">Chưa có ảnh</div>
                    )}
                  </div>
                  <input type="file" accept="image/*" id="fileInput" className="d-none" onChange={onFile} />
                  <label htmlFor="fileInput" className="btn btn-dark rounded-pill px-4 shadow-sm btn-sm">Thay đổi hình ảnh</label>
                </div>
              </section>

              <section className="card border-0 bg-light p-4 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <Package size={20} className="text-success" /> Thuộc tính
                  </h5>
                  <button type="button" className="btn btn-sm btn-primary rounded-circle p-1" onClick={addAttribute}><Plus size={20}/></button>
                </div>
                
                <div className="stock-area mb-4 border-bottom pb-3">
                    <label className="form-label small fw-bold text-muted uppercase">Số lượng tồn kho</label>
                    <input type="number" className="form-control custom-input shadow-none" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>

                <div className="attribute-list overflow-auto" style={{ maxHeight: "300px" }}>
                  {productAttributes.length === 0 && <small className="text-muted fst-italic">Sản phẩm chưa có thuộc tính riêng.</small>}
                  {productAttributes.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-3 mb-2 shadow-sm border animate-fade-in position-relative">
                      <select 
                        className="form-select form-select-sm border-0 bg-light mb-2 fw-bold"
                        value={item.attribute_id}
                        onChange={(e) => handleAttrChange(index, 'attribute_id', e.target.value)}
                      >
                        <option value="">-- Loại thuộc tính --</option>
                        {allAttributes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                      <input 
                        type="text" 
                        className="form-control form-control-sm border-0 bg-light"
                        placeholder="Giá trị..." 
                        value={item.value}
                        onChange={(e) => handleAttrChange(index, 'value', e.target.value)}
                      />
                      <button type="button" className="btn btn-link text-danger p-0 position-absolute top-0 end-0 mt-2 me-3" onClick={() => removeAttribute(index)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="mt-5">
                <button 
                  disabled={saving}
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
                >
                  {saving ? <div className="spinner-border spinner-border-sm"></div> : <Save size={20} />}
                  Cập nhật hệ thống
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-input {
          border: 1px solid #f0f0f0;
          background-color: #fafafa;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .custom-input:focus {
          background-color: #fff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
          outline: none;
        }
        .custom-input-side {
           border: 1px solid #f0f0f0;
           border-radius: 12px 0 0 12px !important;
        }
        .uppercase { letter-spacing: 0.05em; font-size: 0.7rem; }
        .preview-container { border: 2px dashed #ddd; background: #fff; }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg-dark { background-color: #1a1a1a !important; }
      `}</style>
    </div>
  );
}
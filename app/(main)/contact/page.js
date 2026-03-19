"use client";

import React, { useState } from "react";
import contactService from "../../services/contactService";
import { Mail, Phone, MapPin, Clock, Send, Loader2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await contactService.sendContact(formData);
      if (res.data.status) {
        setMsg({ type: "success", text: "Cảm ơn bạn! Tin nhắn đã được gửi thành công." });
        setFormData({ name: "", email: "", phone: "", content: "" });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.";
      setMsg({ type: "danger", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-luxury bg-white">
      {/* 1. HERO HEADER */}
      <div className="contact-hero py-5 text-center bg-dark text-white mb-5">
        <div className="container">
          <h1 className="display-4 fw-black text-uppercase ls-2">Kết nối với <span className="text-orange">CamStore</span></h1>
          <p className="lead opacity-75 fw-light">Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ đam mê nhiếp ảnh của bạn 24/7</p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-5">
          
          {/* Cột 1: Thông tin Liên hệ - Luxury Style */}
          <div className="col-lg-5">
            <div className="contact-info-card p-4 h-100">
              <h3 className="fw-bold mb-5 border-bottom pb-3">Thông tin <span className="text-orange">văn phòng</span></h3>
              
              <div className="contact-items">
                {[
                  { icon: <MapPin size={22} />, label: "Địa chỉ Showroom", value: "20 Lương Hữu Khánh, Quận 1, TP. Hồ Chí Minh" },
                  { icon: <Phone size={22} />, label: "Hotline Tư vấn", value: "090 123 4567" },
                  { icon: <Mail size={22} />, label: "Email hỗ trợ", value: "support@camstore.vn" },
                  { icon: <Clock size={22} />, label: "Giờ làm việc", value: "08:00 - 21:00 (Thứ 2 - Chủ nhật)" }
                ].map((item, index) => (
                  <div className="d-flex align-items-start mb-4 pb-3 border-bottom border-light" key={index}>
                    <div className="luxury-icon-box me-3">{item.icon}</div>
                    <div>
                      <h6 className="mb-1 fw-bold text-uppercase x-small ls-1 text-muted">{item.label}</h6>
                      <p className="mb-0 fw-medium text-dark">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="social-connect mt-5 pt-3">
                <h6 className="fw-bold text-uppercase x-small ls-2 mb-3">Mạng xã hội</h6>
                <div className="d-flex gap-3">
                  <div className="social-pill">Facebook</div>
                  <div className="social-pill">Instagram</div>
                  <div className="social-pill">Youtube</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 2: Form Liên hệ - Modern Minimalist */}
          <div className="col-lg-7">
            <div className="form-card-luxury p-5 shadow-lg rounded-4 border">
              <div className="d-flex align-items-center gap-3 mb-4">
                <MessageSquare className="text-orange" size={28} />
                <h3 className="fw-bold mb-0">Gửi lời nhắn</h3>
              </div>
              
              {msg.text && (
                <div className={`alert alert-${msg.type} border-0 rounded-3 small mb-4`}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="luxury-form">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-floating-custom">
                      <input type="text" className="form-control-luxury" placeholder="Họ và tên" required
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      <label className="label-custom">Họ và tên</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating-custom">
                      <input type="text" className="form-control-luxury" placeholder="Số điện thoại" required
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      <label className="label-custom">Số điện thoại</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating-custom">
                      <input type="email" className="form-control-luxury" placeholder="Địa chỉ Email" required
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      <label className="label-custom">Địa chỉ Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating-custom">
                      <textarea className="form-control-luxury" rows="5" placeholder="Bạn cần hỗ trợ điều gì?" required
                        style={{height: '150px'}}
                        value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                      <label className="label-custom">Nội dung tư vấn</label>
                    </div>
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn-luxury-send" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Gửi yêu cầu ngay</>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 3. BẢN ĐỒ TRÀN VIỀN */}
        <div className="row mt-5 pt-5">
          <div className="col-12">
            <div className="map-container-luxury shadow-lg overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324283133!2d106.68808431533411!3d10.776019362148108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3af103233b%3A0xc00868f64584282e!2zMjAgTMawxqFuZyBI4buvdSBaMOhbmgsIFBo4bqhbSBOZ8WpIEzDo28sIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1625547361234!5m2!1svi!2s"
                width="100%"
                height="500"
                style={{ border: 0, filter: 'grayscale(10%) contrast(1.1)' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page-luxury { font-family: 'Inter', -apple-system, sans-serif; }
        .text-orange { color: #CC6600; }
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .fw-black { font-weight: 900; }
        .x-small { font-size: 0.7rem; }

        .contact-hero {
          background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), 
                      url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071') center/cover;
          padding: 100px 0;
        }

        .luxury-icon-box {
          width: 50px; height: 50px;
          background: #1a1a1a; color: #CC6600;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px; transition: 0.3s;
        }

        .contact-info-card:hover .luxury-icon-box { background: #CC6600; color: #fff; }

        .social-pill {
          padding: 6px 15px; border: 1px solid #eee; border-radius: 50px;
          font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: 0.3s;
        }
        .social-pill:hover { background: #111; color: #fff; border-color: #111; }

        .form-card-luxury { background: #fff; position: relative; top: -80px; z-index: 10; }

        .form-floating-custom { position: relative; margin-bottom: 0.5rem; }
        .form-control-luxury {
          width: 100%; padding: 1.5rem 1rem 0.5rem;
          border: 0; border-bottom: 2px solid #eee;
          outline: none; transition: 0.3s; font-weight: 500;
        }
        .form-control-luxury:focus { border-bottom-color: #CC6600; }
        .label-custom {
          position: absolute; left: 1rem; top: 1.2rem;
          font-size: 0.8rem; font-weight: 700; color: #aaa;
          text-transform: uppercase; transition: 0.3s; pointer-events: none;
        }
        .form-control-luxury:focus + .label-custom,
        .form-control-luxury:not(:placeholder-shown) + .label-custom {
          top: 0.3rem; font-size: 0.65rem; color: #CC6600;
        }

        .btn-luxury-send {
          background: #111; color: #fff; border: none;
          padding: 12px 35px; border-radius: 10px;
          font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
          display: inline-flex; align-items: center; gap: 10px; transition: 0.3s;
        }
        .btn-luxury-send:hover { background: #CC6600; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(204,102,0,0.2); }

        .map-container-luxury { border-radius: 30px; margin-top: -30px; }
        
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
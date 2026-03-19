"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Home, ShoppingBag, AlertTriangle, ArrowRight } from "lucide-react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// 1. Component xử lý logic chính
function VNPayResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Đang xác thực giao dịch an toàn...");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const responseCode = params.vnp_ResponseCode;

        if (responseCode === "00") {
          // Gọi API xác thực checksum
          const response = await axios.get(`${API_URL}/api/vnpay-return`, { params });

          if (response.data.status) {
            setStatus("success");
            setMessage("Giao dịch thành công");
            // Xóa giỏ hàng local nếu cần hoặc trigger update
            window.dispatchEvent(new Event("storage"));
          } else {
            setStatus("error");
            setMessage(response.data.message || "Xác thực chữ ký bảo mật thất bại.");
          }
        } else {
          setStatus("error");
          setMessage("Giao dịch đã bị hủy hoặc gặp lỗi từ ngân hàng.");
        }
      } catch (error) {
        console.error("Lỗi xác thực VNPay:", error);
        setStatus("error");
        setMessage("Lỗi kết nối đến hệ thống thanh toán.");
      }
    };

    if (searchParams.has("vnp_ResponseCode")) {
      verifyPayment();
    }
  }, [searchParams, API_URL]);

  return (
    <div className="card border-0 shadow-lg rounded-5 overflow-hidden" style={{ maxWidth: "500px", width: "100%" }}>
      {/* Decorative Top Bar */}
      <div className="h-1 w-100 bg-dark"></div>

      <div className="card-body p-5 text-center">
        
        {/* TRẠNG THÁI: LOADING */}
        {status === "loading" && (
          <div className="py-4 animate-fade-in">
            <div className="spinner-luxury mx-auto mb-4"></div>
            <h5 className="fw-black text-uppercase ls-1">Đang xử lý</h5>
            <p className="text-muted small mb-0">{message}</p>
            <p className="text-muted extra-small mt-2">Vui lòng không tắt trình duyệt...</p>
          </div>
        )}

        {/* TRẠNG THÁI: THÀNH CÔNG */}
        {status === "success" && (
          <div className="py-2 animate-fade-in">
            <div className="mb-4 d-inline-flex p-3 rounded-circle bg-light shadow-sm">
              <CheckCircle2 size={64} className="text-success" />
            </div>
            <h3 className="fw-black text-uppercase ls-1 mb-2">Thanh toán thành công!</h3>
            <p className="text-muted mb-4 px-3">
              Cảm ơn bạn đã lựa chọn <strong className="text-dark">Sony Alpha</strong>. <br/>
              Đơn hàng của bạn đang được chuẩn bị để giao đi.
            </p>
            
            <div className="d-flex flex-column gap-3">
              <Link href="/orders" className="btn-luxury-dark w-100 shadow-sm">
                <ShoppingBag size={18} /> QUẢN LÝ ĐƠN HÀNG
              </Link>
              <Link href="/" className="btn-luxury-outline w-100">
                <Home size={18} /> VỀ TRANG CHỦ
              </Link>
            </div>
          </div>
        )}

        {/* TRẠNG THÁI: THẤT BẠI */}
        {status === "error" && (
          <div className="py-2 animate-fade-in">
            <div className="mb-4 d-inline-flex p-3 rounded-circle bg-danger-subtle shadow-sm">
              <XCircle size={64} className="text-danger" />
            </div>
            <h3 className="fw-black text-uppercase ls-1 mb-2 text-danger">Thanh toán thất bại</h3>
            <p className="text-muted mb-4 px-3">{message}</p>
            
            <div className="d-flex flex-column gap-3">
              <Link href="/checkout" className="btn-luxury-dark w-100 shadow-sm">
                <ArrowRight size={18} /> THỬ THANH TOÁN LẠI
              </Link>
              <Link href="/" className="btn-luxury-outline w-100">
                <Home size={18} /> VỀ TRANG CHỦ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Component cha bọc Suspense
export default function VNPayReturnPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3 font-sans">
      <Suspense fallback={
        <div className="text-center">
           <div className="spinner-luxury mx-auto"></div>
        </div>
      }>
        <VNPayResultContent />
      </Suspense>
      
      <style jsx global>{`
        .font-sans { font-family: 'Inter', -apple-system, sans-serif; }
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .extra-small { font-size: 11px; }
        
        /* Spinner Luxury */
        .spinner-luxury {
          width: 50px; height: 50px; border: 4px solid #f3f3f3;
          border-top: 4px solid #CC6600; border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Button Luxury Dark */
        .btn-luxury-dark {
          background: #111; color: #fff; padding: 14px;
          border-radius: 50px; font-weight: 800; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: 0.3s; font-size: 13px; letter-spacing: 1px;
        }
        .btn-luxury-dark:hover {
          background: #CC6600; color: #fff; transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(204,102,0,0.25);
        }

        /* Button Luxury Outline */
        .btn-luxury-outline {
          background: transparent; color: #555; padding: 14px;
          border-radius: 50px; font-weight: 700; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: 0.3s; font-size: 13px; border: 2px solid #eee;
        }
        .btn-luxury-outline:hover {
          border-color: #111; color: #111; background: #fff;
        }

        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
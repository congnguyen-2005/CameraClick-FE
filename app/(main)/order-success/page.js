import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function OrderSuccess() {
    return (
        <>
            

            <div className="container mt-5" style={{ maxWidth: "650px" }}>
                <div className="card shadow-lg border-0 p-4 text-center mb-5">

                    {/* ICON */}
                    <div className="mb-3">
                        <i
                            className="bi bi-check-circle-fill text-success"
                            style={{ fontSize: "70px" }}
                        ></i>
                    </div>

                    <h2 className="fw-bold text-success">Đặt hàng thành công!</h2>

                    <p className="mt-3 fs-5 text-secondary">
                        Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.
                    </p>

                    {/* BUTTON */}
                    <Link href="/orders" className="btn btn-primary btn-lg mt-4 px-4">
                        Xem đơn hàng
                    </Link>
                </div>
            </div>

           
        </>
    );
}

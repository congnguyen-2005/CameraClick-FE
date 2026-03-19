// app/(dashboard)/admin/products/[id]/show/page.js
"use client";

import React from "react";
import { useEffect, useState, use } from "react";
import ProductService from "../../../../../services/productService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ShowProduct({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    ProductService.get(id)
      .then((res) => setProduct(res.data.data))
      .catch((err) => {
        console.error(err);
        alert("Lỗi tải sản phẩm");
      });
  }, [id]);

  if (!product) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="container py-4">
      <div className="card p-4 shadow-sm" style={{ maxWidth: 900 }}>
        <h3>{product.name}</h3>

        {product.image_url || product.thumbnail ? (
          <img src={product.image_url || product.thumbnail} alt={product.name} style={{ width: 360, height: 240, objectFit: "cover", marginBottom: 12 }} />
        ) : null}

        <p><strong>Giá:</strong> {product.price_buy ? Number(product.price_buy).toLocaleString() + "₫" : "-"}</p>
        <p><strong>Tồn kho:</strong> {product.stock ?? "-"}</p>
        <p><strong>Mô tả:</strong></p>
        <div dangerouslySetInnerHTML={{ __html: product.description || "" }} />
      </div>
    </div>
  );
}

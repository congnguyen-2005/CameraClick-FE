"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoryPage({ params }) {
    const { id } = params; // Lấy ID từ URL (ví dụ: 1, 2, 3...)
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Gọi API lấy sản phẩm theo danh mục từ Backend Railway
                const response = await axios.get(`https://cameraclick-be-production.up.railway.app/api/products?category_id=${id}`);
                setProducts(response.data.data || response.data); 
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải sản phẩm danh mục:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Đang tải sản phẩm...</div>;

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl font-bold mb-5">Danh mục ID: {id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.length > 0 ? products.map((item) => (
                    <div key={item.id} className="border p-4 rounded-lg shadow">
                        <img src={item.thumbnail} alt={item.name} className="w-full h-48 object-cover mb-2" />
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-red-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                    </div>
                )) : <p>Không có sản phẩm nào trong danh mục này.</p>}
            </div>
        </div>
    );
}
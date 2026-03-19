"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TopicService from "../../../../../services/TopicService";

export default function TopicEdit() {
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        slug: "",
        sort_order: 0,
        description: "",
        status: 1
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await TopicService.getById(id);
            setForm(res.data.data);
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await TopicService.update(id, form);
            alert("Cập nhật chủ đề thành công!");
        } catch (error) {
            alert("Lỗi cập nhật!");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Chỉnh sửa Chủ Đề</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        {/* Tên chủ đề */}
                        <div className="mb-3">
                            <label className="form-label">Tên chủ đề</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div className="mb-3">
                            <label className="form-label">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                className="form-control"
                                value={form.slug}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Sort Order */}
                        <div className="mb-3">
                            <label className="form-label">Thứ tự</label>
                            <input
                                type="number"
                                name="sort_order"
                                className="form-control"
                                value={form.sort_order}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows="3"
                                value={form.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Status */}
                        <div className="mb-3">
                            <label className="form-label">Trạng thái</label>
                            <select
                                name="status"
                                className="form-select"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="1">Hiển thị</option>
                                <option value="0">Ẩn</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-success px-4">
                            Cập nhật
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

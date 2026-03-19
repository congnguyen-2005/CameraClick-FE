"use client";
import { useState } from "react";
import TopicService from "../../../../services/TopicService";

function TopicAdd() {
    const [form, setForm] = useState({
        name: "",
        slug: "",
        sort_order: 0,
        description: "",
        status: 1
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await TopicService.create(form);
            alert("Thêm chủ đề thành công!");
        } catch (error) {
            alert("Lỗi tạo chủ đề!");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Thêm Chủ Đề</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">Tên chủ đề</label>
                            <input
                                className="form-control"
                                name="name"
                                placeholder="Nhập tên chủ đề"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Slug</label>
                            <input
                                className="form-control"
                                name="slug"
                                placeholder="Slug"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Thứ tự</label>
                            <input
                                className="form-control"
                                name="sort_order"
                                type="number"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="3"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Trạng thái</label>
                            <select
                                className="form-select"
                                name="status"
                                onChange={handleChange}
                            >
                                <option value="1">Hiển thị</option>
                                <option value="0">Ẩn</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-success px-4">
                            Lưu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TopicAdd;

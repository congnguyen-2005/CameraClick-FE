"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TopicService from "../../../services/TopicService";

function TopicList() {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await TopicService.getAll();
            setTopics(res.data.data);
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            await TopicService.delete(id);
            setTopics(topics.filter(t => t.id !== id));
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Danh sách Chủ Đề</h2>

                <Link href="/admin/topic/add" className="btn btn-primary">
                    ➕ Thêm Chủ Đề
                </Link>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Slug</th>
                        <th>Thứ tự</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.slug}</td>
                            <td>{item.sort_order}</td>
                            <td>
                                <Link
                                    href={`/admin/topic/edit/${item.id}`}
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    Sửa
                                </Link>

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TopicList;

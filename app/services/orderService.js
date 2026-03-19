import axios from "axios";

// Đảm bảo dùng 127.0.0.1 để tránh lỗi Network Error trên Windows
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";

const getAuthHeader = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return { 
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        } 
    };
};

const OrderService = {
    // 1. API cho Admin: Lấy toàn bộ đơn hàng hệ thống (Có hỗ trợ search)
    getAll: async (params = {}) => {
        return await axios.get(`${API_URL}/api/admin/orders`, { 
            ...getAuthHeader(),
            params: params 
        });
    },

    // 2. API cho User: Xem lịch sử mua hàng cá nhân
    getHistory: async () => {
        return await axios.get(`${API_URL}/api/orders`, getAuthHeader());
    },

    // 3. API cho User: Đặt hàng
    checkout: async (data) => {
        return await axios.post(`${API_URL}/api/checkout`, data, getAuthHeader());
    },
    
    // 4. API chung: Xem chi tiết một đơn hàng
    getDetail: async (id) => {
        return await axios.get(`${API_URL}/api/orders/${id}`, getAuthHeader());
    },

    // 5. API cho Admin: Cập nhật trạng thái (Duyệt/Giao hàng)
    updateStatus: async (id, status) => {
        return await axios.put(
            `${API_URL}/api/admin/orders/${id}/status`, 
            { status }, 
            getAuthHeader()
        );
    },

    // 6. API cho Admin: Hủy đơn hàng kèm lý do
    cancelOrder: async (id, reason) => {
        return await axios.put(
            `${API_URL}/api/admin/orders/${id}/cancel`, 
            { reason }, 
            getAuthHeader()
        );
    }
};

export default OrderService;
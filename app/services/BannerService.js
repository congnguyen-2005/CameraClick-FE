import http from "./http";

const BannerService = {
    getAll: () => http.get("banner"),
    getById: (id) => http.get(`banner/${id}`),

    // Sử dụng cho Thêm mới
    create: (formData) => http.post("banner", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),

    // QUAN TRỌNG: Laravel thường không nhận File qua PUT. 
    // Ta dùng POST và giả lập PUT bằng _method
    update: (id, formData) => http.post(`banner/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),

    delete: (id) => http.delete(`banner/${id}`),
};

export default BannerService;
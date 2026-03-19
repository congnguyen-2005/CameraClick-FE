import http from "./http";

const ProductService = {
    // 1. Lấy danh sách (Hỗ trợ params để lọc/tìm kiếm)
    // Đã thêm alias getList để khớp với code bên ProductDetail
    getList(params) {
        return http.get("/products", { params });
    },

    // Giữ lại getAll nếu các trang khác đang dùng
    getAll(params) {
        return http.get("/products", { params });
    },

    // 2. Các hàm lấy danh sách đặc biệt
    getSaleProducts: () => http.get("/products-sale"),
    getNewProducts: (limit = 8) => http.get(`/product-new?limit=${limit}`),
    
    getByCategory(slug) {
        return http.get(`/products/category/${slug}`);
    },

    // 3. Chi tiết sản phẩm
    get(id) {
        return http.get(`/products/${id}`);
    },
    getDetail(id) {
        return http.get(`/products/${id}`);
    },

    // 4. Thêm mới
    create(data) {
        return http.post("/products", data);
    },

    // 5. Cập nhật
    update(id, data) {
        if (data instanceof FormData) {
            data.append("_method", "PUT");
            return http.post(`/products/${id}`, data);
        }
        return http.put(`/products/${id}`, data);
    },

    // 6. Xóa
    delete(id) {
        return http.delete(`/products/${id}`);
    },
};

export default ProductService;
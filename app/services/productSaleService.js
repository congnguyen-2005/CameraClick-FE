import http from "./http";

const productSaleService = {
    getAll(params = {}) {
        return http.get("/product-sale", { params });
    },

    get(id) {
        return http.get(`/product-sale/${id}`);
    },

    create(data) {
        return http.post("/product-sale", data);
    },

    update(id, data) {
        return http.put(`/product-sale/${id}`, data);
    },

    delete(id) {
        return http.delete(`/product-sale/${id}`);
    },
};

export default productSaleService;

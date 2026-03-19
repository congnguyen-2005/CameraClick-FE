import http from "./http";

const productAttributeService = {
    getAll(product_id) {
        const url = product_id
            ? `/product-attribute?product_id=${product_id}`
            : `/product-attribute`;

        return http.get(url);
    },

    get(id) {
        return http.get(`/product-attribute/${id}`);
    },

    create(data) {
        return http.post("/product-attribute", data);
    },

    update(id, data) {
        return http.put(`/product-attribute/${id}`, data);
    },

    delete(id) {
        return http.delete(`/product-attribute/${id}`);
    },
};

export default productAttributeService;

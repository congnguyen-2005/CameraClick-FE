import http from "./http";

const productImageService = {
    getAll(product_id) {
        const url = product_id
            ? `/product-image?product_id=${product_id}`
            : `/product-image`;
        return http.get(url);
    },

    get(id) {
        return http.get(`/product-image/${id}`);
    },

    create(data) {
        return http.post("/product-image", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },


    // services/productImageService.js
update(id, formData) {
    // Ép Laravel hiểu đây là lệnh PUT thông qua POST
    if (formData instanceof FormData) {
        formData.append("_method", "PUT");
    }
    return http.post(`/product-image/${id}`, formData);
},

    delete(id) {
        return http.delete(`/product-image/${id}`);
    }
};

export default productImageService;

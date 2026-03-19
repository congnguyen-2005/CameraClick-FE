import http from "./http";

const attributeService = {
    getAll() {
        return http.get("/attribute");
    },

    get(id) {
        return http.get(`/attribute/${id}`);
    },

    create(data) {
        return http.post("/attribute", data);
    },

    update(id, data) {
        return http.put(`/attribute/${id}`, data);
    },

    delete(id) {
        return http.delete(`/attribute/${id}`);
    },
};

export default attributeService;

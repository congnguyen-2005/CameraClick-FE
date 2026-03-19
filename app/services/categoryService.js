import http from "./http";

const categoryService = {
  getAll() {
    return http.get("/category");
  },
  getById(id) {
    return http.get(`/category/${id}`);
  },
  store(formData) {
    return http.post("/category", formData);
  },
  update(id, formData) {
    return http.post(`/category/${id}?_method=PUT`, formData);
  },
  delete(id) {
    return http.delete(`/category/${id}`);
  },
};

export default categoryService;

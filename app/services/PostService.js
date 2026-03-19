import http from "./http";

const PostService = {
  getAll() {
    return http.get("/post");
  },

  get(id) {
    return http.get(`/post/${id}`); 
  },

  create(data) {
    return http.post("/post", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update(id, data) {
    return http.post(`/post/${id}?_method=PUT`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete(id) {
    return http.delete(`/post/${id}`);
  },
};

export default PostService;

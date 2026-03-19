import http from "./http";

const productstoreService = {
  index: () => {
    return http.get("/product-store"); 
  },
  // 📦 tồn kho hiện tại
  history() {
    return http.get("/inventory/history");
  },

  // 📥 nhập kho
  importStock(data) {
    return http.post("/inventory/import", data);
  },

  // 📤 xuất kho
  exportStock(data) {
    return http.post("/inventory/export", data);
  },

  // 🧾 lịch sử nhập / xuất (TẤT CẢ)
  historyLog(params = {}) {
    return http.get("/inventory/history", {
      params,
    });
  },

  // 🧾 lịch sử theo sản phẩm (nếu sau này dùng)
  historyByProduct(product_id) {
    return http.get("/inventory/history", {
      params: { product_id },
    });
  },

  // ✏️ sửa tồn kho
  updateStock(id, data) {
    return http.put(`/inventory/stock/${id}`, data);
  },

  // 🗑 xóa tồn kho
  deleteStock(id) {
    return http.delete(`/inventory/stock/${id}`);
  },
};

export default productstoreService;

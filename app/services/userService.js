import http from "./http";

const UserService = {
  /* ==============================================
     1. PHẦN DÀNH CHO ADMIN (QUẢN LÝ USER)
     ============================================== */
  getAll: () => http.get("/users"),
  getById: (id) => http.get(`/users/${id}`),
  create: (data) => http.post("/users", data),
  // Update của Admin thường chỉ sửa thông tin text, không sửa avatar user khác
  update: (id, data) => http.put(`/users/${id}`, data), 
  delete: (id) => http.delete(`/users/${id}`),


  /* ==============================================
     2. PHẦN DÀNH CHO CLIENT (NGƯỜI DÙNG TỰ QUẢN LÝ)
     ============================================== */
  
  // Lấy thông tin cá nhân (Profile)
  getProfile: () => http.get("/user"),

  /**
   * Cập nhật hồ sơ cá nhân (Bao gồm cả Avatar)
   * Lưu ý: Khi upload file, nên dùng POST và set header multipart/form-data
   * Backend Laravel: Route::post('/user/update-profile', ...)
   */
  updateProfile: (data) => {
    return http.post("/user/update-profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Đổi mật khẩu
  changePassword: (data) => {
    return http.post("/user/change-password", data);
  },

  // Lấy lịch sử đơn hàng của chính user đó
  getOrders: () => {
    return http.get("/orders"); // Backend tự lấy Auth::id() để lọc đơn hàng
  },

  // Hủy đơn hàng (Chỉ khi trạng thái chờ duyệt)
  cancelOrder: (id) => {
    return http.put(`/orders/${id}/cancel`);
  }
};

export default UserService;
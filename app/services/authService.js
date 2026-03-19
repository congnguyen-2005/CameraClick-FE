import http from "./http"; // Đảm bảo đường dẫn này đúng với file axios config của bạn

const authService = {
  // Đăng nhập
  login: (data) => {
    return http.post("/login", data);
  },

  // Đăng ký
  register: (data) => {
    return http.post("/register", data);
  },

  // Đăng xuất (Gửi token lên để Laravel thu hồi/hủy token)
  logout: () => {
    return http.post("/logout");
  },

  // Lấy thông tin user hiện tại (Để kiểm tra token còn hạn không)
  getProfile: () => {
    return http.get("/user");
  }
};

export default authService;
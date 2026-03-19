import axios from "axios";

const http = axios.create({
  baseURL: "NEXT_PUBLIC_API_URL=https://cameraclick-be-production.up.railway.app/api",
  headers: {

    "Accept": "application/json",
  },
});

// --- 1. TỰ ĐỘNG GỬI TOKEN LÊN SERVER (REQUEST INTERCEPTOR) ---
http.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Dựa trên ảnh của bạn, key chính xác là "token"
      // Chúng ta lấy ưu tiên "token", nếu không có thì thử "accessToken"
      const storedToken = localStorage.getItem("token") || localStorage.getItem("accessToken");
      
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. XỬ LÝ KHI TOKEN HẾT HẠN (RESPONSE INTERCEPTOR) ---
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        // Xóa sạch các loại key để reset trạng thái
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default http;
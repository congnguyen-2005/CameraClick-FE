"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function withAuth(Component, allowedRoles = []) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user")); // Lấy user từ local
      const userRoles = user?.roles || [];

      if (!user) {
        router.push("/login");
      } else if (allowedRoles.length > 0 && !allowedRoles.some(role => userRoles.includes(role))) {
        alert("Bạn không có quyền truy cập!");
        router.push("/"); // Đuổi về trang chủ
      } else {
        setVerified(true);
      }
    }, []);

    if (!verified) return <div>Đang kiểm tra quyền...</div>;
    return <Component {...props} />;
  };
}
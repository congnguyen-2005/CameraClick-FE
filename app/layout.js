// app/layout.js

import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  // Đổi title cho đúng với tab trình duyệt của bạn
  title: "CameraClick - Trang chủ", 
  description: "Hệ sinh thái nhiếp ảnh chuyên nghiệp Alpha",
  // ÉP BUỘC NEXT.JS NHẬN LOGO MỚI (Trỏ vào thư mục public)
  icons: {
    icon: '/favicon.ico', 
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        
        <Header />

        <main style={{ minHeight: "80vh" }}>
          {children}
        </main>

        <Footer />
        
      </body>
    </html>
  );
}
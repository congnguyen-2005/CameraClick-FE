// app/layout.js

import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CameraPro Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      {/* 1. Áp dụng font Inter vào body */}
      <body className={inter.className}>
        
        {/* 2. Header phải nằm TRONG body */}
        <Header />

        {/* 3. Phần nội dung chính (children) */}
        {/* Thêm minHeight để đẩy Footer xuống đáy nếu trang ít nội dung */}
        <main style={{ minHeight: "80vh" }}>
          {children}
        </main>

        {/* 4. Footer cũng phải nằm TRONG body */}
        <Footer />
        
      </body>
    </html>
  );
}
// app/layout.js
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CameraClick - Hệ sinh thái Alpha",
  description: "Website bán máy ảnh chuyên nghiệp",
  icons: {
    icon: '/favicon.ico', // File này phải nằm trong thư mục public
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
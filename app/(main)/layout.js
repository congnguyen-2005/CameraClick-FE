import Header from "../components/Header"; // Chú ý đường dẫn ../
import Footer from "../components/Footer";
export const metadata = {
  title: "CameraClick – Trang chủ",
  description: "Website bán máy ảnh chuyên nghiệp",
};

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }} className="container-fluid px-0">
        {children}
      </main>
      <Footer />
    </>
  );
} 
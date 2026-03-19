export const metadata = {
  title: "CameraPro – Trang chủ",
  description: "Website bán máy ảnh chuyên nghiệp",
};

export default function MainLayout({ children }) {
  return (
    
        <div className="container-fluid px-0">
          {children}
        </div>
      
  );
}

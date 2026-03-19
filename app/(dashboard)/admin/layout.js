// app/(dashboard)/layout.js
import AdminSidebar from "../../components/admin/AdminSidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}

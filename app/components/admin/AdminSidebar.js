"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  Box,
  Users,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  FileText,
  ClipboardList,
  Tag,
  Image as ImageIcon,
  PackageSearch,
  Archive,
  Layers,
  LogOut,
  LogIn
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminSidebar() {
  const path = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Khắc phục lỗi Hydration bằng cách đảm bảo component đã được mount trên client
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuGroups = [
    {
      group: "HỆ THỐNG",
      items: [{ label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin" }],
    },
    {
      group: "CỬA HÀNG",
      items: [
        { label: "Category", icon: <List size={20} />, href: "/admin/category" },
        { label: "Menu", icon: <ClipboardList size={20} />, href: "/admin/menu" },
        { label: "Products", icon: <Box size={20} />, href: "/admin/products" },
        { label: "Attributes", icon: <Tag size={20} />, href: "/admin/attribute" },
        { label: "Product Attributes", icon: <Tag size={20} />, href: "/admin/product-attribute" },
        { label: "Product Images", icon: <ImageIcon size={20} />, href: "/admin/product-image" },
        { label: "Product Sales", icon: <PackageSearch size={20} />, href: "/admin/product-sale" },
      ],
    },
    {
      group: "KHO & ĐƠN HÀNG",
      items: [
        { label: "Inventory", icon: <Archive size={20} />, href: "/admin/inventory" },
        { label: "Orders", icon: <ShoppingBag size={20} />, href: "/admin/orders" },
      ],
    },
    {
      group: "NỘI DUNG",
      items: [
        { label: "Posts", icon: <FileText size={20} />, href: "/admin/post" },
        { label: "Topics", icon: <List size={20} />, href: "/admin/topic" },
        { label: "Banners", icon: <ImageIcon size={20} />, href: "/admin/banner" },
      ],
    },
    {
      group: "THÀNH VIÊN",
      items: [{ label: "Users", icon: <Users size={20} />, href: "/admin/users" }],
    },
  ];

  if (!mounted) return null;

  return (
    <div
      className={`d-flex flex-column shadow-lg ${isCollapsed ? "sidebar-mini" : "sidebar-full"}`}
      style={{
        minHeight: "100vh",
        width: isCollapsed ? "80px" : "260px",
        backgroundColor: "#111214",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* BRANDING & TOGGLE */}
      <div className="p-4 mb-2 d-flex align-items-center justify-content-between">
        {!isCollapsed && (
          <div className="d-flex align-items-center gap-2 overflow-hidden" style={{ animation: "fadeIn 0.3s" }}>
            <div className="bg-primary p-2 rounded-3 shadow-sm flex-shrink-0">
              <Layers size={22} className="text-white" />
            </div>
            <span className="fw-bold fs-5 text-white" style={{ letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
              Admin
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn btn-link text-white-50 p-1 border-0 shadow-none ms-auto d-flex align-items-center justify-content-center"
          style={{ transition: "transform 0.3s" }}
        >
          {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* MENU NAVIGATION */}
      <div 
        className="flex-grow-1 px-3 overflow-y-auto" 
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            {!isCollapsed && (
              <small 
                className="text-white fw-bold text-uppercase opacity-50 ms-2 mb-2 d-block" 
                style={{ fontSize: '10px', letterSpacing: '1px' }}
              >
                {group.group}
              </small>
            )}
            {group.items.map((item, i) => {
              const isActive = path === item.href || (item.href !== "/admin" && path.startsWith(item.href));
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`d-flex align-items-center p-2 mb-1 rounded-3 text-decoration-none transition-all
                    ${isActive ? "bg-primary text-white shadow-sm" : "text-light opacity-75 sidebar-hover-link"}`}
                  style={{ transition: "all 0.2s ease" }}
                >
                  <div className={`d-flex align-items-center gap-3 ${isCollapsed ? "mx-auto" : "ps-1"}`}>
                    <span className="text-white flex-shrink-0">
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="small fw-medium text-nowrap" style={{ fontSize: "0.9rem" }}>
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-3 mt-auto border-top border-secondary border-opacity-25" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
         <Link 
            href="/admin/login" 
            className="d-flex align-items-center gap-3 text-white-50 p-2 text-decoration-none rounded-3 mb-1 sidebar-hover-link"
          >
          <LogIn size={18} className={isCollapsed ? "mx-auto" : ""} />
          {!isCollapsed && <span className="small">Đăng nhập</span>}
        </Link>
        <button 
          className="btn btn-link text-danger d-flex align-items-center gap-3 w-100 p-2 text-decoration-none border-0 shadow-none rounded-3 sidebar-hover-link"
        >
          <LogOut size={18} className={isCollapsed ? "mx-auto" : ""} />
          {!isCollapsed && <span className="small fw-bold">Đăng xuất</span>}
        </button>
      </div>

      <style jsx global>{`
        .sidebar-hover-link:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
          opacity: 1 !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Chart from "chart.js/auto";
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  LayoutDashboard, Loader2 
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

// Import các services
import OrderService from "../../services/orderService";
import ProductService from "../../services/productService";
import userService from "../../services/userService";

export default function AdminDashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  // 1. Khởi tạo mount để tránh lỗi SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Hàm tính toán và fetch dữ liệu
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Gọi đồng thời các API
      const [orderRes, productRes] = await Promise.all([
        OrderService.getAll(),
        ProductService.getAll(),
        // Nếu có api user: userService.getAll()
      ]);

      // Xử lý dữ liệu an toàn (phòng trường hợp Laravel trả về Object Paginate)
      const extractData = (res) => {
          const raw = res?.data?.data;
          return Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      };

      const allOrders = extractData(orderRes);
      const allProducts = extractData(productRes);
      const totalUsers = 250; // Mock dữ liệu hoặc lấy từ API userRes

      // --- TÍNH TOÁN KPI ---
      // Chỉ tính doanh thu các đơn không bị hủy (status != 4)
      const totalRevenue = allOrders
        .filter(o => parseInt(o.status) !== 4)
        .reduce((acc, order) => acc + Number(order.total_money || 0), 0);

      const now = new Date();
      const newOrders = allOrders.filter(o => {
          const date = new Date(o.created_at);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length;

      setStats([
        { title: "Tổng doanh thu", value: `${(totalRevenue / 1000000).toFixed(1)}M`, icon: <DollarSign />, color: "bg-primary", trend: "+12%" },
        { title: "Đơn hàng mới", value: `${newOrders}+`, icon: <ShoppingBag />, color: "bg-success", trend: "+8%" },
        { title: "Sản phẩm", value: allProducts.length, icon: <TrendingUp />, color: "bg-warning", trend: "Sẵn có" },
        { title: "Thành viên", value: totalUsers, icon: <Users />, color: "bg-info", trend: "+5%" },
      ]);

      // --- XỬ LÝ BIỂU ĐỒ (6 THÁNG GẦN NHẤT) ---
      const months = [];
      const revenues = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthLabel = `T. ${d.getMonth() + 1}`;
        months.push(monthLabel);

        const monthlySum = allOrders
          .filter(o => {
            const orderDate = new Date(o.created_at);
            return orderDate.getMonth() === d.getMonth() && 
                   orderDate.getFullYear() === d.getFullYear() &&
                   parseInt(o.status) !== 4;
          })
          .reduce((sum, o) => sum + Number(o.total_money || 0), 0);
        
        revenues.push(monthlySum / 1000000); // Đơn vị Triệu VNĐ
      }

      setChartData({ labels: months, values: revenues });

    } catch (error) {
      console.error("Lỗi fetch dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) fetchData();
  }, [fetchData, mounted]);

  // 3. Vẽ biểu đồ
  useEffect(() => {
    if (loading || !chartRef.current || !mounted) return;

    const ctx = chartRef.current.getContext("2d");
    
    // Tạo hiệu ứng Gradient cho cột biểu đồ
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(204, 102, 0, 1)"); 
    gradient.addColorStop(1, "rgba(204, 102, 0, 0.2)");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [{
          label: "Doanh thu (Triệu VNĐ)",
          data: chartData.values,
          backgroundColor: gradient,
          borderColor: "#CC6600",
          borderWidth: 1,
          borderRadius: 10,
          hoverBackgroundColor: "#CC6600",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111',
                padding: 12,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
          y: { 
              beginAtZero: true, 
              grid: { color: "#f3f3f3", drawBorder: false },
              ticks: { callback: (val) => val + 'M' }
          },
          x: { grid: { display: false } }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [loading, chartData, mounted]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-white text-center">
        <Loader2 size={40} className="text-warning spin-animation mb-3" />
        <h6 className="fw-bold text-muted text-uppercase ls-2">Hệ thống đang tổng hợp dữ liệu...</h6>
        <style jsx>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 px-lg-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div>
          <h2 className="text-dark mb-0 d-flex align-items-center gap-2 fw-black text-uppercase ls-1">
            <LayoutDashboard size={28} className="text-warning" /> Dashboard
          </h2>
          <p className="text-muted small mb-0">Thống kê hoạt động kinh doanh toàn hệ thống Alpha.</p>
        </div>
        <button onClick={fetchData} className="btn btn-white shadow-sm rounded-3 px-3 fw-bold small border bg-white">
          Làm mới
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white dashboard-card border-start-custom">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className={`${stat.color} bg-opacity-10 p-2 rounded-3 text-dark d-flex align-items-center justify-content-center`} style={{ width: '45px', height: '45px' }}>
                  {stat.icon}
                </div>
                <span className="badge rounded-pill px-2 py-1 fw-bold bg-success-subtle text-success small">
                   {stat.trend}
                </span>
              </div>
              <h6 className="text-muted fw-bold small text-uppercase mb-1 ls-1">{stat.title}</h6>
              <h3 className="text-dark mb-0 fw-black">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="row">
        <div className="col-12 col-xl-8 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-uppercase ls-1 small">Biểu đồ tăng trưởng doanh thu</h5>
              <div className="small text-muted fw-bold px-2 py-1 bg-light rounded">M: Triệu VNĐ</div>
            </div>
            <div style={{ position: "relative", height: "320px", width: "100%" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
        
        {/* QUICK REPORT */}
        <div className="col-12 col-xl-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-100 shadow-lg">
            <h5 className="fw-bold mb-3 ls-1 text-uppercase text-warning small">Báo cáo nhanh tháng {new Date().getMonth() + 1}</h5>
            <p className="small text-white-50">Tiến độ doanh thu đạt được so với mục tiêu đề ra cho quý này.</p>
            
            <div className="mt-4">
                <div className="d-flex justify-content-between mb-2 small text-uppercase ls-1 opacity-75 fw-bold">
                    <span>Mục tiêu quý</span>
                    <span>68%</span>
                </div>
                <div className="progress bg-secondary bg-opacity-25" style={{ height: '10px' }}>
                    <div className="progress-bar bg-warning w-75 rounded-pill shadow-warning"></div>
                </div>
            </div>

            <div className="mt-5 d-grid gap-2">
              <button className="btn btn-warning rounded-3 py-2 fw-bold text-dark border-0 shadow-sm">
                Xuất Báo Cáo PDF
              </button>
              <button className="btn btn-outline-light rounded-3 py-2 fw-bold border-1 opacity-75">
                Cấu Hình Chỉ Số
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .fw-black { font-weight: 900; }
        .ls-1 { letter-spacing: 1px; }
        .ls-2 { letter-spacing: 2px; }
        .dashboard-card { 
            transition: all 0.3s ease; 
            border: 1px solid #f0f0f0 !important;
        }
        .dashboard-card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
            border-color: #CC6600 !important;
        }
        .shadow-warning { box-shadow: 0 0 15px rgba(255, 193, 7, 0.4); }
        canvas { filter: drop-shadow(0 5px 5px rgba(0,0,0,0.02)); }
      `}</style>
    </div>
  );
}
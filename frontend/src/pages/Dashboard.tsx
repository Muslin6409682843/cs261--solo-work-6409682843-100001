// src/pages/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // กำหนดข้อมูลแบบฟอร์มและ path ของแต่ละหน้า
  const forms = [
    { label: "แบบฟอร์มคำร้องทั่วไป", path: "/form/general" },
    { label: "แบบฟอร์มคำร้องเพิ่ม-ถอน รายวิชา", path: "/form/add-drop" },
    { label: "แบบฟอร์มคำร้องลาพักการศึกษา", path: "/form/leave" },
  ];

  return (
    <div
      style={{
        padding: "20px 230px 20px 20px",
        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
      }}
    >
      {/* หัวข้อใหญ่ */}
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#333" }}>
        แบบฟอร์มคำร้อง
      </h1>

      {/* รายละเอียดแบบฟอร์ม */}
      <div style={{ marginTop: "20px", color: "#736C61", fontSize: "18px" }}>
        {forms.map((form, idx) => (
          <div
            key={idx}
            onClick={() => navigate(form.path)}
            style={{
              padding: "10px 0",
              borderBottom:
                idx < forms.length - 1 ? "1px solid #736C61" : "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#007BFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#736C61")}
          >
            {form.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

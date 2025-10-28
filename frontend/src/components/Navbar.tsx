import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // state สำหรับ popup
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // ฟังก์ชัน logout จริง ๆ
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/"); // กลับไปหน้า login
  };

  return (
    <>
      <nav
        style={{
          width: "100%",
          maxWidth: "100vw",
          height: "80px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxSizing: "border-box",
          overflow: "hidden",
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
        }}
      >
        {/* โลโก้ + ชื่อระบบ */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{
              height: "50px",
              marginRight: "16px",
              objectFit: "contain",
            }}
          />
          <h3 style={{ color: "#333", fontWeight: 600, margin: 0 }}>
            ระบบยื่นคำร้อง
          </h3>
        </div>

        {/* ปุ่ม Logout (เฉพาะหน้าอื่นนอกจาก /) */}
        {!["/", "/login"].includes(location.pathname) && (
          <button
            onClick={() => setShowLogoutPopup(true)}
            style={{
              backgroundColor: "#FFCE01",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e5ba00")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFCE01")
            }
          >
            ออกจากระบบ
          </button>
        )}
      </nav>

      {/* 🔲 Popup ยืนยันการออกจากระบบ */}
      {showLogoutPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              textAlign: "center",
              width: "300px",
            }}
          >
            <p style={{ marginBottom: "20px", fontSize: "16px" }}>
              คุณต้องการออกจากระบบหรือไม่?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <button
                onClick={handleConfirmLogout}
                style={{
                  backgroundColor: "#FFCE01",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ยืนยัน
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                style={{
                  backgroundColor: "#ddd",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

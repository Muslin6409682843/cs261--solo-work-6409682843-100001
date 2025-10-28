// src/components/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, logout } from "../utils/auth";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // เมื่อเข้ามาหน้า Login ตรวจสอบว่ามี flag logoutSuccess
  useEffect(() => {
    if (location.state?.logoutSuccess) {
      setShowLogoutPopup(true);
      // ลบ state หลังใช้ เพื่อไม่ให้ popup โผล่ซ้ำ
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบ");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        if (res.status === 400)
          setError("ข้อมูลที่ส่งไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
        else if (res.status === 401)
          setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        else setError("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง");
        return;
      }

      const data = await res.json();
      if (data.status === false)
        setError(data.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      else {
        localStorage.setItem("token", data.token || "dummy-token");

        // บันทึกข้อมูลผู้ใช้ลง DB
        try {
          await fetch("http://localhost:8080/api/user/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: data.username,
              displayNameTh: data.displayname_th,
              displayNameEn: data.displayname_en,
              email: data.email,
              faculty: data.faculty,
              department: data.department,
              type: data.type,
            }),
          });
        } catch (saveError) {
          console.error("❌ Error saving user to DB:", saveError);
        }

        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่ภายหลัง");
      console.error(err);
    }
  };

  const handleConfirmLogout = () => {
    logout(navigate);
    setShowLogoutPopup(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('/images/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
        overflow: "hidden",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "320px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          เข้าสู่ระบบ
        </h2>
        <label style={{ color: "#999", marginBottom: "4px" }}>ชื่อผู้ใช้</label>
        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            color: "#555",
          }}
        />
        <label style={{ color: "#999", marginBottom: "4px" }}>รหัสผ่าน</label>
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "24px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            color: "#555",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#FFCE01",
            border: "none",
            padding: "12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          เข้าสู่ระบบ
        </button>
        {error && (
          <p style={{ color: "red", marginTop: "12px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </form>

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
              คุณได้ออกจากระบบแล้ว
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;

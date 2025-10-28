// src/hooks/useLogoutOnBack.ts
import { useEffect } from "react";
import { getToken, logout } from "../utils/auth";

export const useLogoutOnBack = (navigate: any, setShowLogoutPopup: (b: boolean) => void) => {
  useEffect(() => {
    const handlePopState = () => {
      const token = getToken();
      if (token) {
        // แทนที่จะ redirect ทันที ให้แสดง popup แบบ navbar
        setShowLogoutPopup(true);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, setShowLogoutPopup]);
};

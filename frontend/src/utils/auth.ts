export const logout = (navigate: (path: string, options?: any) => void) => {
  localStorage.removeItem("token");
  navigate("/", { replace: true }); // replace เพื่อป้องกัน forward/back
};

export const getToken = () => localStorage.getItem("token");
// src/api/authApi.ts
export interface LoginResponse {
  token: string; // ถ้า TU API ให้ token
  userId: string;
}

export async function loginTU(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch("https://restapi.tu.ac.th/tuapi/Document/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json(); // สมมติว่า API ตอบ JSON
}

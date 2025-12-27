const API_BASE = "http://localhost:8080/api/auth";

export async function apiPost(endpoint, payload) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const loginRequest = (email, password) =>
  apiPost("/login", { email, password });

export const registerRequest = (formData) =>
  apiPost("/register", formData);

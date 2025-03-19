const API_URL = "http://localhost:3000/auth";

export async function login(username, password) {
  const response = await fetch(`${API_URL}/userlogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

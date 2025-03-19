const API_URL = import.meta.env.VITE_AUTHSERVICE_API_URL;

export async function login(username, password) {
  try {
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
  } catch (error) {
    console.error(error);
    throw error;
  }
}

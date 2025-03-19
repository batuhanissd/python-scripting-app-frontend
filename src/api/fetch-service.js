const API_URL = "http://localhost:3000/camsetting";
const accessToken = localStorage.getItem("accessToken");

export async function fetchObject(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error();
    return response;
  } catch (error) {
    console.error(`${endpoint} error: `);
    throw error;
  }
}

export async function runPythonSc(ipAddresses) {
  try {
    const response = await fetch(
      "http://localhost:3000/camsetting/getaccesstoken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ipAddresses: ipAddresses.map((ip) => ({ ipAddress: ip })),
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hata:", error);
    throw new Error("Python script çalıştırma hatası");
  }
}

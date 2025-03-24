const FETCH_OBJECT_API_URL = import.meta.env.VITE_FETCHSERVICE_API_URL;
const RUN_PYTHON_API_URL = import.meta.env.VITE_RUN_PYTHON_API_URL;
const FETCH_LOGS_API_URL = import.meta.env.VITE_FETCHLOGS_API_URL;
const FETCHNODE_API_URL = import.meta.env.VITE_FETCHNODE_API_URL;
const FETCHSUBNODE_API_URL = import.meta.env.VITE_FETCHSUBNODE_API_URL;
const FETCHCAMERA_API_URL = import.meta.env.VITE_FETCHCAMERA_API_URL;

import { toast } from "react-toastify";


if (!FETCH_OBJECT_API_URL || !RUN_PYTHON_API_URL) {
    throw new Error("API_URL environment variables are missing.");
}

function getHeaders() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) throw new Error("AccessToken is missing");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };
}

export async function fetchObject(endpoint) {
    try {
        const response = await fetch(`${FETCH_OBJECT_API_URL}${endpoint}`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error();
        return response;
    } catch (error) {
        console.error(`${endpoint} error: `);
        throw error;
    }
}

export async function fetchLogs() {
    try {
        const response = await fetch(`${FETCH_LOGS_API_URL}`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error();
        return response;
    } catch (error) {
        console.error("error: ", error);
        throw error;
    }
}

export async function runPythonSc(ipAddresses) {
    try {
        const response = await fetch(`${RUN_PYTHON_API_URL}`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                ipAddresses: ipAddresses.map((ip) => ({ ipAddress: ip })),
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Hata:", error);
        throw new Error("Python script çalıştırma hatası");
    }
}

export async function getNode() {
    try {
        const response = await fetch(`${FETCHNODE_API_URL}`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error();
        return response.json();

    } catch (error) {
        toast.error("An error occurred while fetching the nodes!", {
            autoClose: 3000
        })
        throw error;
    }
};

export async function getSubNode() {
    try {
        const response = await fetch(`${FETCHSUBNODE_API_URL}`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error();
        return response.json();

    } catch (error) {
        toast.error("An error occurred while fetching the sub nodes!", {
            autoClose: 3000
        })
        throw error;
    }
};

export async function getCamera() {
    try {
        const response = await fetch(`${FETCHCAMERA_API_URL}`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error();
        return response.json();

    } catch (error) {
        toast.error("An error occurred while fetching the cameras!", {
            autoClose: 3000
        })
        throw error;
    }
};
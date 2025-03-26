const FETCH_OBJECT_API_URL = import.meta.env.VITE_FETCHSERVICE_API_URL;
const RUN_PYTHON_API_URL = import.meta.env.VITE_RUN_PYTHON_API_URL;
const FETCH_LOGS_API_URL = import.meta.env.VITE_FETCHLOGS_API_URL;
const FETCHNODE_API_URL = import.meta.env.VITE_FETCHNODE_API_URL;
const FETCHSUBNODE_API_URL = import.meta.env.VITE_FETCHSUBNODE_API_URL;
const FETCHCAMERA_API_URL = import.meta.env.VITE_FETCHCAMERA_API_URL;
const USERLOGINSERVICE_API_URL = import.meta.env.VITE_USERLOGINSERVICE_API_URL;

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

function getHeadersinPtsAuth() {
    const ptsToken = localStorage.getItem("PTSAuth");

    if (!ptsToken) throw new Error("AccessToken is missing");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ptsToken}`,
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
        toast.error(`An error occurred at "${endpoint}".`, {
            autoClose: 3000
        });
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
        toast.error("An error occurred while fetching logs. Please try again.", {
            autoClose: 3000
        });
        throw error;
    }
}

export async function runPythonSc(processType, selectedcamera) {
    try {
        const response = await fetch(`${RUN_PYTHON_API_URL}`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                processType: processType,
                selectedCamera: selectedcamera
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        toast.error("The file could not be executed. Please try again.", {
            autoClose: 3000
        });
        throw new Error("Python script çalıştırma hatası");
    }
}

export async function getNode() {
    try {
        const response = await fetch(`${FETCHNODE_API_URL}`, {
            method: "POST",
            headers: getHeadersinPtsAuth(),
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
            headers: getHeadersinPtsAuth(),
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
            headers: getHeadersinPtsAuth(),
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

export const getResponse = async (username, password) => { //for login
    try {
        const response = await fetch(`${USERLOGINSERVICE_API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        return response;

    } catch (error) {
        toast.error("Sign in failed!", {
            autoClose: 3000
        })
        throw error;
    }
};

export const getResponse = async (username, password) => {
    try {
        const response = await fetch("https://pts.mangobulut.com/apib/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        return response;

    } catch (error) {
        alert("Error: " + error.message);
    }
};

const getToken = async () => {

    return localStorage.getItem("accessToken");
};

export const getNode = async () => {
    const token = await getToken();
    try {
        const response = await fetch("https://pts.mangobulut.com/apib/node", {
            method: "GET",
            headers: {
                "ContentType": "application/json",
                "Authorization": `Bearer ${token}`
            }

        });

        return await response.json();

    } catch (error) {
        alert("Error: " + error.message);
    }
};

export const getSubNode = async () => {
    const token = await getToken();
    try {
        const response = await fetch("https://pts.mangobulut.com/apib/sub-node", {
            method: "GET",
            headers: {
                "ContentType": "application/json",
                "Authorization": `Bearer ${token}`
            }

        });

        return await response.json();

    } catch (error) {
        alert("Error: " + error.message);
    }
};

export const getCamera = async () => {
    const token = await getToken();
    try {
        const response = await fetch("https://pts.mangobulut.com/apib/camera/record-capture-time?order=ASC", {
            method: "GET",
            headers: {
                "ContentType": "application/json",
                "Authorization": `Bearer ${token}`
            }

        });

        return await response.json();

    } catch (error) {
        alert("Error: " + error.message);
    }
};

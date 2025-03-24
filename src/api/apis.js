import { toast } from "react-toastify";
const FETCHNODE_API_URL = import.meta.env.VITE_FETCHNODE_API_URL;
// import { getHeaders } from "./fetch-service";

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
        toast.error("An error occurred while fetching the response!", {
            autoClose: 3000
        })
    }
};

const getToken = async () => {

    return localStorage.getItem("accessToken");
};

// function getHeaders() {
//     const accessToken = localStorage.getItem("accessToken");

//     if (!accessToken) throw new Error("AccessToken is missing");

//     return {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//     };
// }



// export async function getNode() {
//     try {
//         const response = await fetch(`${FETCHNODE_API_URL}`, {
//             method: "POST",
//             headers: getHeaders(),
//         });
//         if (!response.ok) throw new Error();
//         return response.json();

//     } catch (error) {
//         toast.error("An error occurred while fetching the nodes!", {
//             autoClose: 3000
//         })
//         throw error;
//     }
// };


// export const getNode = async () => {
//     const token = await getToken();
//     try {
//         const response = await fetch("https://pts.mangobulut.com/apib/node", {
//             method: "GET",
//             headers: {
//                 "ContentType": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }

//         });

//         return await response.json();

//     } catch (error) {
//         toast.error("An error occurred while fetching the nodes!", {
//             autoClose: 3000
//         })
//     }
// };

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
        toast.error("An error occurred while fetching the sub nodes!", {
            autoClose: 3000
        })
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
        toast.error("An error occurred while fetching the cameras!", {
            autoClose: 3000
        })
    }
};

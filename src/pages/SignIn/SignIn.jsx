import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./signInPage.css";
import { getResponse } from "../../api/apis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignIn = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = "signin-page";
    }, []);

    const handleSignIn = async (e) => {

        const toastId = toast.info("Signing in...", { autoClose: false }); e.preventDefault();

        const username = document.getElementById("entryUsername").value;
        const password = document.getElementById("entryPassword").value;

        try {
            const response = await getResponse(username, password);
            const data = await response.json();
            if (!response.ok) {// Hata durumununda alert verir ve kodun devam etmesini engeller.

                if (response.status === 401) {
                    toast.dismiss(toastId);
                    return toast.error("Invalid username and password!", {
                        autoClose: 3000
                    })

                }

                toast.dismiss(toastId);
                toast.error("Sign in failed!", {
                    autoClose: 3000
                })
                return;

            }
            localStorage.setItem("accessToken", data.accessToken); // Tokeni localStorage'a kaydeder.
            toast.dismiss(toastId);

            toast.success("Sign in succesful.", {
                autoClose: 3000
            })
            setIsAuthenticated(true);
            navigate("/formmotorcycle", { replace: true });
        } catch (error) {
            toast.error("Sign in failed!", {
                autoClose: 3000
            })
        }

    };

    return (
        <div className='signIn-container'>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
                <input type="username" placeholder="Username" id="entryUsername" required />
                <input type="password" placeholder="Password" id="entryPassword" required />
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}

export default SignIn
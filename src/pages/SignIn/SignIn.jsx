import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./signInPage.css";
import { login } from '../../api/auth-service';

const SignIn = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = "signin-page";
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();

        const username = document.getElementById("entryUsername").value;
        const password = document.getElementById("entryPassword").value;

        try {
            const data = await login(username, password);

            localStorage.setItem("accessToken", data.accessToken); // Tokeni localStorage'a kaydeder.

            setIsAuthenticated(true);
            navigate("/formmotorcycle", { replace: true });
        } catch (error) {
            alert(error.message);
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

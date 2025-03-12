import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./signInPage.css";

const SignIn = () => {

    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = "signin-page"; // Arka planı signin için ayarla
    }, []);

    const handleSignIn = (e) => {
        e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
        navigate("/Motorcycle", { replace: true }); // Geri butonu çalışmaz
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

import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./signInPage.css";

const SignIn = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = "signin-page";
    }, []);

    const handleSignIn = (e) => {
        e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller.
        setIsAuthenticated(true); //Giriş işlemi başarılı
        localStorage.setItem("isAuthenticated", "true");
        navigate("/formmotorcycle", { replace: true });
        //navigate("/motorcycle", { replace: true }); // Geri butonu çalışmaz.
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

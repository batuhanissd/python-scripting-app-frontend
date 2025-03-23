import React, { useEffect } from 'react';
import "../../components/ButtonMotorcycle.css";
import "./MotorcyclePage.css";
import { useNavigate, useLocation } from "react-router-dom";


const Motorcycle = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        document.title = "Motorcycle Process";
        document.body.className = "motorcycle-page";

        // Eğer kullanıcı giriş yapmadan bir şekilde /motorcycle sayfasına geldiyse, /sign-in sayfasına yönlendirilir.
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        if (!isAuthenticated) {
            navigate("/sign-in", { replace: true });
        }

        // Eğer /motorcycle dışında farklı bir URL'ye gidilmeye çalışılırsa /motorcycle'a yönlendirir.
        if (location.pathname !== "/motorcycle") {
            navigate("/motorcycle", { replace: true });
        }

    }, [location, navigate]);

    const handleLogout = (e) => {
        e.preventDefault();
        setIsAuthenticated(false);
        localStorage.setItem("isAuthenticated", "false");
        navigate("/sign-in", { replace: true });
    };

    return (
        <div className='container'>
            <div className='button'>
                <img src="/img/motorcycleon.png" alt="Motorcycle On"></img>
                <p>Enable Motorcycle</p>
            </div>

            <div className='button'>
                <img src="/img/motorcycleoff.png" alt="Motorcycle Off"></img>
                <p>Disable Motorcycle</p>
            </div>

            <div className='button'>
                <img src="/img/motorcycleftp.png" alt="Motorcycle Configure"></img>
                <p>Disable Motorcycle</p>
            </div>

            <div className="button" onClick={handleLogout} id="LogOutButton">
                <img src="/icon/logouticon.png" />
            </div>

            {/* <div className="logout">
                <button onClick={handleLogout}>Log Out</button>
            </div> */}
        </div>

    )
}

export default Motorcycle

//Buton tasarımları ButtonMotorcycle.css'de component olarak tanımlandı.
//Sayfanın tasarımı MotorcyclePage.css'de tanımlandı.
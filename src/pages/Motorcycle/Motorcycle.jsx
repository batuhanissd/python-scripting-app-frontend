import React, { useEffect } from 'react';
import "../../components/ButtonMotorcycle.css";
import "./MotorcyclePage.css";
import { useNavigate } from "react-router-dom";


const Motorcycle = () => {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Motorcycle Process"; // Sayfa başlığını değiştir
        document.body.className = "motorcycle-page"; // Arka plan rengini doğru ayarla
    }, []);

    const handleLogout = () => {
        navigate("/"); // Giriş ekranına geri yönlendir
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

            <div className="logout">
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>


    )
}

export default Motorcycle

//Buton tasarımları ButtonMotorcycle.css'de component olarak tanımlandı.
//Sayfanın tasarımı MotorcyclePage.css'de tanımlandı.
import React, { useEffect } from "react";
import ComboBox from "../../components/ComboboxForm";
import Node from "../../CameraList/node";
import SubNode from "../../CameraList/subnode";
import Camera from "../../CameraList/camera";
import ProcessType from "../../CameraList/processtype";
//import "../../components/ComboBoxForm.css";
import { useNavigate } from "react-router-dom";
import "./FormMotorcyclePage.css";

const FormMotorcycle = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = "formmotorcycle-page";
    }, []);
    document.title = "Motorcycle Process";


    const handleLogout = (e) => {
        e.preventDefault();
        setIsAuthenticated(false);
        localStorage.setItem("isAuthenticated", "false");
        navigate("/sign-in", { replace: true });
    };

    return (

        <div className="container">
            <div className="form-container">

                <ComboBox title="Node" options={Node} multipleChoice={true} />
                <ComboBox title="Sub Node" options={SubNode} multipleChoice={true} />
                <ComboBox title="Camera" options={Camera} multipleChoice={true} />
                <ComboBox title="Process Type" options={ProcessType} />

            </div>

            <div className="run">
                <button>Run</button>
            </div>

            <div className="logout">
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>



    );
};

export default FormMotorcycle;

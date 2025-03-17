import React, { useEffect, useState } from "react";
import ComboBox from "../../components/ComboboxForm";
//import Node from "../../CameraList/node";
import { getNode, getSubNode, getCamera } from "../../api/apis";
// import SubNode from "../../CameraList/subnode";
// import Camera from "../../CameraList/camera";
import ProcessType from "../../CameraList/processtype";
//import "../../components/ComboBoxForm.css";
import { useNavigate } from "react-router-dom";
import "./FormMotorcyclePage.css";

const FormMotorcycle = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();
    const [nodeOptions, setNodeOptions] = useState([]);
    const [subNodeOptions, setSubNodeOptions] = useState([]);
    const [subCamera, setCameraOptions] = useState([]);

    useEffect(() => {
        document.body.className = "formmotorcycle-page";

        const fetchNodes = async () => {
            try {
                const nodes = await getNode();
                if (nodes && Array.isArray(nodes)) {
                    setNodeOptions(nodes.map(node => node.name));
                } else {
                    setNodeOptions([]);
                }
            } catch (error) {
                //hata-alert çağrılacak
                setNodeOptions([]);
            }
        };

        const fetchSubNodes = async () => {
            try {
                const subNodes = await getSubNode();
                if (subNodes && Array.isArray(subNodes)) {
                    setSubNodeOptions(subNodes.map(subNodes => subNodes.name));
                } else {
                    setSubNodeOptions([]);
                }
            } catch (error) {
                //hata-alert çağrılacak
                setSubNodeOptions([]);
            }
        };

        const fetchCamera = async () => {
            try {
                const subCamera = await getCamera();
                if (subCamera && Array.isArray(subCamera)) {
                    setCameraOptions(subCamera.map(subCamera => subCamera.name));
                } else {
                    setCameraOptions([]);
                }
            } catch (error) {
                //hata-alert çağrılacak
                setCameraOptions([]);
            }
        };

        fetchNodes();
        fetchSubNodes();
        fetchCamera();
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

                <ComboBox title="Node" options={nodeOptions} multipleChoice={true} />
                <ComboBox title="Sub Node" options={subNodeOptions} multipleChoice={true} />
                <ComboBox title="Camera" options={subCamera} multipleChoice={true} />
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

import React from "react";
import LogTable from "../../components/LogTable";
import "./LogsPage.css";
import { useNavigate } from "react-router-dom";

const Logs = () => {
    const navigate = useNavigate();

    const handleHomePage = async (e) => {
        navigate("/formmotorcycle/*");
    }

    return (
        <div>
            <div className="homebutton" onClick={handleHomePage}>
                <img src="/icon/home.png" />
            </div>
            <LogTable></LogTable>
        </div>
    )
}

export default Logs

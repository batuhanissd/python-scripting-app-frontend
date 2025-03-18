import React, { useEffect, useState } from "react";
import ComboBox from "../../components/ComboboxForm";
import { getNode, getSubNode, getCamera } from "../../api/apis";
import ProcessType from "../../CameraList/processtype";
import { useNavigate } from "react-router-dom";
import "./FormMotorcyclePage.css";

const FormMotorcycle = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();

    const [nodeOptions, setNodeOptions] = useState([]);
    const [subNodeOptions, setSubNodeOptions] = useState([]);
    const [cameraOptions, setCameraOptions] = useState([]);

    //Tüm subnodeları ve kameraları tutan state'ler
    const [allSubNodes, setAllSubNodes] = useState([]);
    const [allCamera, setAllCamera] = useState([]);


    // Seçili verileri takip eden state'ler
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedSubNode, setSelectedSubNode] = useState(null);
    const [selectedCamera, setSelectedCamera] = useState(null); //Run yapıldığında bu id'lere bağlı olarak işlem yapılacak.


    useEffect(() => {
        document.body.className = "formmotorcycle-page";
        document.title = "Motorcycle Process";

        // API'den gelen node'ların formatı, id ve name alanlarını içerecek şekilde değiştirilir.
        const fetchNodes = async () => {
            try {
                const nodes = await getNode();
                if (nodes && Array.isArray(nodes)) {
                    setNodeOptions(nodes.map(node => ({ id: node.id, name: node.name })));
                } else {
                    setNodeOptions([]);
                }
            } catch (error) {
                //hata-alert çağrılacak
                setNodeOptions([]);
            }
        };

        // API'den gelen subnode'ların formatı, id, name ve nodeId alanlarını içerecek şekilde değiştirilir.
        const fetchSubNodes = async () => {
            try {
                const subNodes = await getSubNode();
                if (subNodes && Array.isArray(subNodes)) {
                    const formattedSubNodes = subNodes.map(sub => ({
                        id: sub.id,
                        name: sub.name,
                        nodeId: sub.node.id
                    }));
                    setAllSubNodes(formattedSubNodes);  // Tüm subNode'ları kaydedilir.
                } else {
                    setAllSubNodes([]);
                    setSubNodeOptions([]);
                }
            } catch (error) {
                setAllSubNodes([]);
                setSubNodeOptions([]);
            }
        };


        // API'den gelen kameraların formatı, id, name ve subnodeId alanlarını içerecek şekilde değiştirilir.
        const fetchCamera = async () => {
            try {
                const camera = await getCamera();
                if (camera && Array.isArray(camera)) {
                    const formattedCamera = camera.map(cam => ({
                        id: cam.id,
                        name: cam.name,
                        subId: cam.subNode.id

                    }));
                    setAllCamera(formattedCamera); //Tüm kameralar kaydedilir.
                } else {
                    setCameraOptions([]);
                    setAllCamera([]);
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

    const handleLogout = (e) => {
        e.preventDefault();
        setIsAuthenticated(false);
        localStorage.setItem("isAuthenticated", "false");
        navigate("/sign-in", { replace: true });
    };

    //Bir node seçildiğinde ona bağlı olan subnode'ları getirir.
    const handleNodeChange = async (selected) => {
        setSelectedNode(selected);

        if (selected.length > 0) {
            const selectedIds = selected.map(node => node.id);  // Seçili node'ların ID'lerini diziye çevirir.
            const filtered = allSubNodes.filter(sub => selectedIds.includes(sub.nodeId)); //O node'a sahip subnode'ları filtreler.
            setSubNodeOptions(filtered);
        } else {
            setSubNodeOptions([]); // Eğer hiçbir şey seçilmezse boş gösterir.
        }

    };

    //SubNode seçildiğinde ona bağlı olan cameraları getirir.
    const handleSubNodeChange = async (selected) => {
        setSelectedSubNode(selected);

        if (selected.length > 0) {
            const selectedIds = selected.map(subnode => subnode.id);
            const filtered = allCamera.filter(cam => selectedIds.includes(cam.subId));
            setCameraOptions(filtered);

        } else {
            setCameraOptions([]);
        }
    };

    const handleCameraChange = async (selected) => {
        setSelectedCamera(selected);
    }

    return (

        <div className="container">
            <div className="form-container">

                <ComboBox
                    title="Node"
                    options={nodeOptions}
                    value={selectedNode}  // Değeri seçili olan Node ile güncelledik
                    // onChange={handleNodeChange}
                    onChange={(selected) => {
                        handleNodeChange(selected);
                    }}
                    multipleChoice={true}
                />
                <ComboBox
                    title="Sub Node"
                    options={subNodeOptions}
                    value={selectedSubNode}  // Değeri seçili olan SubNode ile güncelledik
                    onChange={(selected) => {
                        handleSubNodeChange(selected);
                    }}
                    multipleChoice={true}
                />
                <ComboBox
                    title="Camera"
                    options={cameraOptions}
                    value={selectedCamera}
                    onChange={(selected) => { handleCameraChange(selected); }}
                    multipleChoice={true}
                />

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
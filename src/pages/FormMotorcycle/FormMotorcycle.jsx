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

        setTimeout(() => {
            setSelectedNode(selected);

            if (selected.length > 0) {
                const selectedIds = selected.map(node => node.id);  // Seçili node'ların ID'lerini diziye çevirir.
                const filtered = allSubNodes.filter(sub => selectedIds.includes(sub.nodeId)); //O node'a sahip subnode'ları filtreler.
                setSubNodeOptions(filtered);
            } else {
                setSubNodeOptions([]); // Eğer hiçbir şey seçilmezse boş gösterir.
            }

        }, 100); //Bazen node hızlı seçildiğinde state güncellenmiyor. O sebeple timeout kullandım. 

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

    const handleDelete = (deleteItem, type) => {
        try {
            if (type === "Node") {

                //Seçili node'lar güncellendi.
                const newSelectNode = selectedNode.filter(node => node.id !== deleteItem.id);
                setSelectedNode(newSelectNode);

                //Subnode seçenekleri güncellendi.
                const newSubNodesOptions = subNodeOptions.filter(sub => sub.nodeId !== deleteItem.id);
                setSubNodeOptions(newSubNodesOptions);

                //Eğer seçili subnode varsa ona ait olan cameralar listeden kaldırır.
                if (selectedSubNode) {

                    if (selectedCamera) {

                        const subNodesToDelete = allSubNodes
                            .filter(sub => sub.nodeId === deleteItem.id)
                            .map(sub => sub.id);

                        // Seçili kameralar arasında, silinecek `SubNode`'lara bağlı olanları cameraları kaldırır.
                        const newSelectCamera = selectedCamera.filter(cam => !subNodesToDelete.includes(cam.subId));

                        setSelectedCamera(newSelectCamera);

                        //Camera seçenekleri kaldırılır. //Cameralar seçilen subnode'a bağlı olarak listelendiği için.
                        const newCameraOptions = selectedCamera.filter(cam => !subNodesToDelete.includes(cam.subId));
                        setCameraOptions(newCameraOptions);

                    }

                    //Seçili subnode'lar güncellenir.
                    const newSelectSubnode = selectedSubNode.filter(sub => sub.nodeId !== deleteItem.id);
                    setSelectedSubNode(newSelectSubnode);

                }
                document.activeElement.blur(); // Odağı kaldır (Combobox'ın mavi kalmasını engelle)

            }

            if (type === "Sub Node") {

                // Seçili kameralar içinde, silinen subNode'a bağlı olanları kaldırır.
                const newSelectSubnode = selectedSubNode.filter(sub => sub.id !== deleteItem.id);
                setSelectedSubNode(newSelectSubnode);

                //Camera options'ları güncellenir.
                const newCameraOptions = cameraOptions.filter(cam => cam.subId !== deleteItem.id);
                setCameraOptions(newCameraOptions);

                if (selectedCamera) {

                    //Seçili cameralardan silinen subnode'a bağlı olan cameralar seçimden kaldırılır.
                    const newSelectCamera = selectedCamera.filter(cam => cam.subId !== deleteItem.id);
                    setSelectedCamera(newSelectCamera);

                    document.activeElement.blur();
                }
            }

            if (type === "Camera") {

                //Seçili cameralar güncellenilir.
                const newSelectCamera = selectedCamera.filter(cam => cam.id !== deleteItem.id);
                setSelectedCamera(newSelectCamera);
                document.activeElement.blur();
            }
        } catch (error) {
            console.error("Silme işlemi sırasında hata oluştu:", error);
        }
    };

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
                    onDelete={(deletedItem) => {
                        handleDelete(deletedItem, "Node");
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
                    onDelete={(deletedItem) => {
                        handleDelete(deletedItem, "Sub Node");
                    }} multipleChoice={true}
                />
                <ComboBox
                    title="Camera"
                    options={cameraOptions}
                    value={selectedCamera}
                    onChange={(selected) => { handleCameraChange(selected); }}
                    onDelete={(deletedItem) => {
                        handleDelete(deletedItem, "Camera");
                    }}
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
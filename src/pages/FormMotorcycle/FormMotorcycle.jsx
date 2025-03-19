import React, { useEffect, useState } from "react";
import ComboBox from "../../components/ComboboxForm";
import { useNavigate } from "react-router-dom";
import { fetchObject } from "../../api/fetch-service";
import ProcessType from "../../CameraList/processtype";
import "./FormMotorcyclePage.css";

const FormMotorcycle = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [nodeOptions, setNodeOptions] = useState([]);
    const [subNodeOptions, setSubNodeOptions] = useState([]);
    const [cameraOptions, setCameraOptions] = useState([]);
    
    const [selectedNode, setSelectedNode] = useState([]);
    const [selectedSubNode, setSelectedSubNode] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState([]);

    const [filteredSubNodes, setFilteredSubNodes] = useState([]);
    const [filteredCameras, setFilteredCameras] = useState([]);

    document.title = "Motorcycle Process";

    useEffect(() => {
        document.body.className = "formmotorcycle-page";
        async function fetchData() {
            try {
                const [nodesResponse, subNodesResponse, camerasResponse] = await Promise.all([
                    fetchObject("/getnode"),
                    fetchObject("/getsubnode"),
                    fetchObject("/getcamera"),
                ]);

                if (!nodesResponse.ok || !subNodesResponse.ok || !camerasResponse.ok) {
                    throw new Error("Veri çekme hatası!");
                }

                const [nodes, subNodes, cameras] = await Promise.all([
                    nodesResponse.json(),
                    subNodesResponse.json(),
                    camerasResponse.json(),
                ]);

                setNodeOptions(nodes.map(node => ({ id: node.id, name: node.name })));

                setSubNodeOptions(subNodes.map(subNode => ({
                    id: subNode.id,
                    name: subNode.name,
                    nodeId: subNode.node?.id || null,
                })));

                setCameraOptions(cameras.map(camera => ({
                    id: camera.id,
                    name: camera.name,
                    subNodeId: camera.subNode?.id || null,
                    ipAddress: camera.ipAddress,
                })));
            } catch (err) {
                console.error("Hata:", err);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const selectedNodeIds = selectedNode.map(node => node.id);
        const newFilteredSubNodes = subNodeOptions.filter(subNode => 
            subNode.nodeId && selectedNodeIds.includes(subNode.nodeId)
        );
        setFilteredSubNodes(newFilteredSubNodes);
        
        // Silinen nodelara bağlı subnodeları ve kameraları kaldır
        setSelectedSubNode(prevSelected => prevSelected.filter(subNode => 
            selectedNodeIds.includes(subNode.nodeId)
        ));
        setSelectedCamera(prevSelected => prevSelected.filter(camera => 
            newFilteredSubNodes.some(subNode => subNode.id === camera.subNodeId)
        ));
    }, [selectedNode, subNodeOptions]);

    useEffect(() => {
        const selectedSubNodeIds = selectedSubNode.map(subNode => subNode.id);
        const newFilteredCameras = cameraOptions.filter(camera => 
            camera.subNodeId && selectedSubNodeIds.includes(camera.subNodeId)
        );
        setFilteredCameras(newFilteredCameras);
        
        // Silinen subnodelara bağlı kameraları kaldır
        setSelectedCamera(prevSelected => prevSelected.filter(camera => 
            selectedSubNodeIds.includes(camera.subNodeId)
        ));
    }, [selectedSubNode, cameraOptions]);

    const handleLogout = (e) => {
        e.preventDefault();
        setIsAuthenticated(false);
        localStorage.setItem("isAuthenticated", "false");
        navigate("/sign-in", { replace: true });
    };

    const handleRun = () => {
        console.log("Selected Nodes: ", selectedNode);
        console.log("Selected SubNodes: ", selectedSubNode);
        console.log("Selected Cameras: ", selectedCamera);
        
        const cameraIpAddresses = selectedCamera.map(camera => camera.ipAddress).filter(ip => ip); 
        const ipAddressesJson = JSON.stringify(cameraIpAddresses);
        console.log(ipAddressesJson);
    };
    
    return (
        <div className="container">
            <div className="form-container">
                <ComboBox 
                    title="Node" 
                    options={nodeOptions} 
                    multipleChoice={true} 
                    value={selectedNode} 
                    onChange={setSelectedNode} 
                />
                <ComboBox 
                    title="Sub Node" 
                    options={filteredSubNodes}
                    multipleChoice={true} 
                    value={selectedSubNode} 
                    onChange={setSelectedSubNode} 
                />
                <ComboBox 
                    title="Camera" 
                    options={filteredCameras}
                    multipleChoice={true} 
                    value={selectedCamera} 
                    onChange={setSelectedCamera} 
                />
                <ComboBox title="Process Type" options={ProcessType} />
            </div>

            <div className="run">
                <button onClick={handleRun}>Run</button>
            </div>

            <div className="logout">
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
};

export default FormMotorcycle;

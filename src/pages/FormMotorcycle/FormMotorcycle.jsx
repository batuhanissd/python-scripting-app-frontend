import React, { useEffect, useState } from "react";
import ComboBox from "../../components/ComboboxForm";
import { getNode, getSubNode, getCamera } from "../../api/fetch-service";
import { useNavigate } from "react-router-dom";
import "./FormMotorcyclePage.css";
import { toast } from "react-toastify";
import { runPythonSc } from "../../api/fetch-service";


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
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [selectedProcessType, setselectedProcessType] = useState(null);

    const processType = [{ id: "motoron", name: "Motorcycle On" }, { id: "motoroff", name: "Motorcycle Off" }, { id: "ftpconfig", name: "Motorcycle Ftp Config" }];

    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        document.body.className = "formmotorcycle-page";
        document.title = "Motorcycle Process";

        // API'den gelen node'ların formatı, id ve name alanlarını içerecek şekilde değiştirilir.
        const fetchNodes = async () => {
            try {
                const nodes = await getNode();
                if (nodes && Array.isArray(nodes)) {
                    const formattedNode = nodes.map(node => ({ id: node.id, name: node.name }));
                    setNodeOptions([{ id: "all", name: "All Nodes" }, ...formattedNode]);
                } else {
                    setNodeOptions([]);
                }
            } catch (error) {
                toast.error("An error occurred while fetching the nodes!");
                console.error(error);
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

                    setAllSubNodes(formattedSubNodes);
                } else {
                    setAllSubNodes([]);
                    setSubNodeOptions([]);
                }
            } catch (error) {
                toast.error("An error occurred while fetching the subnodes!");
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
                        subId: cam.subNode.id,
                        biosId: cam.biosId,
                        ipAddress: cam.ipAddress

                    }));

                    setAllCamera(formattedCamera);

                } else {
                    setCameraOptions([]);
                    setAllCamera([]);
                }
            } catch (error) {
                toast.error("An error occurred while fetching the cameras!");
                setCameraOptions([]);
            }
        };

        fetchNodes();
        fetchSubNodes();
        fetchCamera();

    }, []);

    const handleLogout = (e) => {

        try {
            toast.info("Logging out...", { autoClose: 2000 })
            setTimeout(() => {
                e.preventDefault();
                setIsAuthenticated(false);
                localStorage.setItem("isAuthenticated", "false");
                navigate("/sign-in", { replace: true });
            }, 1000);
            return;
        } catch (error) {
            toast.error("An error occurred while logging out, please try again!", { autoClose: 3000 })

        }

    };

    //Bir node seçildiğinde ona bağlı olan subnode'ları getirir.
    const handleNodeChange = async (selected) => {
        //debugger;
        setTimeout(() => {
            try {

                if (selected.some(node => node.id === "all")) {

                    if (selectedNode && selectedNode.some(node => node.id === "all")) {//all seçili iken tekrardan all seçilirse seçim iptal edilir.
                        setSelectedNode([]);
                        setSubNodeOptions([]);
                        setSelectedSubNode([]);
                        setCameraOptions([]);
                        setSelectedCamera([]);
                        return;
                    }

                    //All Nodes seçilmişse tüm nodes, subnodes ve cameras'lar seçilir.
                    setSelectedNode([{ id: "all", name: "All Nodes" }]);
                    setSelectedSubNode(allSubNodes);
                    setSubNodeOptions([{ id: "all", name: "All Sub Nodes" }]);
                    setSelectedCamera(allCamera);
                    setCameraOptions([{ id: "all", name: "All Cameras" }]);
                    toast.info("All nodes, subnodes and cameras selected.");
                    return;
                }

                // if (!selectedNode.some(node => node.id === "all")) return;

                setSelectedNode(selected);

                if (selected.length > 0) {
                    const selectedIds = selected.map(node => node.id);  // Seçili node'ların ID'lerini diziye çevirir.
                    const filtered = allSubNodes.filter(sub => selectedIds.includes(sub.nodeId)); //O node'a sahip subnode'ları filtreler.              
                    setSubNodeOptions([{ id: "all", name: "All Sub Nodes" }, ...filtered]);

                } else {
                    setSubNodeOptions([]); // Eğer hiçbir şey seçilmezse boş gösterir.
                    setSelectedSubNode([]);
                }


            } catch (error) {
                toast.error("An error occurred while selecting the node. Please try again!");
                setSelectedNode([]);
                console.log(error);
            }
        }, 100); //Bazen node hızlı seçildiğinde state güncellenmiyor. O sebeple timeout kullandım. 

    };

    //SubNode seçildiğinde ona bağlı olan cameraları getirir.
    const handleSubNodeChange = async (selected) => {
        try {
            if (selectedNode) {
                if (selected.some(sub => sub.id === "all")) {
                    if (selectedSubNode && subNodeOptions.length - 1 === selectedSubNode.length) {
                        setSelectedSubNode([]);
                        setCameraOptions([]);
                        setSelectedCamera([]);
                        return;
                    }

                    const filteredSubNodes = subNodeOptions.filter(sub => sub.id !== "all");
                    setSelectedSubNode(filteredSubNodes);

                    const filteredCamera = allCamera.filter(cam =>
                        filteredSubNodes.some(sub => sub.id === cam.subId)
                    );
                    setSelectedCamera(filteredCamera);
                    setSubNodeOptions([{ id: "all", name: "All Sub Nodes" }, ...filteredSubNodes]);
                    setCameraOptions([{ id: "all", name: "All Cameras" }]); //Eğer subnode'da all seçilmişse camera da all seçilir.

                    return;
                }
            }

            setSelectedSubNode(selected);

            if (selected.length > 0) {
                const selectedIds = selected.map(subnode => subnode.id);
                const filtered = allCamera.filter(cam => selectedIds.includes(cam.subId));
                setCameraOptions([{ id: "all", name: "All Cameras" }, ...filtered]);

            } else {
                setCameraOptions([]);
                setSelectedCamera([]);
            }
        } catch (error) {
            toast.error("An error occurred while selecting the sub node. Please try again!");
            setSelectedSubNode([]);
            console.log(error);
        }
    };

    //Camera seçildiğinde gerekli atama işlemlerini gerçekleştirilir.
    const handleCameraChange = async (selected) => {
        try {
            if (selectedSubNode) {
                if (selected.some(cam => cam.id === "all")) {
                    if (selectedCamera && cameraOptions.length - 1 === selectedCamera.length) { //all seçili iken tekrar seçilmeye çalışılırsa seçim iptal olur.
                        setSelectedCamera([]);
                        return;
                    }

                    //All cameras seçilmişse options'daki tüm kameralar seçili olarak atanır.
                    const filteredCameras = cameraOptions.filter(sub => sub.id !== "all");
                    setSelectedCamera(filteredCameras);
                    setCameraOptions([{ id: "all", name: "All Cameras" }, ...filteredCameras]);
                    return;
                }
                setSelectedCamera(selected);

            }
        } catch (error) {
            toast.error("An error occurred while selecting the camera. Please try again!", error);
            setSelectedCamera([]);
            console.log(error);
        }
    }

    const handleDelete = (deleteItem, type) => {
        try {
            //Silinen item'ın type'ına göre işlem yapılır.
            // debugger;
            if (type === "Node") {
                if (deleteItem.id === "all") { //Eğer all nodes silinirse
                    setSelectedSubNode([]);
                    setSubNodeOptions([]);
                    setSelectedCamera([]);
                    setCameraOptions([]);
                    setSelectedNode([]);
                    document.activeElement.blur();
                    return;
                }

                //Seçili node'lar güncellendi.
                const newSelectNode = selectedNode.filter(node => node.id !== deleteItem.id);
                setSelectedNode(newSelectNode);

                if (newSelectNode.length === 0) { // Eğer hiçbir node kalmadıysa
                    setSelectedSubNode([]);
                    setSubNodeOptions([]);
                    setSelectedCamera([]);
                    setCameraOptions([]);
                    return;
                }

                //Subnode seçenekleri güncellendi.
                const newSubNodesOptions = subNodeOptions.filter(sub => sub.nodeId !== deleteItem.id);
                setSubNodeOptions(newSubNodesOptions);

                //Eğer seçili subnode varsa ona ait olan cameralar listeden kaldırır.
                if (selectedSubNode && selectedSubNode.length > 0) {
                    if (selectedCamera) {

                        const subNodesToDelete = allSubNodes
                            .filter(sub => sub.nodeId === deleteItem.id)
                            .map(sub => sub.id);

                        // Seçili kameralar arasında, silinecek `SubNode`'lara bağlı olanları cameraları kaldırır.
                        const newSelectCamera = selectedCamera.filter(cam => !subNodesToDelete.includes(cam.subId));

                        setSelectedCamera(newSelectCamera);

                        //Camera seçenekleri kaldırılır. //Cameralar seçilen subnode'a bağlı olarak listelendiği için.
                        const newCameraOptions = newSelectCamera.filter(cam => !subNodesToDelete.includes(cam.subId));
                        setCameraOptions(newCameraOptions);
                    }

                    //Seçili subnode'lar güncellenir.
                    const newSelectSubnode = selectedSubNode.filter(sub => sub.nodeId !== deleteItem.id);
                    setSelectedSubNode(newSelectSubnode);
                    if (newSubNodesOptions.length - 1 === newSelectSubnode.length) { //seçili node'lardan biri silinirse all subnodes ve all camera seçeneği iptal olmalıdır.
                        setSelectedSubNode([]);
                        setSelectedCamera([]);
                        setCameraOptions([]);
                        return;
                    }
                }

                document.activeElement.blur(); // Odağı kaldır (Combobox'ın mavi kalmasını engeller.)
            }

            if (type === "Sub Node") {
                // debugger;
                if (deleteItem.id === "all") {
                    setSelectedSubNode([]);
                    setSelectedCamera([]);
                    setCameraOptions([]);
                    document.activeElement.blur();
                    return;
                }

                // Seçili kameralar içinde, silinen subNode'a bağlı olanları kaldırır.
                const newSelectSubnode = selectedSubNode.filter(sub => sub.id !== deleteItem.id);
                setSelectedSubNode(newSelectSubnode);

                if (newSelectSubnode.length === 0) {
                    setSelectedCamera([]);
                    setCameraOptions([]);
                    return;
                }

                //Camera options'ları güncellenir.
                const newCameraOptions = cameraOptions.filter(cam => cam.subId !== deleteItem.id);
                setCameraOptions(newCameraOptions);

                if (selectedCamera && selectedCamera.length > 0) {

                    //Seçili cameralardan silinen subnode'a bağlı olan cameralar seçimden kaldırılır.
                    const newSelectCamera = selectedCamera.filter(cam => cam.subId !== deleteItem.id);
                    setSelectedCamera(newSelectCamera);

                    if (newCameraOptions.length - 1 === newSelectCamera.length) {
                        setSelectedCamera([]);
                        return;
                    }
                    document.activeElement.blur();
                }

            }

            if (type === "Camera") {
                if (deleteItem.id === "all") {
                    if (subNodeOptions.length - 1 === selectedSubNode.length) return; //All subnode seçiliyse camerada all camera olmak zorunda.

                    setSelectedCamera([]);
                    document.activeElement.blur();

                    return;
                }
                //Seçili kameralar güncellenilir.
                const newSelectCamera = selectedCamera.filter(cam => cam.id !== deleteItem.id);
                setSelectedCamera(newSelectCamera);
                document.activeElement.blur();
            }

        } catch (error) {
            toast.error("Error occurred while deleting!", { autoClose: 3000 })
            console.log(error);
        }
    };

    const handleLogsTable = async (e) => {
        navigate("/logs");
    }

    const handleRun = async (e) => {
        if (!selectedCamera || selectedCamera.length === 0) {
            toast.warning("Please select a camera.", { autoClose: 3000 });
            return;
        }

        if (!selectedProcessType) {
            toast.warning("Please select a process type.", { autoClose: 3000 });
            return;
        }

        const formattedCamera = selectedCamera.map(camera => ({
            biosid: camera.biosId.substring(0, 2),
            ipAddress: camera.ipAddress
        }));

        setIsRunning(true);
        const toastId = toast.info("Running...", { autoClose: false });

        try {
            await runPythonSc(selectedProcessType.id, formattedCamera);
        } catch (error) {
            toast.error("An error occurred while running the process.");
        } finally {
            setIsRunning(false);
            toast.dismiss(toastId);
            toast.success("Operation succesful.", { autoClose: 3000 })
        }
    };

    const handleProcessTypeChange = async (selected) => {
        setselectedProcessType(selected);
    }

    return (
        <div>
            <div className="container">
                <div className="form-container">

                    <ComboBox
                        title="Node"
                        options={nodeOptions}
                        value={selectedNode}  // Değeri seçili olan Node ile güncelledik
                        onChange={(selected) => { handleNodeChange(selected); }}
                        onDelete={(deletedItem) => { handleDelete(deletedItem, "Node"); }}
                        multipleChoice={true}
                    />

                    <ComboBox
                        title="Sub Node"
                        options={subNodeOptions}
                        value={
                            selectedNode?.some(node => node.id === "all") // Eğer "All Nodes" seçiliyse
                                ? [{ id: "all", name: "All Sub Nodes" }] // Tüm subnode'ları UI'da "All Sub Nodes" olarak göster
                                : (selectedSubNode?.length === subNodeOptions.length - 1 //Tüm subnodes'lar seçiliyse
                                    ? [{ id: "all", name: "All Sub Nodes" }]
                                    : selectedSubNode)
                        }
                        onChange={(selected) => { handleSubNodeChange(selected); }}
                        onDelete={(deletedItem) => { handleDelete(deletedItem, "Sub Node"); }}
                        multipleChoice={true}
                    />

                    <ComboBox
                        title="Camera"
                        options={cameraOptions}
                        value={ //Eğer All Nodes, All Sub Nodes veya All Camera seçiliyse All Camera seçeneğini gösterecek - değilse seçili olan kameraları gösterecek
                            selectedNode?.some(node => node.id === "all")
                                ? [{ id: "all", name: "All Cameras" }]
                                : (selectedSubNode?.length === subNodeOptions.length - 1
                                    ? [{ id: "all", name: "All Cameras" }]
                                    : (selectedCamera?.length === cameraOptions.length - 1
                                        ? [{ id: "all", name: "All Cameras" }]
                                        : selectedCamera))
                        }

                        onChange={(selected) => { handleCameraChange(selected); }}
                        onDelete={(deletedItem) => { handleDelete(deletedItem, "Camera"); }}
                        multipleChoice={true}
                    />

                    <ComboBox
                        title="Process Type"
                        options={processType}
                        value={selectedProcessType}
                        onChange={(selected) => { handleProcessTypeChange(selected); }}
                    />

                </div>

                <div className="run" >
                    <button onClick={handleRun} disabled={isRunning}>
                        {isRunning ? "Running..." : "Run"}
                    </button>
                </div>

            </div>

            <div className="logoutbutton" onClick={handleLogout} id="LogOutButton">
                <img src="/icon/logouticon.png" />
            </div>

            <div className="logsbutton" onClick={handleLogsTable} id="LogsButton">
                <img src="/icon/log.png" />
            </div>
        </div>

    );
};

export default FormMotorcycle;
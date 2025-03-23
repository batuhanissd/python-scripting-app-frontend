import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (message = "Gösterilecek mesaj yok.", type = "info", duration = 3000) => {
    toast(message, { type, autoClose: duration });
};

const ToastProvider = () => {
    return <ToastContainer position="top-right" />;
};

export { ToastProvider, showToast };

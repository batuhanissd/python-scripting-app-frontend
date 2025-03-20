import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import FormMotorcyclePage from './pages/FormMotorcycle/FormMotorcycle.jsx';
import SignInPage from "./pages/SignIn/SignIn";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { ToastProvider } from "./components/Alerts";
function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleAuthChange = (state) => {
    setIsAuthenticated(state);
    localStorage.setItem("isAuthenticated", state);
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>

        <Route path="/sign-in" element={isAuthenticated ? <FormMotorcyclePage setIsAuthenticated={handleAuthChange} /> : <SignInPage setIsAuthenticated={handleAuthChange} />} />

        <Route path="/formmotorcycle/*" element={isAuthenticated ? <FormMotorcyclePage setIsAuthenticated={handleAuthChange} /> : <Navigate to="/sign-in" replace />} />

        <Route path="*" element={isAuthenticated ? <FormMotorcyclePage setIsAuthenticated={handleAuthChange} /> : <Navigate to="/sign-in" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

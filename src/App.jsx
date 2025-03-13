import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import MotorcyclePage from './pages/Motorcycle/Motorcycle.jsx';
import SignInPage from "./pages/SignIn/SignIn";

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
      <Routes>

        <Route path="/sign-in" element={isAuthenticated ? <MotorcyclePage setIsAuthenticated={handleAuthChange} /> : <SignInPage setIsAuthenticated={handleAuthChange} />} />

        <Route path="/motorcycle/*" element={isAuthenticated ? <MotorcyclePage setIsAuthenticated={handleAuthChange} /> : <Navigate to="/sign-in" replace />} />

        <Route path="*" element={isAuthenticated ? <MotorcyclePage setIsAuthenticated={handleAuthChange} /> : <Navigate to="/sign-in" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

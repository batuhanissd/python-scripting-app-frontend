import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MotorcyclePage from './pages/Motorcycle/Motorcycle.jsx'
import SignInPage from "./pages/SignIn/SignIn";


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />}></Route>

        <Route path="/Motorcycle" element={<MotorcyclePage />} />

        <Route path="*" element={<Navigate to="/" replace />} /> {/* Bilinmeyen bir sayfa istenirse girişe yönlendir */}
      </Routes>
    </Router>


  )
}

export default App

import { Routes, Route } from "react-router-dom"; // Corect: folosește Routes și Route
import LoginPage from "./pages/LoginPage"; 
import Dashboard from "./pages/Dashboard"; 
import RegisterPage from "./pages/RegisterPage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/aboutUs" element={<AboutUsPage />} />
    </Routes>
  );
}

export default App;
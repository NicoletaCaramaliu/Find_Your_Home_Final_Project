import { Routes, Route } from "react-router-dom"; // Corect: folosește Routes și Route
import LoginPage from "./pages/LoginPage"; 
import Dashboard from "./pages/Dashboard"; 
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterPage />} /> 
    </Routes>
  );
}

export default App;
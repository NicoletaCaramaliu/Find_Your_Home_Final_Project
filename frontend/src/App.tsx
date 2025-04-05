import { Routes, Route } from "react-router-dom"; // Corect: folosește Routes și Route
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage";
import AboutUsPage from "./pages/AboutUsPage";
import PropertiesPage from "./pages/PropertiesPage";
import { ThemeProvider } from "./context/ThemeContext"; 
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import OwnerPageDetails from './pages/OwnerPageDetails';

function App() {
  return (
    <ThemeProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/aboutUs" element={<AboutUsPage />} />  
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/ownerPage/:ownerId" element={<OwnerPageDetails />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
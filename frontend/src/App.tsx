import { Routes, Route } from "react-router-dom"; 
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage";
import AboutUsPage from "./pages/AboutUsPage";
import PropertiesPage from "./pages/PropertiesPage";
import { ThemeProvider } from "./context/ThemeContext"; 
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import OwnerPageDetails from './pages/OwnerPageDetails';
import MyAccountPage from './pages/MyAccountPage';
import EditPropertyPage from "./pages/EditPropertyPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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
      <Route path="/myAccount" element={<MyAccountPage />} />
      <Route path="/edit-property/:id" element={<EditPropertyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
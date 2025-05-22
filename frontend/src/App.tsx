import { Routes, Route } from "react-router-dom"; 
import LoginPage from "./pages/authPages/LoginPage"; 
import RegisterPage from "./pages/authPages/RegisterPage";
import AboutUsPage from "./pages/AboutUsPage";
import PropertiesPage from "./pages/propertiesPages/PropertiesPage";
import { ThemeProvider } from "./context/ThemeContext"; 
import PropertyDetailsPage from './pages/propertiesPages/PropertyDetailsPage';
import UserDetailsPage from './pages/usersPages/UserDetailsPage';
import MyAccountPage from './pages/usersPages/MyAccountPage';
import EditPropertyPage from "./pages/propertiesPages/EditPropertyPage";
import ForgotPasswordPage from "./pages/authPages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authPages/ResetPasswordPage";
import MyBookingsPage from "./pages/usersPages/MyBookingsPage";
import MyReservationsPage from "./pages/usersPages/MyReservationsPage";
import ConversationsPage from "./pages/conversations/ConversationsPage";
import ChatPage from "./pages/conversations/ChatPage";
import RentalCollaborationPage from "./pages/rental/RentalCollaborationPage";

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
      <Route path="/user/:userId" element={<UserDetailsPage />} />
      <Route path="/myAccount" element={<MyAccountPage />} />
      <Route path="/edit-property/:id" element={<EditPropertyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/my-reservations" element={<MyReservationsPage />} />
      <Route path="/conversations" element={<ConversationsPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/rental-collaboration/:rentalId" element={<RentalCollaborationPage />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
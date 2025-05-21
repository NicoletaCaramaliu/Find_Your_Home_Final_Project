import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Property } from "../../types/Property";
import MainNavBar from "../../components/MainNavBar";
import AddPropertyForm from "../../components/properties/AddPropertyForm";
import UserProfileCard from "../../components/user/UserProfileCard";
import MyPropertiesCard from "../../components/properties/MyPropertiesCard";
import FavoritePropertiesCard from "../../components/properties/FavoritePropertiesCard";
import { logout } from "../../services/authService";

interface LoggedUser {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  role: number;
  createdAt: string;
}

const isAllowedToManageProperties = (role: number) => [0, 2, 3].includes(role);
const shouldSeeFavoritesInstead = (role: number) => !isAllowedToManageProperties(role);

const MyAccountPage: React.FC = () => {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchLoggedUser = async () => {
    try {
      const res = await api.get("/User/getLoggedUser");
      setUser(res.data);
    } catch (err) {
      console.error("Eroare la preluarea utilizatorului logat:", err);
    }
  };

  const fetchMyProperties = async () => {
    try {
      const res = await api.get("/User/getAllMyProperties");
      setProperties(res.data);
    } catch (err) {
      console.error("Eroare la preluarea proprietăților:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/Favorites/getMyFavorites");
      setFavorites(res.data);
    } catch (err) {
      console.error("Eroare la preluarea proprietăților favorite:", err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    try {
      await api.delete(`/Favorites/removeFromFavorites`, {
        params: { propertyId },
      });
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error("Eroare la ștergerea proprietății din favorite:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchLoggedUser();
    fetchMyProperties();
  }, []);

  useEffect(() => {
    if (user) {
      if (shouldSeeFavoritesInstead(user.role)) {
        fetchFavorites();
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <MainNavBar />
      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Contul Meu</h1>

        {user ? (
          <>
            <UserProfileCard user={user} refreshUser={fetchLoggedUser} />

            <div className="mt-4 space-y-2">
              {!showLogoutConfirm ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Deconectează-te
                </button>
              ) : (
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Ești sigur că vrei să te deconectezi?
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Da
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Nu
                  </button>
                </div>
              )}
            </div>

            {isAllowedToManageProperties(user.role) && (
              <button
                onClick={() => navigate("/my-bookings")}
                className="mb-4 mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Vezi rezervările primite
              </button>
            )}

            {user?.role === 4 && (
              <>
                <button
                  onClick={() => navigate("/my-reservations")}
                  className="mb-2 mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Vezi rezervările făcute
                </button>

                <button
                  onClick={() => navigate("/rental-collaboration")}
                  className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mergi la colaborare (închiriere activă)
                </button>
              </>
            )}

            {user && (
              <button
                onClick={() => navigate(`/user/${user.id}`)}
                className="mb-4 mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Vezi recenziile primite
              </button>
            )}

            {isAllowedToManageProperties(user.role) && (
              <>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mb-4 mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    + Adaugă Proprietate
                  </button>
                )}

                {showAddForm && (
                  <AddPropertyForm
                    onSuccess={() => {
                      setShowAddForm(false);
                      fetchMyProperties();
                    }}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}

                <div className="bg-white dark:bg-gray-700 rounded shadow p-4 max-h-[500px] overflow-y-auto">
                  <MyPropertiesCard
                    properties={properties}
                    loading={loading}
                    onEdit={(id) => navigate(`/edit-property/${id}`)}
                    onNavigate={(id) => navigate(`/properties/${id}`)}
                  />
                </div>
              </>
            )}

            {shouldSeeFavoritesInstead(user.role) && (
              <FavoritePropertiesCard
                favorites={favorites}
                loading={favoritesLoading}
                onRemove={removeFromFavorites}
                onNavigate={(id) => navigate(`/properties/${id}`)}
              />
            )}
          </>
        ) : (
          <p>Se încarcă utilizatorul...</p>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;

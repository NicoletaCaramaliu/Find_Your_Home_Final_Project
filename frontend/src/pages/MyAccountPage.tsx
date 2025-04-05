import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Property } from "../types/Property";
import { rolesMap } from "../constants/roles";
import MainNavBar from "../components/MainNavBar";

interface LoggedUser {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  role: number;
}

const isAllowedToManageProperties = (role: number) =>
  [0, 2, 3].includes(role); // Admin, PropertyOwner, Agent

const MyAccountPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const fetchLoggedUser = async () => {
    try {
      const res = await api.get("/User/getLoggedUser");
      setUser(res.data);
    } catch (err) {
      console.error("Eroare la preluarea utilizatorului logat:", err);
    }
  };

  useEffect(() => {
    fetchLoggedUser();
    fetchMyProperties();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <MainNavBar />

      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Contul Meu</h1>

        {user ? (
          <>
            <div className="mb-8 flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <img
                src={user.profilePicture || "/images/defaultProfPicture.avif"}
                alt="Profil"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Rol: {rolesMap[user.role]}
                </p>
              </div>
            </div>

            {isAllowedToManageProperties(user.role) ? (
              <>
                <button
                  onClick={() => navigate("/add-property")}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  + Adaugă Proprietate
                </button>

                {loading ? (
                  <p>Se încarcă...</p>
                ) : properties.length === 0 ? (
                  <p>Nu ai proprietăți momentan.</p>
                ) : (
                  <div className="grid gap-4">
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <div>
                          <h2 className="text-xl font-bold">{property.name}</h2>
                          <p>{property.address}</p>
                          <p>
                            Status:{" "}
                            {property.isAvailable
                              ? "Disponibil"
                              : "Indisponibil"}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-property/${property.id}`);
                            }}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Editare
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-500 text-lg font-medium">
                Nu ai permisiunea de a gestiona proprietăți.
              </p>
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

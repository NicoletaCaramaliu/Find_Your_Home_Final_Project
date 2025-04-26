import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../../components/MainNavBar';
import PropertiesList from '../../components/properties/PropertiesList';
import { Property } from '../../types/Property';
import { rolesMap } from "../../constants/roles";
import api from "../../api"; 

interface UserProfile {
  email: string;
  username: string;
  profilePicture: string;
  ownerId: string;
  role: string;
}

const OwnerDetailsPage: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/User/getUser', {
          params: { id: ownerId },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    const fetchUserProperties = async () => {
      try {
        const res = await api.get('/Properties/getAllPropertiesByUserId', {
          params: { userId: ownerId },
        });
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching user properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchUserProperties();
  }, [ownerId]);

  const defaultProfileImage = "/images/defaultProfPicture.avif";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Se încarcă...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <MainNavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* User Info */}
        <div className="flex items-center space-x-6 bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-10">
          <img
            src={user?.profilePicture || defaultProfileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
            <p className="text-sm mt-2 text-blue-600 dark:text-blue-400 font-medium">
              {rolesMap[+user?.role!] ?? "Necunoscut"}
            </p>
          </div>
        </div>

        {/* User Properties */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Proprietățile utilizatorului:</h3>
          {properties.length === 0 ? (
            <p>Nu a adăugat nicio proprietate încă.</p>
          ) : (
            <PropertiesList properties={properties} noResults={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDetailsPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import PropertiesList from '../components/properties/PropertiesList';
import { Property } from '../types/Property';

interface UserProfile {
  email: string;
  username: string;
  profilePicture: string;
  ownerId: string;
  role: string;
}

const OwnerDetailsPage: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>(); // <-- FIXED
  const [user, setUser] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5266/api';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/User/getUser?id=${ownerId}`, {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user info");
                const userData = await res.json();
                setUser(userData);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchUserProperties = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/Properties/getAllPropertiesByUserId?userId=${ownerId}`, {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user properties");
                const data = await res.json();
                setProperties(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
        fetchUserProperties();
    }, []);

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
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            Rol: {user?.role}
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

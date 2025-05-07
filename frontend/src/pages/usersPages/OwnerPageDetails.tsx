import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../../components/MainNavBar';
import PropertiesList from '../../components/properties/PropertiesList';
import { Property } from '../../types/Property';
import api from "../../api"; 
import OwnerProfileCard, { OwnerProfileCardProps } from '../../components/properties/OwnerProfileCard';

const OwnerDetailsPage: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [user, setUser] = useState<OwnerProfileCardProps | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/User/getUser', {
          params: { id: ownerId },
        });

        const userData = res.data;

        const transformedUser: OwnerProfileCardProps = {
          username: userData.username,
          profileImageUrl: userData.profilePicture,
          ownerId: userData.id,
          createdAt: userData.createdAt,
          showContactButton: true,
          disableLink: true,
        };

        setUser(transformedUser);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="text-lg">Se încarcă...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <MainNavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {user && (
          <div className="mb-10">
            <OwnerProfileCard {...user} />
          </div>
        )}

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

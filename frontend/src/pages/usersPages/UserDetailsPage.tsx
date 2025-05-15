import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../../components/MainNavBar';
import PropertiesList from '../../components/properties/PropertiesList';
import { Property } from '../../types/Property';
import api from "../../api";
import UserCard, { UserCardProps } from '../../components/user/UserCard';

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserCardProps | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/User/getUser', {
          params: { id: userId },
        });

        const userData = res.data;
        setRole(userData.role);

        const transformedUser: UserCardProps = {
          username: userData.username,
          profileImageUrl: userData.profilePicture,
          userId: userData.id,
          createdAt: userData.createdAt,
          showContactButton: true,
          disableLink: true,
        };

        setUser(transformedUser);

        const rolesWithProperties = [0, 2, 3]; 
        if (rolesWithProperties.includes(userData.role)) {
          const propRes = await api.get('/Properties/getAllPropertiesByUserId', {
            params: { userId: userId },
          });
          setProperties(propRes.data);
        }
      } catch (err) {
        console.error("Eroare la încărcarea datelor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="text-lg">Se încarcă profilul...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <MainNavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {user && (
          <div className="mb-10">
            <UserCard {...user} />
          </div>
        )}

        {[0, 2, 3].includes(role ?? -1) && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Proprietățile utilizatorului:</h3>
            {properties.length === 0 ? (
              <p>Nu a adăugat nicio proprietate încă.</p>
            ) : (
              <PropertiesList properties={properties} noResults={false} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;

import React, { useEffect, useState } from 'react';
import api from '../../../../api';
import UserCard from '../../../../components/user/UserCard';
import UserProfileCard from '../../../../components/user/UserProfileCard'; 
import { parseError } from '../../../../utils/parseError';
import { useAuth } from '../../../../hooks/useAuth';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  role: number;
  averageRating?: number;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);  
  const { user } = useAuth(); 
  const [loggedUserData, setLoggedUserData] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    api.get('/User/getAllUsers')
      .then(res => {
        const allUsers = res.data;
        const filteredUsers = allUsers.filter((u: User) => u.id !== user?.id);
        setUsers(filteredUsers);
        const currentUser = allUsers.find((u: User) => u.id === user?.id);
        setLoggedUserData(currentUser || null);
      })
      .catch(err => setError(parseError(err)))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/User/deleteUser`, { params: { userId: id } });
      setUsers(prev => prev.filter(u => u.id !== id));
      setSuccessMessage(parseError({ response: { data: { errorCode: 'USER_DELETED_SUCCESSFULLY' } } }));
      setError(null);
      setConfirmDeleteId(null);  
    } catch (err) {
      setError(parseError(err));
      setSuccessMessage(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contul tău</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      {loggedUserData && (
        <div className="mb-6">
          <UserProfileCard
            user={loggedUserData}
            refreshUser={() => {}} 
          />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Utilizatori</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Caută utilizatori după username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      {loading ? (
        <p>Se încarcă utilizatorii...</p>
      ) : filteredUsers.length === 0 ? (
        <p>Nu există utilizatori care să corespundă căutării.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="relative">
              <UserCard
                username={user.username}
                profileImageUrl={user.profilePicture}
                userId={user.id}
                createdAt={user.createdAt}
                role={user.role}
                averageRating={user.averageRating}
              />
              <div onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2">
                {confirmDeleteId === user.id ? (
                  <div className="bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 p-2 rounded shadow">
                    <p>Ești sigur că vrei să ștergi?</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Da
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded text-xs hover:bg-gray-400"
                      >
                        Anulează
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(user.id)}
                    className="text-sm text-red-600 hover:text-red-800 bg-white rounded-full p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;

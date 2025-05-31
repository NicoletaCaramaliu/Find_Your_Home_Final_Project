import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { rolesMap } from "../../constants/roles";
import { useAuth } from '../../hooks/useAuth';

const { user } = useAuth();


export interface UserCardProps {
  username: string;
  profileImageUrl: string;
  userId: string;
  createdAt: string;
  role?: number;
  showContactButton?: boolean;
  disableLink?: boolean;
  averageRating?: number;
}

const UserCard: React.FC<UserCardProps> = ({
  username,
  profileImageUrl,
  userId,
  createdAt,
  role,
  showContactButton = true,
  disableLink = false,
  averageRating, 
}) => {
  const defaultProfileImage = "/images/defaultProfilePicture.png";
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const navigate = useNavigate();

  const handleContact = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/Conversations/startOrGet", {
        otherUserId: userId,
      });
      const conversationId = res.data;
      setTimeout(() => {
        navigate(`/chat/${conversationId}`);
      }, 300);
    } catch (err) {
      console.error("Eroare la inițiere conversație:", err);
      alert("A apărut o eroare la contactarea utilizatorului.");
    }
  };

  const cardContent = (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
          <img
            src={profileImageUrl || defaultProfileImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultProfileImage;
            }}
            alt={`${username}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{username}</p>
          
          {averageRating !== undefined && (
            <p className="text-yellow-500 text-sm font-medium">
              ⭐ Nota medie: {averageRating.toFixed(2)} / 5
            </p>
          )}

          {role !== undefined && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{rolesMap[role]}</p>
          )}
          <p className="text-sm text-gray-400 dark:text-gray-500">Înregistrat din: {formattedDate}</p>
        </div>
      </div>

      {showContactButton && user?.role !== "0" && (
        <button
          onClick={handleContact}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Contactează
        </button>
      )}
    </div>
  );

  return disableLink ? (
    <div>{cardContent}</div>
  ) : (
    <Link to={`/user/${userId}`} className="block">
      {cardContent}
    </Link>
  );
};

export default UserCard;

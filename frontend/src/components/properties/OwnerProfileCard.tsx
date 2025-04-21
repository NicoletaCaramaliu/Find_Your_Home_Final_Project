import React from 'react';
import { Link } from 'react-router-dom';

interface UserProfile {
  name: string;
  profileImageUrl: string;
  ownerId: string;
  createdAt: string;
}

const OwnerProfileCard: React.FC<UserProfile> = ({ name, profileImageUrl, ownerId, createdAt }) => {
  const defaultProfileImage = "/images/defaultProfPicture.avif";
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <Link to={`/ownerPage/${ownerId}`} className="block">
      <div className="flex items-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        {/* Profile Image */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
          <img
            src={profileImageUrl || defaultProfileImage}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Owner Name & Date */}
        <div className="ml-4">
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Proprietar</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Înregistrat din: {formattedDate}</p>
        </div>
      </div>
    </Link>
  );
};

export default OwnerProfileCard;

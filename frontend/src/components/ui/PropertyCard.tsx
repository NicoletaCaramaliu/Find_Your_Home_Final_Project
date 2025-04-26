import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../../api';

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    price: number;
    rooms: number;
    bathrooms: number;
    garage: boolean;
    squareFeet: number;
    firstImageUrl: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.firstImageUrl || "default.jpg";
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await api.get(`/Favorites/isAlreadyFavorited?propertyId=${property.id}`);
        setIsFavorited(res.data === true);
      } catch (err) {
        console.error("Eroare la verificarea favoritei:", err);
      }
    };

    checkFavorite();
  }, [property.id]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (isFavorited) {
        await api.delete(`/Favorites/removeFromFavorites?propertyId=${property.id}`);
        setIsFavorited(false);
      } else {
        await api.post(`/Favorites/addToMyFavorites?propertyId=${property.id}`);
        setIsFavorited(true);
      }
    } catch (err: any) {
      console.error("Eroare la toggle favorite:", err);
      alert("A apărut o eroare. Încearcă din nou.");
    }
  };

  return (
    <div className="property-card relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img
        src={imageUrl}
        alt={property.name}
        className="w-full h-56 object-cover rounded-t-lg"
      />

      {/* Buton inima */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-200"
        title={isFavorited ? "Elimină din favorite" : "Adaugă la favorite"}
      >
        <Heart
          className="w-5 h-5"
          fill={isFavorited ? "red" : "none"}
          stroke="red"
        />
      </button>

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {property.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{property.address}</p>
        <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          ${property.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

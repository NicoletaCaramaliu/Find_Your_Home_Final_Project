import React from "react";
import { Property } from "../../types/Property";

interface Props {
  favorites: Property[];
  loading: boolean;
  onRemove: (id: string) => void;
  onNavigate: (id: string) => void;
}

const FavoritePropertiesCard: React.FC<Props> = ({ favorites, loading, onRemove, onNavigate }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-2">Proprietăți Favorite</h2>
      {loading ? (
        <p>Se încarcă proprietățile favorite...</p>
      ) : favorites.length === 0 ? (
        <p>Nu ai nicio proprietate favorită.</p>
      ) : (
        <div className="grid gap-4">
          {favorites.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-700 p-4 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div
                onClick={() => onNavigate(property.id)}
                className="cursor-pointer flex gap-4 items-center"
              >
                <img
                  src={property.firstImageUrl || "/images/default.jpg"}
                  alt={property.name}
                  className="w-24 h-24 object-cover rounded-md border"
                />
                <div>
                  <h3 className="text-lg font-bold">{property.name}</h3>
                  <p>{property.address}</p>
                  <p>Preț: {property.price.toLocaleString()} €</p>
                </div>
              </div>

              <button
                onClick={() => onRemove(property.id)}
                className="mt-2 px-3 py-1 bg-red-600 dark:bg-red-900 text-white text-sm rounded hover:bg-red-700"
              >
                Șterge din Favorite
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePropertiesCard;

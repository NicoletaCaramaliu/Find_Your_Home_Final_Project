import React from "react";
import { Property } from "../types/Property";

interface Props {
  properties: Property[];
  loading: boolean;
  onEdit: (id: string) => void;
  onNavigate: (id: string) => void;
}

const MyPropertiesCard: React.FC<Props> = ({ properties, loading, onEdit, onNavigate }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Proprietățile Mele</h2>
      {loading ? (
        <p>Se încarcă proprietățile...</p>
      ) : properties.length === 0 ? (
        <p>Nu ai proprietăți momentan.</p>
      ) : (
        <div className="grid gap-4">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => onNavigate(property.id)}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div>
                <h2 className="text-xl font-bold">{property.name}</h2>
                <p>{property.address}</p>
                <p>Status: {property.isAvailable ? "Disponibil" : "Indisponibil"}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property.id);
                }}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Editare
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesCard;
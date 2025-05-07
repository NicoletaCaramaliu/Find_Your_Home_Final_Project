import React, { useState } from "react";
import { Property } from "../../types/Property";
import SlotManagerModal from "../slots/SlotManagerModal";

interface Props {
  properties: Property[];
  loading: boolean;
  onEdit: (id: string) => void;
  onNavigate: (id: string) => void;
}

const MyPropertiesCard: React.FC<Props> = ({ properties, loading, onEdit, onNavigate }) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Proprietățile Mele</h2>

      {selectedPropertyId && (
        <SlotManagerModal
          propertyId={selectedPropertyId}
          onClose={() => setSelectedPropertyId(null)}
        />
      )}

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
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              
              <img
                src={property.firstImageUrl || "/images/default.jpg"}
                alt={property.name}
                className="w-24 h-24 object-cover rounded-md border"
              />

              <div className="flex-grow">
                <h2 className="text-xl font-bold">{property.name}</h2>
                <p>{property.address}</p>
                <p>Status: {property.isAvailable ? "Disponibil" : "Indisponibil"}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(property.id);
                  }}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Editare
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPropertyId(property.id);
                  }}
                  className="text-green-600 hover:underline dark:text-green-400"
                >
                  Gestionează perioadele de vizită
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesCard;

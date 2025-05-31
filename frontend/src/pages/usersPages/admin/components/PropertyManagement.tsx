import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';

interface Property {
  id: string;
  name: string;
  isAvailable: boolean;
  firstImageUrl?: string;
}

const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/Properties/getAllProperties')
      .then(res => setProperties(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/Properties/deleteProperty?propertyId=${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Proprietăți</h2>

      <input
        type="text"
        placeholder="Caută după nume..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />

      {loading ? (
        <p>Se încarcă proprietățile...</p>
      ) : filteredProperties.length === 0 ? (
        <p>Nu există proprietăți care să corespundă căutării.</p>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2">
          {filteredProperties.map(property => (
            <div
              key={property.id}
              onClick={() => handleNavigate(property.id)}
              className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-4 relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img
                src={property.firstImageUrl || '/images/default.jpg'}
                alt={property.name}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{property.name}</h3>
                <p className={`text-sm mt-1 ${property.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {property.isAvailable ? 'Disponibil' : 'Indisponibil'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(property.id);
                }}
                className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800"
              >
                Șterge
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;

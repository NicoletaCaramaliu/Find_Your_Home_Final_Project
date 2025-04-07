import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyCard } from '../ui/PropertyCard';
import api from '../../api'; // Import API pentru apeluri HTTP

interface Property {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    price: number;
    rooms: number;
    bathrooms: number;
    garage: boolean;
    squareFeet: number;
    level: number;
    isAvailable: boolean;
    numberOfKitchen: number;
    numberOfBalconies: number;
    hasGarden: boolean;
    forRent: boolean;
    views: number;
    yearOfConstruction: number;
    furnished: boolean;
    firstImageUrl: string;
}

interface PropertiesListProps {
    properties: Property[];
    noResults: boolean;
}

const PropertiesList: React.FC<PropertiesListProps> = ({ properties, noResults }) => {
    const navigate = useNavigate();

    const handlePropertyClick = async (propertyId: string) => {
        try {
            await api.post(`/Properties/increaseViews?propertyId=${propertyId}`);
        } catch (err) {
            console.error('Eroare la creșterea numărului de vizualizări:', err);
        } finally {
            navigate(`/properties/${propertyId}`);
        }
    };

    return (
        <div className="w-full lg:w-3/4 p-6 bg-gray-100 dark:bg-gray-500 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Proprietăți</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {noResults ? (
                    <p className="text-gray-700 dark:text-white col-span-full text-center">
                        Nu s-au găsit proprietăți conform filtrelor aplicate.
                    </p>
                ) : (
                    properties.map(property => (
                        <div
                            key={property.id}
                            onClick={() => handlePropertyClick(property.id)}
                            className="cursor-pointer"
                        >
                            <PropertyCard property={property} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PropertiesList;
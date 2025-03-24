import React from 'react';
import { Link } from 'react-router-dom';
import { PropertyCard } from '../ui/PropertyCard';

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
    imageUrls: string[];
}

interface PropertiesListProps {
    properties: Property[];
    noResults: boolean;
}

const PropertiesList: React.FC<PropertiesListProps> = ({ properties, noResults }) => {
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
                        <Link key={property.id} to={`/properties/${property.id}`}>
                            <PropertyCard property={property} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default PropertiesList;
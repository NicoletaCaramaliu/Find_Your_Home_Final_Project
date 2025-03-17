import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PropertyCard } from '../components/ui/PropertyCard';
import MainNavBar from '../components/MainNavBar';

const API_URL = "http://localhost:5266/api/Properties";

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
    isAvailable: boolean;
    imageUrls: string[];
}

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/getAllProperties`)
            .then(response => response.json())
            .then(data => {
                console.log("Raw API Data:", data); 
            
                const formattedData = data.map((property: any) => ({
                    id: property.id,
                    name: property.name,
                    description: property.description,
                    address: `${property.address}, ${property.city}, ${property.state} ${property.zip}`,
                    price: property.price,
                    rooms: property.rooms,
                    bathrooms: property.bathrooms,
                    garage: property.garage,
                    squareFeet: property.squareFeet,
                    isAvailable: property.isAvailable,
                    imageUrls: Array.isArray(property.imageUrls) && property.imageUrls.length > 0 
                        ? property.imageUrls 
                        : ["default.jpg"] 
                }));
            
                console.log("Formatted Data:", formattedData);
                setProperties(formattedData);
            })
            
            
            .catch(error => console.error("Error fetching properties:", error));
    }, []);
    

    return (
        <div>
            <div className="w-full bg-blue-500 dark:bg-gray-800/90">
                <MainNavBar />
            </div>
            <div className="min-h-screen flex">
                <div className="w-full lg:w-3/4 p-6 bg-gray-100 dark:bg-gray-500 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Proprietăți</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map(property => (
                            <Link key={property.id} to={`/properties/${property.id}`}>
                                <PropertyCard property={property} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPage;

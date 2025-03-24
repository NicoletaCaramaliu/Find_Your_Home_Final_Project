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
    level: number;
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
                    level: property.level,
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
                {/* Properties Section */}
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

                {/* Filter Section */}
                <div className="hidden lg:block lg:w-1/4 p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtrează Proprietăți</h2>
                    <form>
                    <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Oraș:</label>
                            <input
                                type="text"
                                placeholder="Ex: București"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Județ:</label>
                            <input
                                type="text"
                                placeholder="Ex: București"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                    <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Preț Minim:</label>
                            <input
                                type="number"
                                placeholder="Ex: 100"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Preț Maxim:</label>
                            <input
                                type="number"
                                placeholder="Ex: 1000000"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Număr de Camere:</label>
                            <input
                                type="number"
                                placeholder="Ex: 3"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Număr de Băi:</label>
                            <input
                                type="number"
                                placeholder="Ex: 2"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Garaj:</label>
                            <select
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            >
                                <option value="">Oricare</option>
                                <option value="true">Da</option>
                                <option value="false">Nu</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200">Suprafață minimă (mp):</label>
                            <input
                                type="number"
                                placeholder="Ex: 50"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Aplică Filtre
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPage;

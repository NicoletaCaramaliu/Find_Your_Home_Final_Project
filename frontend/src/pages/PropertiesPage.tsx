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
    const [noResults, setNoResults] = useState(false);
    const [filters, setFilters] = useState({
        city: "",
        state: "",
        minPrice: "",
        maxPrice: "",
        rooms: "",
        bathrooms: "",
        garage: "",
        squareFeet: "",
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = (queryParams: string = "") => {
        fetch(`${API_URL}/filterProperties?${queryParams}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch properties");
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    setNoResults(true);
                    setProperties([]);
                } else {
                    setNoResults(false);
                    setProperties(data);
                }
            })
            .catch(error => {
                console.error("Error fetching properties:", error);
                setNoResults(true);
                setProperties([]);
            });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked.toString() : value,
        }));
    };

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "") {
                if (key === "garage") {
                    queryParams.append(key, value === "true" ? "true" : "false");
                } else if (["minPrice", "maxPrice", "rooms", "bathrooms", "squareFeet"].includes(key)) {
                    queryParams.append(key, Number(value).toString());
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        console.log("Query Params Sent:", queryParams.toString());
        fetchProperties(queryParams.toString());
    };

    return (
        <div>
            <div className="w-full bg-blue-500 dark:bg-gray-800/90">
                <MainNavBar />
            </div>
            <div className="min-h-screen flex">
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
                <div className="hidden lg:block lg:w-1/4 p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtrează Proprietăți</h2>
                    <form onSubmit={applyFilters}>
                        <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Oraș" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4" />
                        <input type="text" name="state" value={filters.state} onChange={handleFilterChange} placeholder="Județ" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4" />
                        <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Preț Minim" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4" />
                        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Preț Maxim" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4" />
                        <input type="number" name="rooms" value={filters.rooms} onChange={handleFilterChange} placeholder="Număr de camere" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4" />
                        <input type="number" name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange} placeholder="Număr de băi" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4" />
                        <input type="number" name="squareFeet" value={filters.squareFeet} onChange={handleFilterChange} placeholder="Suprafață minimă (mp)" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4" />
                        <label className="flex items-center text-gray-700 dark:text-gray-200">
                            <input type="checkbox" name="garage" checked={filters.garage === "true"} onChange={handleFilterChange} className="mr-2" />
                            Garaj
                        </label>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4">
                            Aplică Filtre
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPage;

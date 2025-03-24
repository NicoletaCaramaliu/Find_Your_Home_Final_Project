import React, { useEffect, useState } from 'react';
import MainNavBar from '../components/MainNavBar';
import FiltersForm from '../components/properties/FiltersForm';
import PropertiesList from '../components/properties/PropertiesList';

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

interface Filters {
    city: string;
    state: string;
    minPrice: string;
    maxPrice: string;
    rooms: string;
    bathrooms: string;
    garage: string;
    squareFeet: string;
}

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [noResults, setNoResults] = useState(false);
    const [filters, setFilters] = useState<Filters>({
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
                queryParams.append(key, value);
            }
        });
        fetchProperties(queryParams.toString());
    };

    return (
        <div>
            <div className="w-full bg-blue-500 dark:bg-gray-800/90">
                <MainNavBar />
            </div>
            <div className="min-h-screen flex">
                <PropertiesList properties={properties} noResults={noResults} />
                <FiltersForm
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilters={applyFilters}
                />
            </div>
        </div>
    );
};

export default PropertiesPage;
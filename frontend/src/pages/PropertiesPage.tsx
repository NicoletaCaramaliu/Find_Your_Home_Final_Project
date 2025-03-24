import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    imageUrls: string[]; // Updated to include the first image URL
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

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const parsedFilters: Filters = {
            city: searchParams.get("city") || "",
            state: searchParams.get("state") || "",
            minPrice: searchParams.get("minPrice") || "",
            maxPrice: searchParams.get("maxPrice") || "",
            rooms: searchParams.get("rooms") || "",
            bathrooms: searchParams.get("bathrooms") || "",
            garage: searchParams.get("garage") || "",
            squareFeet: searchParams.get("squareFeet") || "",
        };
        setFilters(parsedFilters);
        fetchProperties(searchParams.toString());
    }, [location.search]);

    const fetchProperties = async (queryParams: string = "") => {
        try {
            const response = await fetch(`${API_URL}/filterProperties?${queryParams}`);
            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }
            const data: Property[] = await response.json();

            if (data.length === 0) {
                setNoResults(true);
                setProperties([]);
            } else {
                setNoResults(false);

                // Fetch the first image for each property
                const propertiesWithImages = await Promise.all(
                    data.map(async (property) => {
                        const imagesResponse = await fetch(`${API_URL}/getAllPropertyImages?propertyId=${property.id}`);
                        if (imagesResponse.ok) {
                            const images: string[] = await imagesResponse.json();
                            property.imageUrls = images.length > 0 ? [images[0]] : []; //the first image or an empty array
                        } else {
                            property.imageUrls = []; // nothing if no images are found
                        }
                        return property;
                    })
                );

                setProperties(propertiesWithImages);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            setNoResults(true);
            setProperties([]);
        }
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

        // update the URL with the current filters
        navigate(`?${queryParams.toString()}`);
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
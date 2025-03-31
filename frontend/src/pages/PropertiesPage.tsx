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
    numberOfKitchen: number;
    numberOfBalconies: number;
    hasGarden: boolean;
    forRent: boolean;
    views: number;
    yearOfConstruction: number;
    furnished: boolean;
    firstImageUrl: string; 
    createdAt: string;
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
    level: string;
    numberOfKitchen: string;
    numberOfBalconies: string;
    hasGarden: string;
    forRent: string;
    yearOfConstruction: string;
    furnished: string;
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
        level: "",
        numberOfKitchen: "",
        numberOfBalconies: "",
        hasGarden: "",
        forRent: "",
        yearOfConstruction: "",
        furnished: "",
    });

    const [sortCriteria, setSortCriteria] = useState({
        sortBy: "", // Default to no selection
        sortOrder: "", // Default to no selection
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
            level: searchParams.get("level") || "",
            numberOfKitchen: searchParams.get("numberOfKitchen") || "",
            numberOfBalconies: searchParams.get("numberOfBalconies") || "",
            hasGarden: searchParams.get("hasGarden") || "",
            forRent: searchParams.get("forRent") || "",
            yearOfConstruction: searchParams.get("yearOfConstruction") || "",
            furnished: searchParams.get("furnished") || "",
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
                // Map firstImageUrl to imageUrls
                const mappedProperties = data.map(property => ({
                    ...property,
                    imageUrls: property.firstImageUrl ? [property.firstImageUrl] : [], 
                }));
                setProperties(mappedProperties);
                console.log("Fetched properties:", mappedProperties);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            setNoResults(true);
            setProperties([]);
        }
    };
    
    const fetchSortedProperties = async () => {
        if (!sortCriteria.sortBy || !sortCriteria.sortOrder) {
            console.warn("Sort criteria are incomplete. Skipping API call.");
            return;
        }
    
        try {
            const response = await fetch(
                `${API_URL}/sortProperties?sortBy=${sortCriteria.sortBy}&sortOrder=${sortCriteria.sortOrder}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch sorted properties");
            }
            const data: Property[] = await response.json();
    
            // Map firstImageUrl to imageUrls
            const mappedProperties = data.map(property => ({
                ...property,
                imageUrls: property.firstImageUrl ? [property.firstImageUrl] : [], // Corrected case
            }));
            setProperties(mappedProperties);
        } catch (error) {
            console.error("Error fetching sorted properties:", error);
        }
    };

    const handleSortChange = (sortBy: string, sortOrder: string) => {
        setSortCriteria({ sortBy, sortOrder });
    };

    useEffect(() => {
        fetchSortedProperties();
    }, [sortCriteria]);

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

        navigate(`?${queryParams.toString()}`);
    };

    const handleClearFilters = () => {
        setFilters({
            city: "",
            state: "",
            minPrice: "",
            maxPrice: "",
            rooms: "",
            bathrooms: "",
            garage: "",
            squareFeet: "",
            level: "",
            numberOfKitchen: "",
            numberOfBalconies: "",
            hasGarden: "",
            forRent: "",
            yearOfConstruction: "",
            furnished: "",
        });
        navigate("?"); // Reset the URL query parameters
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
                    onClearFilters={handleClearFilters}
                    sortBy={sortCriteria.sortBy}
                    sortOrder={sortCriteria.sortOrder}
                    onSortChange={handleSortChange}
                />
            </div>
        </div>
    );
};

export default PropertiesPage;
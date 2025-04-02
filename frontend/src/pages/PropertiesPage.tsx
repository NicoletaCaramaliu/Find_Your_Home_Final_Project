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

    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 4, // Default page size
    });

    const [, setTotalProperties] = useState(0); 
    const [isLastPage, setIsLastPage] = useState(false); 

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
    }, [location.search, pagination.pageNumber, pagination.pageSize]);

    const fetchProperties = async (queryParams: string = "") => {
        try {
            const response = await fetch(
                `${API_URL}/filterProperties?${queryParams}&pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }
            const data = await response.json();

            
            setTotalProperties(data.totalCount);
            setIsLastPage(pagination.pageNumber * pagination.pageSize >= data.totalCount);

            if (data.items.length === 0) {
                setNoResults(true);
                setProperties([]);
            } else {
                setNoResults(false);
                const mappedProperties = data.items.map((property: Property) => ({
                    ...property,
                    imageUrls: property.firstImageUrl ? [property.firstImageUrl] : [],
                }));
                setProperties(mappedProperties);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            setNoResults(true);
            setProperties([]);
        }
    };

    const handleSortChange = (sortBy: string, sortOrder: string) => {
        setSortCriteria({ sortBy, sortOrder });
    };

    useEffect(() => {
        fetchProperties();
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

    const handlePageChange = (newPageNumber: number) => {
        setPagination(prev => ({
            ...prev,
            pageNumber: newPageNumber,
        }));
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPagination({
            pageNumber: 1, // Reset to the first page
            pageSize: parseInt(e.target.value, 10),
        });
    };

    return (
        <div className="w-full bg-gray-400 dark:bg-gray-400/90">
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

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    disabled={pagination.pageNumber === 1}
                    onClick={() => handlePageChange(pagination.pageNumber - 1)}
                    className="px-4 py-2 bg-gray-500 dark:bg-gray-900/90 rounded disabled:opacity-50"
                >
                    Înapoi
                </button>
                <span className="mx-4">Pagina {pagination.pageNumber}</span>
                <button
                    disabled={isLastPage}
                    onClick={() => handlePageChange(pagination.pageNumber + 1)}
                    className="px-4 py-2 bg-gray-500 dark:bg-gray-900/90 rounded disabled:opacity-50"
                >
                    Înainte
                </button>
            </div>

            {/* Page Size Selector */}
            <div className="flex justify-center mt-4">
                <label htmlFor="pageSize" className="mr-2">Rezultate pe pagină:</label>
                <select
                    id="pageSize"
                    value={pagination.pageSize}
                    onChange={handlePageSizeChange}
                    className="border rounded px-2 py-1"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    );
};

export default PropertiesPage;
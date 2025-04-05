import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import FiltersForm from '../components/properties/FiltersForm';
import PropertiesList from '../components/properties/PropertiesList';
import { Property } from '../types/Property';
import {Filters} from '../types/Filters';

const API_URL = "http://localhost:5266/api/Properties";



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
        sortBy: "",
        sortOrder: "",
    });

    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 10, // Default page size
    });

    const [searchText, setSearchText] = useState(""); // Adăugat pentru căutare
    const [, setTotalProperties] = useState(0); 
    const [isLastPage, setIsLastPage] = useState(false); 

    const location = useLocation();
    const navigate = useNavigate();

    // Fetch properties when filters, pagination, sort, or search changes
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
        setSearchText(searchParams.get("searchText") || ""); // Sincronizează textul de căutare
        fetchProperties(searchParams.toString());
    }, [location.search, pagination.pageNumber, pagination.pageSize, sortCriteria]);

    const fetchProperties = async (queryParams: string = "") => {
        const token = localStorage.getItem("token");
        const url = `${API_URL}/filterAndSortProperties?${queryParams}&searchText=${searchText}&sortBy=${sortCriteria.sortBy}&sortOrder=${sortCriteria.sortOrder}&pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}`;
    
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include' 
            });
    
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
                setProperties(data.items);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            setNoResults(true);
            setProperties([]);
        }
    };
    

    const handleSortChange = (sortBy: string, sortOrder: string) => {
        setSortCriteria({ sortBy, sortOrder });

        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "") {
                queryParams.append(key, value);
            }
        });

        queryParams.set("sortBy", sortBy);
        queryParams.set("sortOrder", sortOrder);
        queryParams.set("pageNumber", pagination.pageNumber.toString());
        queryParams.set("pageSize", pagination.pageSize.toString());
        queryParams.set("searchText", searchText);

        navigate(`?${queryParams.toString()}`);
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
        queryParams.set("pageNumber", "1"); // Always start from page 1 when applying filters
        queryParams.set("pageSize", pagination.pageSize.toString());
        queryParams.set("searchText", searchText);
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
        setSearchText(""); // Resetează textul de căutare
        navigate("?"); // Reset the URL query parameters
    };

    const handlePageChange = (newPageNumber: number) => {
        setPagination(prev => ({
            ...prev,
            pageNumber: newPageNumber,
        }));

        const queryParams = new URLSearchParams(location.search);
        queryParams.set("pageNumber", newPageNumber.toString());
        navigate(`?${queryParams.toString()}`);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value, 10);

        setPagination({
            pageNumber: 1, // Reset to page 1 when page size changes
            pageSize: newSize,
        });

        const queryParams = new URLSearchParams(location.search);
        queryParams.set("pageSize", newSize.toString());
        queryParams.set("pageNumber", "1");
        navigate(`?${queryParams.toString()}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleSearchSubmit = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set("searchText", searchText);
        queryParams.set("pageNumber", "1"); // Resetăm la prima pagină după căutare
        navigate(`?${queryParams.toString()}`);
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
                    searchText={searchText} // Adăugat
                    onSearchChange={handleSearchChange} // Adăugat
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
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import FiltersForm from '../components/properties/FiltersForm';
import PropertiesList from '../components/properties/PropertiesList';
import { Property } from '../types/Property';
import { usePropertiesState } from '../hooks/usePropertiesState';
import { getQueryStateFromSearchParams, buildQueryParamsFromState } from '../utils/queryHelpers';
import { defaultFilters } from '../constants/defaultFilters';
import api from "../api";

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [noResults, setNoResults] = useState(false);
    const [, setTotalProperties] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        filters, setFilters,
        sortCriteria, setSortCriteria,
        pagination, setPagination,
        searchText, setSearchText
    } = usePropertiesState();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const {
            filters: queryFilters,
            pagination: queryPagination,
            searchText: querySearchText,
            sortCriteria: querySortCriteria
        } = getQueryStateFromSearchParams(location.search);
    
        setFilters(queryFilters);
        setPagination(queryPagination);
        setSearchText(querySearchText);
        setSortCriteria(querySortCriteria);
    
        const queryParams = buildQueryParamsFromState(
            queryFilters,
            queryPagination,
            querySearchText,
            querySortCriteria
        );
    
        fetchProperties(queryParams);
    }, [location.search]);
    
    

    const fetchProperties = async (queryParams: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/Properties/filterAndSortProperties?${queryParams}`);
            const data = response.data;

            setTotalProperties(data.totalCount);
            setIsLastPage(pagination.pageNumber * pagination.pageSize >= data.totalCount);
            setNoResults(data.items.length === 0);
            setProperties(data.items);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setNoResults(true);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const updateURL = async (
        customFilters = filters,
        customPagination = pagination,
        customSearchText = searchText,
        customSortCriteria = sortCriteria
    ) => {
        const query = buildQueryParamsFromState(customFilters, customPagination, customSearchText, customSortCriteria);
        navigate(`?${query}`);
        await fetchProperties(query);
    };
    

    const handleSortChange = (sortBy: string, sortOrder: string) => {
        const newSort = { sortBy, sortOrder };
        const newPagination = { ...pagination, pageNumber: 1 };
        setSortCriteria(newSort);
        setPagination(newPagination);
        updateURL(filters, newPagination, searchText, newSort);
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
        const newPagination = { ...pagination, pageNumber: 1 };
        const newFilters = { ...filters }; // sau ia din formular dacă vrei
        setPagination(newPagination);
        updateURL(newFilters, newPagination, searchText, sortCriteria);
    };
    

    const handleClearFilters = () => {
        setFilters(defaultFilters);
        setSearchText("");
        const newPagination = { pageNumber: 1, pageSize: pagination.pageSize };
        setPagination(newPagination);

        const query = buildQueryParamsFromState(defaultFilters, newPagination, "", { sortBy: "", sortOrder: "" });
        navigate(`?${query}`);
    };

    const handlePageChange = (newPageNumber: number) => {
        const newPagination = { ...pagination, pageNumber: newPageNumber };
        setPagination(newPagination);
        updateURL(filters, newPagination, searchText, sortCriteria);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value, 10);
        const newPagination = { pageNumber: 1, pageSize: newSize };
        setPagination(newPagination);
        updateURL(filters, newPagination, searchText, sortCriteria);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleSearchSubmit = () => {
        const newPagination = { ...pagination, pageNumber: 1 };
        setPagination(newPagination);
        updateURL(filters, newPagination, searchText, sortCriteria);
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
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onSearchSubmit={handleSearchSubmit}
                />
            </div>

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

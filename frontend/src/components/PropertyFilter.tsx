import React, { useState } from 'react';

interface PropertyFilterProps {
    onFilter: (filters: any) => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        city: '',
        state: '',
        minPrice: '',
        maxPrice: '',
        rooms: '',
        bathrooms: '',
        squareFeet: '',
        garage: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(filters);
    };

    return (
        <div className="hidden lg:block lg:w-1/4 p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtrează Proprietăți</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: "Oraș", name: "city", type: "text", placeholder: "Ex: București" },
                    { label: "Județ", name: "state", type: "text", placeholder: "Ex: București" },
                    { label: "Preț Minim", name: "minPrice", type: "number", placeholder: "Ex: 100" },
                    { label: "Preț Maxim", name: "maxPrice", type: "number", placeholder: "Ex: 1000000" },
                    { label: "Număr de Camere", name: "rooms", type: "number", placeholder: "Ex: 3" },
                    { label: "Număr de Băi", name: "bathrooms", type: "number", placeholder: "Ex: 2" },
                    { label: "Suprafață minimă (mp)", name: "squareFeet", type: "number", placeholder: "Ex: 50" }
                ].map((field, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">{field.label}:</label>
                        <input
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={filters[field.name as keyof typeof filters]}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        />
                    </div>
                ))}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200">Garaj:</label>
                    <select
                        name="garage"
                        value={filters.garage}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                        <option value="">Oricare</option>
                        <option value="true">Da</option>
                        <option value="false">Nu</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Aplică Filtre
                </button>
            </form>
        </div>
    );
};

export default PropertyFilter;

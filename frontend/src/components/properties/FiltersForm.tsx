import React, { useState } from 'react';

interface Filters {
    city: string;
    state: string;
    minPrice: string;
    maxPrice: string;
    rooms: string;
    bathrooms: string;
    garage: string;
    squareFeet: string;
    numberOfKitchen: string;
    numberOfBalconies: string;
    hasGarden: string;
    forRent: string;
    yearOfConstruction: string;
    furnished: string;
}

interface FiltersFormProps {
    filters: Filters;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onApplyFilters: (e: React.FormEvent) => void;
    onClearFilters: () => void;
    sortBy: string; 
    sortOrder: string; 
    onSortChange: (sortBy: string, sortOrder: string) => void; 
    searchText: string; // Adăugat pentru căutare
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Adăugat pentru căutare
}

const FiltersForm: React.FC<FiltersFormProps> = ({
    filters,
    onFilterChange,
    onApplyFilters,
    onClearFilters,
    sortBy,
    sortOrder,
    onSortChange,
    searchText, // Adăugat
    onSearchChange, // Adăugat
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const inputFields = [
        { name: 'city', type: 'text', placeholder: 'Oraș' },
        { name: 'state', type: 'text', placeholder: 'Județ' },
        { name: 'minPrice', type: 'number', placeholder: 'Preț Minim' },
        { name: 'maxPrice', type: 'number', placeholder: 'Preț Maxim' },
        { name: 'rooms', type: 'number', placeholder: 'Număr de camere' },
        { name: 'bathrooms', type: 'number', placeholder: 'Număr de băi' },
        { name: 'squareFeet', type: 'number', placeholder: 'Suprafață minimă (mp)' },
        { name: 'numberOfKitchen', type: 'number', placeholder: 'Număr de bucătării' },
        { name: 'numberOfBalconies', type: 'number', placeholder: 'Număr de balcoane' },
        { name: 'yearOfConstruction', type: 'number', placeholder: 'Anul construcției' },
    ];

    const checkboxFields = [
        { name: 'hasGarden', label: 'Grădină' },
        { name: 'forRent', label: 'De închiriat' },
        { name: 'furnished', label: 'Mobilat' },
        { name: 'garage', label: 'Garaj' },
    ];

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [newSortBy, newSortOrder] = e.target.value.split("-");
        onSortChange(newSortBy, newSortOrder);
    };

    return (
        <div className="lg:w-1/4 p-6 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md">
                    {/* Search Input */}
                    <div className="mb-4">
            <label htmlFor="search" className="block text-gray-700 dark:text-white mb-2">
                Caută Proprietăți:
            </label>
            <div className="flex">
                <input
                    id="search"
                    type="text"
                    value={searchText}
                    onChange={onSearchChange}
                    placeholder="Introdu textul de căutare..."
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                />
                <button
                    type="button"
                    onClick={onApplyFilters}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Caută
                </button>
            </div>
        </div>

            {/* Sorting Dropdown */}
            <div className="mb-4">
                <label htmlFor="sort" className="block text-gray-700 dark:text-white mb-2">
                    Sortează Proprietățile:
                </label>
                <select
                    id="sort"
                    value={sortBy ? `${sortBy}-${sortOrder}` : ""}
                    onChange={handleSortChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                >
                    <option value="" disabled>
                        -Selectează criteriul-
                    </option>
                    <option value="price-asc">Preț (Crescător)</option>
                    <option value="price-desc">Preț (Descrescător)</option>
                    <option value="date-asc">Data Publicării (Crescător)</option>
                    <option value="date-desc">Data Publicării (Descrescător)</option>
                </select>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
                {isOpen ? 'Ascunde Filtre' : 'Filtrează proprietățile'}
            </button>

            {/* Collapsible Form */}
            {isOpen && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtrează Proprietăți</h2>
                    <form onSubmit={onApplyFilters}>
                        {inputFields.map((field) => (
                            <input
                                key={field.name}
                                type={field.type}
                                name={field.name}
                                value={filters[field.name as keyof Filters]}
                                onChange={onFilterChange}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                            />
                        ))}
                        {checkboxFields.map((field) => (
                            <label key={field.name} className="flex items-center text-gray-700 dark:text-gray-200 mb-4">
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    checked={filters[field.name as keyof Filters] === 'true'}
                                    onChange={onFilterChange}
                                    className="mr-2"
                                />
                                {field.label}
                            </label>
                        ))}
                        <div className="flex justify-between mt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                Aplică Filtre
                            </button>
                            <button
                                type="button"
                                onClick={onClearFilters}
                                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                            >
                                Resetează Filtre
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FiltersForm;
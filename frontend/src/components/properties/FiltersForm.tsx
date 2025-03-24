import React from 'react';

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

interface FiltersFormProps {
    filters: Filters;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onApplyFilters: (e: React.FormEvent) => void;
}

const FiltersForm: React.FC<FiltersFormProps> = ({ filters, onFilterChange, onApplyFilters }) => {
    return (
        <div className="hidden lg:block lg:w-1/4 p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtrează Proprietăți</h2>
            <form onSubmit={onApplyFilters}>
                <input
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={onFilterChange}
                    placeholder="Oraș"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                />
                <input
                    type="text"
                    name="state"
                    value={filters.state}
                    onChange={onFilterChange}
                    placeholder="Județ"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                />
                <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={onFilterChange}
                    placeholder="Preț Minim"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                />
                <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={onFilterChange}
                    placeholder="Preț Maxim"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                />
                <input
                    type="number"
                    name="rooms"
                    value={filters.rooms}
                    onChange={onFilterChange}
                    placeholder="Număr de camere"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                />
                <input
                    type="number"
                    name="bathrooms"
                    value={filters.bathrooms}
                    onChange={onFilterChange}
                    placeholder="Număr de băi"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                />
                <input
                    type="number"
                    name="squareFeet"
                    value={filters.squareFeet}
                    onChange={onFilterChange}
                    placeholder="Suprafață minimă (mp)"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white mb-4"
                />
                <label className="flex items-center text-gray-700 dark:text-gray-200">
                    <input
                        type="checkbox"
                        name="garage"
                        checked={filters.garage === "true"}
                        onChange={onFilterChange}
                        className="mr-2"
                    />
                    Garaj
                </label>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
                >
                    Aplică Filtre
                </button>
            </form>
        </div>
    );
};

export default FiltersForm;
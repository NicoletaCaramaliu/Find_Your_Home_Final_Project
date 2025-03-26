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
    onClearFilters: () => void; // New prop for clearing filters
}

const FiltersForm: React.FC<FiltersFormProps> = ({ filters, onFilterChange, onApplyFilters, onClearFilters }) => {
    const [isOpen, setIsOpen] = useState(false); // State to control visibility of the form

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

    return (
        <div className="lg:w-1/4 p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
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
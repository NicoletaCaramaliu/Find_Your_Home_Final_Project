import React from "react";

interface SortDropdownProps {
    sortBy: string;
    sortOrder: string;
    onSortChange: (sortBy: string, sortOrder: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, sortOrder, onSortChange }) => {
    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value, sortOrder); 
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(sortBy, e.target.value);
    };

    return (
        <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <label className="block text-gray-700 dark:text-white font-semibold mb-2">
                Sortează după:
            </label>
            <div className="flex space-x-2">
                {/* Sort By Dropdown */}
                <select
                    value={sortBy}
                    onChange={handleSortByChange}
                    className="w-1/2 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                >
                    <option value="" disabled>
                        -Selectează criteriul-
                    </option>
                    <option value="price">Preț</option>
                    <option value="date">Data Adăugării</option>
                </select>

                {/* Sort Order Dropdown */}
                <select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    className="w-1/2 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                >
                    <option value="" disabled>
                        -Selectează ordinea-
                    </option>
                    <option value="asc">Crescător</option>
                    <option value="desc">Descrescător</option>
                </select>
            </div>
        </div>
    );
};

export default SortDropdown;
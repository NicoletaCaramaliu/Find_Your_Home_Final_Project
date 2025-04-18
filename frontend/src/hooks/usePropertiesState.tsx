import { useState } from "react";
import { Filters } from "../types/Filters";

export function usePropertiesState() {
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
        pageSize: 10,
    });

    const [searchText, setSearchText] = useState("");

    return {
        filters,
        setFilters,
        sortCriteria,
        setSortCriteria,
        pagination,
        setPagination,
        searchText,
        setSearchText,
    };
}

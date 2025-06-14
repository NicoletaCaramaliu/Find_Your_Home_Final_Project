import { Filters } from "../types/Filters";

export function getQueryStateFromSearchParams(search: string) {
    const searchParams = new URLSearchParams(search);
    
    const filters: Filters = {
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

    const pagination = {
        pageNumber: parseInt(searchParams.get("pageNumber") || "1", 10),
        pageSize: parseInt(searchParams.get("pageSize") || "6", 10),
    };

    const searchText = searchParams.get("searchText") || "";
    const sortCriteria = {
        sortBy: searchParams.get("sortBy") || "",
        sortOrder: searchParams.get("sortOrder") || "",
    };

    return { filters, pagination, searchText, sortCriteria };
}

export function buildQueryParamsFromState(
    filters: Filters,
    pagination: { pageNumber: number; pageSize: number },
    searchText: string,
    sortCriteria: { sortBy: string; sortOrder: string }
) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") params.append(key, value);
    });

    params.set("pageNumber", pagination.pageNumber.toString());
    params.set("pageSize", pagination.pageSize.toString());
    params.set("searchText", searchText);
    params.set("sortBy", sortCriteria.sortBy);
    params.set("sortOrder", sortCriteria.sortOrder);

    return params.toString();
}

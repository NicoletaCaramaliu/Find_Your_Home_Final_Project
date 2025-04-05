export interface Property {
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
}

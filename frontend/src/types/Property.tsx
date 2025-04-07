export interface Property {
    id: string;
    category: string;
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
    level: number;
    squareFeet: number;
    isAvailable: boolean;
    numberOfKitchen: number;
    numberOfBalconies: number;
    hasGarden: boolean;
    forRent: boolean;
    yearOfConstruction: number;
    furnished: boolean;
    petFriendly: boolean;
    firstImageUrl: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    views: number; 
  }
  
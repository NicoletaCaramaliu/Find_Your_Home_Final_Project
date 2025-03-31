interface PropertyCardProps {
    property: {
        id: string;
        name: string;
        address: string;
        price: number;
        rooms: number;
        bathrooms: number;
        garage: boolean;
        squareFeet: number;
        firstImageUrl: string; 
    };
  }
  
  export function PropertyCard({ property }: PropertyCardProps) {
      const imageUrl = property.firstImageUrl || "default.jpg"; 
    
      return (
          <div className="property-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img 
                  src={imageUrl}  
                  alt={property.name} 
                  className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{property.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{property.address}</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                      ${property.price.toLocaleString()}
                  </p>
              </div>
          </div>
      );
  }
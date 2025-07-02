import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import api from "../../api";
import { Property } from "../../types/Property";

const RecommendedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchRecommendedProperties = async () => {
      try {
        const queryParams = new URLSearchParams({
          sortBy: "views",
          sortOrder: "desc",
          pageNumber: "1",
          pageSize: "10",
        }).toString();

        const response = await api.get(`/Properties/filterAndSortProperties?${queryParams}`);
        setProperties(response.data.items);
      } catch (error) {
        console.error("Eroare la încărcarea proprietăților recomandate:", error);
      }
    };

    fetchRecommendedProperties();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="recommended" className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">🏡 Proprietăți recomandate</h2>
        {properties.length > 0 ? (
            <div className="relative w-full">
            <Slider {...sliderSettings}>
                {properties.map((property) => (
                <div key={property.id} className="p-2 w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-[400px]">
                    <img src={property.firstImageUrl || "https://source.unsplash.com/400x300/?house"} alt={property.name} className="w-full h-48 object-cover" />
                    <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                        <h3 className="font-bold text-lg">{property.name}</h3>
                        <p className="text-sm">{property.city}, {property.address}</p>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">{property.price.toLocaleString()} €</p>
                        </div>
                        <Link to={`/properties/${property.id}`} className="mt-2 text-blue-500 hover:underline text-sm">Vezi detalii</Link>
                    </div>
                    </div>
                </div>
                ))}
            </Slider>
            </div>
        ) : (
            <p className="text-center">Nu există proprietăți recomandate momentan.</p>
        )}
        </section>

  );
};

export default RecommendedProperties;

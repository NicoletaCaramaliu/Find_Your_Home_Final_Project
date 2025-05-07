import { Link } from "react-router-dom";

export default function AboutUsPage() {
    return (
        <section className="flex min-h-screen py-24 relative w-full items-center justify-center">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-8 items-center">
                    
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                                Găsește-ți locuința perfectă cu FindYourHome
                            </h2>
                            <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                                Cu <strong>FindYourHome</strong>, transformăm căutarea unei locuințe într-o experiență simplă și eficientă. 
                                Fie că îți dorești să <strong>închiriezi</strong> sau să <strong>cumperi</strong> o garsonieră sau un apartament, 
                                platforma noastră îți oferă acces la cele mai bune oferte de pe piață.
                            </p>
                            <ul className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center list-disc pl-5">
                                <li><strong>Oferte actualizate constant</strong> – Găsește cele mai noi anunțuri pentru locuințe în orașul tău.</li>
                                <li><strong>Proces rapid și sigur</strong> – Filtrează, compară și contactează direct proprietarii sau agențiile.</li>
                                <li><strong>Ghid complet pentru cumpărători și chiriași</strong> – Sfaturi utile pentru o alegere inspirată.</li>
                                <li><strong>Mereu în contact cu proprietarul</strong> – Comunică oricând cu proprietarul apartamentului în care locuiești.</li>
                            </ul>
                            <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                                Autentifică-te pentru a vedea mai multe oferte.
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="sm:w-fit w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-md text-white text-sm font-medium text-center"
                        >
                            Vezi Ofertele
                        </Link>
                    </div>

                    <img
                        className="lg:mx-0 mx-auto h-full rounded-3xl object-cover"
                        src="https://thumbs.dreamstime.com/b/laptop-real-estate-digital-interface-app-to-find-apartments-houses-buy-rent-website-online-searching-buying-selling-346205394.jpg"
                        alt="FindYourHome Image"
                    />
                </div>
            </div>
        </section>
    );
}
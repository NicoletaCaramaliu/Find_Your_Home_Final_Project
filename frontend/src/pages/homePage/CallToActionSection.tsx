import { Link } from 'react-router-dom';

const CallToActionSection = () => (
  <section className="py-12 bg-blue-600 text-white text-center">
    <h2 className="text-3xl font-bold mb-4">📢 Gata să-ți găsești locuința visurilor?</h2>
    <p className="mb-6">Vezi toate ofertele noastre și începe căutarea perfectă.</p>
    <Link to="/properties" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
      Vezi proprietățile
    </Link>
  </section>
);

export default CallToActionSection;

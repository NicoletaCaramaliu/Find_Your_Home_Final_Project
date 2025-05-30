import { Link } from 'react-router-dom';

const Footer = () => (
  <footer id="contact" className="bg-gray-800 text-white py-6 text-center">
    <p className="mb-2 font-semibold">© 2025 FindYourHome</p>
    <p className="text-sm">Toate drepturile rezervate | <Link to="/contact" className="underline hover:text-blue-300">Contact</Link></p>
  </footer>
);

export default Footer;

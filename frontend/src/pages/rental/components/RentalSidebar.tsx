interface RentalSidebarProps {
  rentalId: string; 
}

const RentalSidebar: React.FC<RentalSidebarProps> = ({ rentalId }) => {
  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-gray-700 shadow-lg p-4 h-screen sticky top-0 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">ℹ️ Informații utile</h3>
      <ul className="space-y-2 text-sm">
        <li><strong>📅 Zi plată:</strong> 15 ale lunii</li>
        <li><strong>📞 Instalator:</strong> 0722 123 456</li>
        <li><strong>💡 Electrician:</strong> 0722 987 654</li>
        <li><strong>🔑 Contact proprietar:</strong> 0733 456 789</li>
        <li><strong>📄 Contract semnat:</strong> Da</li>
      </ul>
    </aside>
  );
};

export default RentalSidebar;







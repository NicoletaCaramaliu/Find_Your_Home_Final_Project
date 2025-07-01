const Sidebar = ({ onSelect }: { onSelect: (section: string) => void }) => {
  const sections = [
    { key: 'users', label: 'Utilizatori' },
    { key: 'properties', label: 'Proprietăți' },
    { key: 'reviews', label: 'Recenzii' },
    { key: 'testimonials', label: 'Testimoniale' },
    { key: 'questions', label: 'Întrebări frecvente' }
  ];

  return (
    <aside className="w-60 bg-blue-600 dark:bg-gray-800 text-white dark:text-gray-200 flex flex-col p-4">
      <h3 className="text-lg font-bold mb-4">Panou de administrare</h3>
      {sections.map((section) => (
        <button
          key={section.key}
          onClick={() => onSelect(section.key)}
          className="mb-2 text-left hover:bg-blue-700 dark:hover:bg-blue-800 px-2 py-1 rounded transition-colors"
        >
          {section.label}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;

import React from "react";
import MainNavBar from "../../components/MainNavBar";

const RentalCollaborationPage: React.FC = () => {
  const fakeRental = {
    property: {
      name: "Apartament Central",
      address: "Strada Exemplu 12, București",
    },
    startDate: "2024-06-01",
    endDate: "2024-12-01",
  };

  const fakeDocuments = [
    { name: "Contract.pdf", url: "#" },
    { name: "Buletin.jpg", url: "#" },
  ];

  const fakeTasks = [
    { id: 1, title: "Trimite buletin", completed: false },
    { id: 2, title: "Semnează contract", completed: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      <MainNavBar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-2">{fakeRental.property.name}</h2>
          <p>{fakeRental.property.address}</p>
          <p>Început: {new Date(fakeRental.startDate).toLocaleDateString()}</p>
          <p>Final: {new Date(fakeRental.endDate).toLocaleDateString()}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">📎 Documente partajate</h3>
            <ul className="mb-2 list-disc ml-5">
              {fakeDocuments.map((doc, idx) => (
                <li key={idx}>
                  <a href={doc.url} className="text-blue-500 underline">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
            <input type="file" multiple className="mb-2" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Încarcă
            </button>
          </section>

          <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">📝 Taskuri comune</h3>
            <ul className="space-y-2">
              {fakeTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center">
                  <span>{task.title}</span>
                  <input type="checkbox" checked={task.completed} readOnly />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="text-center mt-6">
          <button className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            🚪 Încheie închirierea
          </button>
        </section>
      </div>
    </div>
  );
};

export default RentalCollaborationPage;

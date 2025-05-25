import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api";
import MainNavBar from "../../components/MainNavBar";
import MiniChatWidget from "../../pages/conversations/MiniChatWidget"; 

const RentalCollaborationPage: React.FC = () => {
  const { rentalId } = useParams();
  const [rental, setRental] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [note, setNote] = useState<string>("");
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!rentalId) return;

    const fetchAll = async () => {
      try {
        const rentalRes = await api.get(`/rentals/${rentalId}`);
        const docsRes = await api.get(`/rentaldocuments/${rentalId}`);
        const tasksRes = await api.get(`/rentaltasks/${rentalId}`);
        const noteRes = await api.get(`/rentalnotes/${rentalId}`);

        setRental(rentalRes.data);
        setDocuments(docsRes.data);
        setTasks(tasksRes.data);
        setNote(noteRes.data || "");
      } catch (err) {
        console.error("Eroare la preluarea datelor de colaborare:", err);
      }
    };

    fetchAll();
  }, [rentalId]);

  const uploadDocuments = async () => {
    if (!fileInput || !rentalId) return;
    const formData = new FormData();
    Array.from(fileInput).forEach((file) => formData.append("files", file));

    try {
      await api.post(`/rentaldocuments/upload/${rentalId}`, formData);
      const updatedDocs = await api.get(`/rentaldocuments/${rentalId}`);
      setDocuments(updatedDocs.data);
    } catch (err) {
      console.error("Eroare la încărcarea documentelor:", err);
    }
  };

  const downloadDocument = async (docId: string, fileName: string) => {
    try {
      const response = await api.get(`/rentaldocuments/file/${docId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Eroare la descărcarea documentului:", err);
      alert("Nu ai permisiunea să descarci acest fișier.");
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      await api.post(`/rentaltasks/toggle/${taskId}`);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      console.error("Eroare la toggling task:", err);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !rentalId) return;

    try {
        const res = await api.post(`/rentaltasks/${rentalId}`, {
        title: newTaskTitle
        });
        setTasks((prev) => [...prev, res.data]);
        setNewTaskTitle("");
    } catch (err) {
        console.error("Eroare la adăugarea taskului:", err);
    }
  };

  const [noteSaved, setNoteSaved] = useState(false);

  const saveNote = async () => {
    try {
      await api.post(`/rentalnotes/${rentalId}`, { content: note });
      //alert("Notiță salvată cu succes!");
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 3000);
    } catch (err) {
      console.error("Eroare la salvarea notiței:", err);
    }
  };

  if (!rental) return <p className="p-4">Se încarcă închirierea...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      <MainNavBar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-2">{rental.property?.name}</h2>
          <p>{rental.property?.address}</p>
          <p>Început: {new Date(rental.startDate).toLocaleDateString()}</p>
          {rental.endDate && (
            <p>Final: {new Date(rental.endDate).toLocaleDateString()}</p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">📎 Documente partajate</h3>
            <ul className="mb-2 list-disc ml-5">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => downloadDocument(doc.id, doc.fileName)}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    {doc.fileName}
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="file"
              multiple
              onChange={(e) => setFileInput(e.target.files)}
              className="mb-2"
            />
            <button
              onClick={uploadDocuments}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Încarcă
            </button>
          </section>

          <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">📝 Taskuri comune</h3>
            <ul className="space-y-2 mb-4">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center">
                  <span>{task.title}</span>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                </li>
              ))}
            </ul>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Adaugă un task nou..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Adaugă
              </button>
            </div>
          </section>
        </div>

        <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">🗒️ Notițe comune</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={saveNote}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Salvează notița
          </button>
            {noteSaved && (
                <p className="text-green-500 mt-2">✔️Notița a fost salvată cu succes!</p>
            )}
        </section>

      </div>

      {rental?.conversationId && (
        <button
          onClick={() => navigate(`/chat/${rental.conversationId}`)}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          💬 Mergi la conversație
        </button>
      )}
    </div>
  );
};

export default RentalCollaborationPage;

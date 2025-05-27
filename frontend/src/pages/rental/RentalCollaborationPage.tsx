import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import MainNavBar from "../../components/MainNavBar";
import DocumentsSection from "./components/DocumentsSection";
import TasksSection from "./components/TasksSection";
import NotesSection from "./components/NotesSection";
import RentalSidebar from "./components/RentalSidebar";

const RentalCollaborationPage: React.FC = () => {
  const { rentalId } = useParams();
  const [rental, setRental] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [note, setNote] = useState<string>("");
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  const [noteSaved, setNoteSaved] = useState(false);
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
      const res = await api.post(`/rentaltasks/${rentalId}`, { title: newTaskTitle });
      setTasks((prev) => [...prev, res.data]);
      setNewTaskTitle("");
    } catch (err) {
      console.error("Eroare la adăugarea taskului:", err);
    }
  };

  const saveNote = async () => {
    try {
      await api.post(`/rentalnotes/${rentalId}`, { content: note });
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
      <div className="flex">
        <RentalSidebar rentalId={rentalId!} />
        <div className="flex-1 max-w-6xl mx-auto p-6 space-y-6">
            <section className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-2">{rental.property?.name}</h2>
                <p>{rental.property?.address}</p>
                <p>Început: {new Date(rental.startDate).toLocaleDateString()}</p>
                {rental.endDate && (
                <p>Final: {new Date(rental.endDate).toLocaleDateString()}</p>
                )}
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentsSection
                documents={documents}
                downloadDocument={downloadDocument}
                uploadDocuments={uploadDocuments}
                setFileInput={setFileInput}
                />
                <TasksSection
                tasks={tasks}
                toggleTask={toggleTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                addTask={addTask}
                />
            </div>
            <NotesSection
                note={note}
                setNote={setNote}
                saveNote={saveNote}
                noteSaved={noteSaved}
            />
            </div>
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

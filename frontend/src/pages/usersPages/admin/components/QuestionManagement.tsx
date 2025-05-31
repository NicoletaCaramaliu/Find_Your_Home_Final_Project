import React, { useEffect, useState } from 'react';
import api from '../../../../api';

interface Question {
  id: string;
  questionText: string;
  answerText: string;
  posted: boolean;
}

const QuestionManagement = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null); // 🔥 Adaugăm stare pentru confirmare

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    api.get('/Questions/getAllQuestions')
      .then(res => {
        setQuestions(res.data);
      })
      .catch(err => {
        console.error('Error:', err);
        setMessage('Eroare la încărcarea întrebărilor.');
      });
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      setMessage('Întrebarea nu poate fi goală.');
      return;
    }

    try {
      await api.post('/Questions/addQuestion', {
        questionText: newQuestion,
        answerText: newAnswer
      });
      setMessage('Întrebare adăugată cu succes!');
      setNewQuestion('');
      setNewAnswer('');
      fetchQuestions();
    } catch (err) {
      console.error(err);
      setMessage('Eroare la adăugare.');
    }
  };

  const handlePost = async (id: string) => {
    try {
      await api.patch(`/Questions/postQuestion?questionId=${id}`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      setMessage('Eroare la postare.');
    }
  };

  const handleUnpost = async (id: string) => {
    try {
      await api.patch(`/Questions/unpostQuestion?questionId=${id}`);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      setMessage('Eroare la anulare postare.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/Questions/deleteQuestion/${id}`);
      setConfirmDeleteId(null);  // Închidem confirmarea
      fetchQuestions();
    } catch (err) {
      console.error(err);
      setMessage('Eroare la ștergere.');
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Întrebări frecvente</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Scrie întrebarea..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 dark:bg-gray-700 dark:text-white"
        />
        <textarea
          placeholder="Scrie răspunsul..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adaugă întrebare
        </button>
        {message && <p className="mt-2 text-green-600 dark:text-green-400">{message}</p>}
      </div>

      {questions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Nu există întrebări disponibile.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map(q => (
            <li key={q.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow flex flex-col gap-2 relative">
              <p><strong>Întrebare:</strong> {q.questionText}</p>
              <p><strong>Răspuns:</strong> {q.answerText}</p>
              <div className="flex gap-2">
                {q.posted ? (
                  <button onClick={() => handleUnpost(q.id)} className="text-yellow-600 hover:text-yellow-800 text-sm">Anulează postarea</button>
                ) : (
                  <button onClick={() => handlePost(q.id)} className="text-green-600 hover:text-green-800 text-sm">Postează</button>
                )}
                <button onClick={() => setConfirmDeleteId(q.id)} className="text-red-600 hover:text-red-800 text-sm">Șterge</button>
              </div>

              {/* 🔥 Afișăm confirmare pe ecran */}
              {confirmDeleteId === q.id && (
                <div className="absolute top-2 left-2 right-2 bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 p-2 rounded shadow flex flex-col gap-2">
                  <p>Ești sigur că vrei să ștergi?</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(q.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Da</button>
                    <button onClick={() => setConfirmDeleteId(null)} className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-2 py-1 rounded text-xs hover:bg-gray-400">Nu</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionManagement;

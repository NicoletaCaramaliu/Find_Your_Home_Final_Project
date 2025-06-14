
interface Props {
  note: string;
  setNote: (note: string) => void;
  saveNote: () => void;
  noteSaved: boolean;
}

const NotesSection: React.FC<Props> = ({ note, setNote, saveNote, noteSaved }) => (
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
    {noteSaved && <p className="text-green-500 mt-2">✔️Notița a fost salvată cu succes!</p>}
  </section>
);

export default NotesSection;
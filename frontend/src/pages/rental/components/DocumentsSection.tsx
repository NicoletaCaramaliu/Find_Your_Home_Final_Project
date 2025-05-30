interface Document {
  id: string;
  fileName: string;
}

interface Props {
  documents: Document[];
  downloadDocument: (docId: string, fileName: string) => void;
  uploadDocuments: () => void;
  setFileInput: (files: FileList | null) => void;
}

const DocumentsSection: React.FC<Props> = ({ documents, downloadDocument, uploadDocuments, setFileInput }) => (
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
    <input type="file" multiple onChange={(e) => setFileInput(e.target.files)} className="mb-2" />
    <button onClick={uploadDocuments} className="px-4 py-2 bg-blue-600 text-white rounded">Încarcă</button>
  </section>
);

export default DocumentsSection;
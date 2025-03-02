export function Button({ type, className, children }: { type?: "button" | "submit"; className?: string; children: React.ReactNode }) {
  return (
    <button
      type={type}
      className={`bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
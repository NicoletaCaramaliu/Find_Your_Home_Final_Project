export function Button({ type, className, children }: { type?: "button" | "submit"; className?: string; children: React.ReactNode }) {
    return (
      <button
        type={type}
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${className}`}
      >
        {children}
      </button>
    );
  }
  
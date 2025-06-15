/** @jsxImportSource react */

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"bg-blue-300 dark:bg-gray-800 shadow-md p-6 rounded-lg w-full max-w-md" + (className ? " " + className : "")}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"p-4 flex flex-col items-center gap-4 text-gray-900 dark:text-white " + (className || "")}>
      {children}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={`bg-white shadow-md p-6 rounded-lg w-full max-w-md ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`p-4 flex flex-col items-center gap-4 ${className}`}>{children}</div>;
  }
  
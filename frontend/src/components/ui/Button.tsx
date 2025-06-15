import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export function Button({ className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg 
                  hover:bg-blue-600 dark:hover:bg-blue-700 transition 
                  disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

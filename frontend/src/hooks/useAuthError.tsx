import { useState, useCallback } from "react";

export function useAuthError() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const setAuthError = useCallback((error: any) => {
    if (error.response && error.response.data?.message) {
      setErrorMessage(error.response.data?.message);
    } else {
      setErrorMessage("A apărut o eroare necunoscută. Te rugăm să încerci mai târziu.");
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setErrorMessage("");
  }, []);

  return { errorMessage, setAuthError, clearAuthError };
}

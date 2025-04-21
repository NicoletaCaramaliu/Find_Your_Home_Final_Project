const errorTranslations: Record<string, string> = {
    USER_ALREADY_EXISTS: "Utilizatorul există deja.",
    INVALID_CREDENTIALS: "Email sau parolă incorecte.",
    USER_NOT_FOUND: "Utilizatorul nu a fost găsit.",
    REFRESH_TOKEN_NOT_FOUND: "Tokenul de reîmprospătare lipsește.",
    INVALID_REFRESH_TOKEN: "Tokenul este invalid sau a expirat.",
    EMAIL_NOT_FOUND: "Nu există niciun cont asociat acestui email.",
    RESET_TOKEN_INVALID: "Linkul de resetare este invalid sau expirat.",
    PASSWORD_RESET_SUCCESS: "Parola a fost resetată cu succes.",
    PASSWORD_CHANGED_SUCCESSFULLY: "Parola a fost schimbată cu succes.",
    USER_DELETED_SUCCESSFULLY: "Contul a fost șters.",
    LOGOUT_SUCCESS: "Ai fost delogat cu succes.",
  };
  
  export const parseError = (error: any): string => {
    const errorCode =
      error?.response?.data?.errorCode || error?.response?.data?.message;
  
    return errorTranslations[errorCode] || "A apărut o eroare necunoscută.";
  };
  
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
  OLD_PASSWORD_INVALID: "Parola veche este incorectă.",
  NO_USERS_FOUND: "Nu există utilizatori în baza de date.",
  USERNAME_ALREADY_EXISTS: "Numele de utilizator există deja.",

  // Booking
  TIME_SLOT_ALREADY_BOOKED: "Intervalul de timp selectat este deja rezervat.",
  TIME_SLOT_NOT_AVAILABLE: "Intervalul de timp selectat nu mai este disponibil.",
  PROPERTY_NOT_FOUND: "Proprietatea nu a fost găsită.",
  CANNOT_BOOK_OWN_PROPERTY: "Nu poți rezerva propria ta proprietate.",
  NO_REVIEW_PERMISSION: "Poți lăsa o recenzie doar dacă ai avut o rezervare cu acest utilizator.",
  
 
  //Availability 
  SLOT_NOT_FOUND: "Perioada nu a fost găsită.",
  NOT_OWNER_OF_PROPERTY: "Nu ești proprietarul acestei proprietăți.",
  SLOT_OVERLAP_EXISTS: "Există deja o perioadă disponibilă care se suprapune.",
  INVALID_TIME_RANGE: "Ora de început trebuie să fie înainte de ora de sfârșit.",
  SLOT_DELETED_SUCCESSFULLY: "Slot șters cu succes!",
  CANNOT_DELETE_SLOT_WITH_BOOKINGS: "Nu poți șterge un slot care are rezervări existente.",
  NO_SLOTS_FOUND_FOR_PROPERTY: "Nu sunt adăugate perioade de vizită pentru această proprietate",
  CANNOT_BOOK_SLOT_WITH_LESS_THAN_12_HOURS: "Nu poți rezerva un slot cu mai puțin de 12 ore înainte.",

  // Testimonials
  CONTENT_EMPTY: "Conținutul nu poate fi gol.",
  ONE_TESTIMONIAL_PER_USER: "Poți adăuga doar un testimonial.",
  TESTIMONIAL_NOT_FOUND: "Testimonialul nu a fost găsit.",
  MAX_THREE_POSTED_TESTIMONIALS: "Poți adăuga doar 3 testimoniale.",
};

export const parseError = (error: any): string => {
  const errorCode =
    error?.response?.data?.errorCode || error?.response?.data?.message;

  return errorTranslations[errorCode] || "A apărut o eroare necunoscută.";
};

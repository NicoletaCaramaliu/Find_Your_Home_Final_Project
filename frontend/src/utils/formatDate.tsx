export const formatUtcToLocal = (
  utcDateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  },
  locale = "ro-RO"
): string => {
  try {
    const date = new Date(utcDateString); 
    if (isNaN(date.getTime())) return "Data invalidă";

    return date.toLocaleString(locale, {
      ...options,
      timeZone: "Europe/Bucharest", 
    });
  } catch (e) {
    return "Data invalidă";
  }
};

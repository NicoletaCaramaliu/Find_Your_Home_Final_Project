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
    const date = new Date(utcDateString.endsWith("Z") ? utcDateString : utcDateString + "Z");
    return date.toLocaleString(locale, options);
  } catch (e) {
    return "Data invalidă";
  }
};

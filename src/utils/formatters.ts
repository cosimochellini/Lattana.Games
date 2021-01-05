const defaultLocale = "it-IT" as const;

const dayFormat = new Intl.DateTimeFormat(defaultLocale, {
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormat = new Intl.DateTimeFormat(defaultLocale, {
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const longNumberFormatter = (n: number) =>
  n.toLocaleString(defaultLocale, {
    minimumIntegerDigits: 4,
    useGrouping: false,
  });

export const percentageFormatter = (n: number) => (n * 100).toFixed(0);

export const dateFormatter = (date: string | Date | null) => {
  if (!date) return "";

  if (typeof date === "string") return dateFormat.format(new Date(date));

  return dateFormat.format(date);
};

export const dayFormatter = (date: string | Date | null) => {
  if (!date) return "";

  if (typeof date === "string") return dayFormat.format(new Date(date));

  return dayFormat.format(date);
};

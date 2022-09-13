import { DateTimeFormatOptions } from "next-intl";

export function parseDateFromIso(date: string, format?: "short" | undefined) {
  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: format === "short" ? "numeric" : "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("no-NB", options);
}

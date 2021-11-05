import { Formats } from "next-intl";

export const timeZone = "Europe/Oslo";
export const formats: Partial<Formats> = {
  dateTime: {
    kort: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
    numerisk: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  },
};

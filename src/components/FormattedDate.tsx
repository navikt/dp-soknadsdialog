import React from "react";
import { DateTimeFormatOptions } from "next-intl";
import { useRouter } from "next/router";

interface IProps {
  date: string;
  short?: boolean;
}

export function FormattedDate(props: IProps) {
  const router = useRouter();

  const locale = router.locale === "en" ? "en-GB" : "no-NO";

  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: props.short ? "2-digit" : "long",
    day: props.short ? "2-digit" : "numeric",
  };

  const formattedDate = new Date(props.date).toLocaleDateString(locale, options);

  return <>{formattedDate}</>;
}

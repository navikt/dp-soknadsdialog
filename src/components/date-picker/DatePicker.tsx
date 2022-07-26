import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isValid } from "date-fns";
import { TextField } from "@navikt/ds-react";
import { useRouter } from "next/router";
import nbLocale from "date-fns/locale/nb";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  label: string;
  placeholder?: string;
  onChange: (value: Date) => void;
  disabled?: boolean;
  value?: string;
}

export function DatePicker(props: DatePickerProps) {
  const { locale } = useRouter();
  const [dateLocale, setDateLocale] = useState(nbLocale);
  const [date, setDate] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isValidDate, setIsValidDate] = useState(true);

  useEffect(() => {
    const importLocaleFile = async () => {
      const localeToSet = await import(
        /* webpackMode: "lazy", webpackChunkName: "df-[index]", webpackExclude: /_lib/ */
        `date-fns/locale/${locale === "en" ? "en-GB" : locale}/index.js`
      );
      setDateLocale(localeToSet.default);
    };

    if (dateLocale.code !== locale) {
      importLocaleFile();
    }
  }, [locale, dateLocale.code]);

  function onDateChange(value: Date) {
    if (isValid(value)) {
      setIsValidDate(true);
      setDate(value);
      props.onChange(value);
      setIsDatePickerOpen(false);
    } else {
      setIsValidDate(false);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <TextField
          label={props.label}
          type={"text"}
          placeholder={format(new Date(), "dd.MM.yyyy")}
          value={date ? format(date, "dd.MM.yyyy") : ""}
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          onChange={() => undefined}
          readOnly
          error={!isValidDate ? "Ugyldig dato" : null}
        />

        {isDatePickerOpen && (
          <DayPicker
            locale={dateLocale}
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={(_, selectedDay) => onDateChange(selectedDay)}
          />
        )}
      </div>
    </>
  );
}

import React from "react";
import styles from "./Dokumentkrav.module.css";
import { TextField } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

interface IProps {
  begrunnelse: string | undefined;
  setBegrunnelse: (value: string) => void;
  validationError?: boolean;
}

export function DokumentkravBegrunnelse({ begrunnelse, setBegrunnelse, validationError }: IProps) {
  const { getAppTekst } = useSanity();
  const debouncedBegrunnelse = useDebouncedCallback(setBegrunnelse, 500);

  return (
    <div className={styles.dokumentkravBegrunnelse}>
      <TextField
        type="text"
        size="medium"
        defaultValue={begrunnelse}
        label={getAppTekst("dokumentkrav.sender.ikke.naa.begrunnelse")}
        onChange={(event) => debouncedBegrunnelse(event.currentTarget.value)}
        error={
          !begrunnelse &&
          validationError &&
          getAppTekst("dokumentkrav.feilmelding.trenger.begrunnelse")
        }
      />
    </div>
  );
}

import React from "react";
import styles from "./Dokumentkrav.module.css";
import { TextField } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

interface IProps {
  begrunnelse: string | undefined;
  setBegrunnelse: (value: string) => void;
}

export function DokumentkravBegrunnelse({ begrunnelse, setBegrunnelse }: IProps) {
  const { getAppTekst } = useSanity();
  const debouncedBegrunnelse = useDebouncedCallback(setBegrunnelse, 500);

  return (
    <div className={styles.dokumentkravBegrunnelse}>
      <TextField
        type="text"
        size="medium"
        defaultValue={begrunnelse}
        label={getAppTekst("dokumentkrav.sender.ikke.begrunnelse")}
        onChange={(event) => debouncedBegrunnelse(event.currentTarget.value)}
      />
    </div>
  );
}

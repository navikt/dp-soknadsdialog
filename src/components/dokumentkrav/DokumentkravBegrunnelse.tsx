import React, { useEffect, useState } from "react";
import styles from "./Dokumentkrav.module.css";
import { TextField } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

interface IProps {
  begrunnelse: string | undefined;
  onChange: (value: string) => void;
}

export function DokumentkravBegrunnelse(props: IProps) {
  const { getAppTekst } = useSanity();

  const [begrunnelse, setBegrunnelse] = useState(props.begrunnelse || "");
  const debouncedChange = useDebouncedCallback(setBegrunnelse, 500);

  useEffect(() => {
    if (begrunnelse && begrunnelse !== props.begrunnelse) {
      props.onChange(begrunnelse);
    }
  }, [begrunnelse]);

  return (
    <div className={styles.dokumentkravBegrunnelse}>
      <TextField
        defaultValue={begrunnelse}
        label={getAppTekst("dokumentkrav.sender.ikke.begrunnelse")}
        size="medium"
        type="text"
        onChange={(event) => debouncedChange(event.currentTarget.value)}
      />
    </div>
  );
}

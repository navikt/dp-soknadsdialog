import React, { useEffect } from "react";
import styles from "./Dokumentkrav.module.css";
import { TextField } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../hooks/useFirstRender";
import { PortableText } from "@portabletext/react";

interface IProps {
  begrunnelse: string | undefined;
  svar: string | undefined;
  setBegrunnelse: (value: string) => void;
  validationError?: boolean;
}

export function DokumentkravBegrunnelse({
  begrunnelse,
  svar,
  setBegrunnelse,
  validationError,
}: IProps) {
  const { getAppTekst, getDokumentkravTextById } = useSanity();
  const debouncedBegrunnelse = useDebouncedCallback(setBegrunnelse, 500);
  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    // Reset begrunnelse if user selects new answer
    // (a trade off necessary since we're using one field to represent four different begrunnelse)
    if (begrunnelse && begrunnelse !== "") {
      setBegrunnelse("");
    }
  }, [svar]);

  const textId = `${svar}.begrunnelse`;
  const begrunnelseText = getDokumentkravTextById(textId);

  return (
    <div className={styles.dokumentkravBegrunnelse}>
      <TextField
        type="text"
        size="medium"
        defaultValue={begrunnelse}
        label={begrunnelseText ? begrunnelseText.text : textId}
        description={
          begrunnelseText?.description && <PortableText value={begrunnelseText.description} />
        }
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

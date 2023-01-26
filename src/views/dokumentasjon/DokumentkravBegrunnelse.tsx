import React, { useEffect, useState } from "react";
import { TextField } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../hooks/useFirstRender";
import { PortableText } from "@portabletext/react";
import { usePrevious } from "../../hooks/usePrevious";
import styles from "./Dokumentasjon.module.css";

interface IProps {
  svar?: string;
  begrunnelse?: string;
  setBegrunnelse: (value: string) => void;
  validationError?: boolean;
}

export function DokumentkravBegrunnelse(props: IProps) {
  const { begrunnelse, svar, setBegrunnelse, validationError } = props;
  const isFirstRender = useFirstRender();
  const previousAnswer = usePrevious(svar);
  const { getAppText, getDokumentkravTextById } = useSanity();
  const [value, setValue] = useState(begrunnelse || "");
  const [debouncedText, setDebouncedText] = useState<string>(value);
  const debouncedChange = useDebouncedCallback<string>(setDebouncedText, 500);

  // Used to reset begrunnelse when changing answer on dokumentkrav
  useEffect(() => {
    if (previousAnswer && previousAnswer !== svar) {
      setValue("");
    }
  }, [svar]);

  useEffect(() => {
    if (!isFirstRender && debouncedText !== begrunnelse) {
      setBegrunnelse(debouncedText);
    }
  }, [debouncedText]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setValue(value);
    debouncedChange(value);
  }

  const textId = `faktum.dokument.${svar}.begrunnelse`;
  const begrunnelseText = getDokumentkravTextById(textId);

  return (
    <div className={styles.dokumentkravBegrunnelse}>
      <TextField
        type="text"
        size="medium"
        value={value}
        label={begrunnelseText?.title ? begrunnelseText.title : textId}
        description={
          begrunnelseText?.description && <PortableText value={begrunnelseText.description} />
        }
        onChange={onChange}
        error={validationError && getAppText("dokumentkrav.feilmelding.trenger.begrunnelse")}
      />
    </div>
  );
}

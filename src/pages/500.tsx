import React, { useEffect, useState } from "react";
import { Alert, Heading, BodyShort, BodyLong } from "@navikt/ds-react";
import { useRouter } from "next/router";
import styles from "./_error.module.css";
import { sanityClient } from "../../sanity-client";
import { ISanityTexts } from "../types/sanity.types";
import { allTextsQuery } from "../sanity/groq-queries";
import * as SentryLogger from "../sentry.logger";

const fallbackErrorText = {
  title: "Vi har tekniske problemer akkurat nå",
  details:
    " Beklager, vi får ikke kontakt med systemene våre. Svarene dine er lagret og du kan prøve igjen om litt.",
};

export default function Error500() {
  const { locale } = useRouter();
  const [errorMessage, setErrorMessage] = useState(fallbackErrorText);

  useEffect(() => {
    getSanityText();
    const localStorageErrorsCount = localStorage.getItem("errorsCount");

    if (localStorageErrorsCount) {
      localStorage.removeItem("errorsCount");
    }
  }, []);

  async function getSanityText() {
    try {
      const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
        baseLang: "nb",
        lang: locale,
      });

      const title = getAppTekst("teknisk-feil.helside.tittel", sanityTexts);
      const details = getAppTekst("teknisk-feil.helside.detaljer", sanityTexts);

      setErrorMessage({ title, details });
    } catch (err) {
      setErrorMessage(fallbackErrorText);
    }
  }

  function getAppTekst(textId: string, sanityText: ISanityTexts): string {
    const text =
      sanityText?.apptekster.find((apptekst) => apptekst.textId === textId)?.valueText || textId;
    if (!text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  return (
    <Alert variant="error">
      <Heading size={"medium"} className={styles.error}>
        {errorMessage.title}
      </Heading>
      <BodyLong>{errorMessage.details}</BodyLong>
      <BodyShort className={styles.statusCode}>Statuskode 500</BodyShort>
    </Alert>
  );
}

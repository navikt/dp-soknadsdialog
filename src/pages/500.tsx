import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClient } from "../../sanity-client";
import { ErrorPageContent } from "../components/error-page-content/errorPageContent";
import { allTextsQuery } from "../sanity/groq-queries";
import * as SentryLogger from "../sentry.logger";
import { ISanityTexts } from "../types/sanity.types";

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

  return <ErrorPageContent title={errorMessage.title} details={errorMessage.details} />;
}

import React from "react";
import NextApp, { AppContext, AppProps } from "next/app";
import styles from "./_app.module.css";
import "../index.css";
import "../variables.css";
import { useRouter } from "next/router";
import { fetcher } from "../api.utils";
import { SWRConfig } from "swr";
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import ErrorBoundary from "../components/error-boundary/ErrorBoundary";
import Cookies from "js-cookie";
import { SanityProvider } from "../context/sanity-context";
import { sanityClient } from "../../sanity-client";
import { ISanityTexts } from "../types/sanity.types";
import { allTextsQuery } from "../sanity/groq-queries";
import ErrorPage from "./_error";

type AppPropsSanityTexts = AppProps & {
  sanityTexts: ISanityTexts;
};

export default function App({ Component, pageProps, sanityTexts }: AppPropsSanityTexts) {
  const router = useRouter();

  onLanguageSelect(({ locale }) => {
    Cookies.set("NEXT_LOCALE", locale, { path: router.basePath, expires: 30 });
    router.push(router.asPath, router.asPath, { locale });
  });

  if (!sanityTexts.apptekster) {
    return (
      <ErrorPage
        title="Det har skjedd en teknisk feil"
        details="Beklager, vi mistet kontakten med systemene våre."
      />
    );
  }

  return (
    <ErrorBoundary>
      <SWRConfig value={{ fetcher }}>
        <SanityProvider initialState={sanityTexts}>
          <div className={styles.app}>
            <Component {...pageProps} />
          </div>
        </SanityProvider>
      </SWRConfig>
    </ErrorBoundary>
  );
}

App.getInitialProps = async function getInitialProps(context: AppContext) {
  const { locale, defaultLocale } = context.router;

  if (!locale && !defaultLocale) {
    // Unngår at "alle" feil framstår som manglende locale
    return NextApp.getInitialProps(context);
  }

  const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });
  return {
    ...(await NextApp.getInitialProps(context)),
    sanityTexts,
  };
};

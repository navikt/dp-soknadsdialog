import React from "react";
import NextApp, { AppContext, AppProps } from "next/app";
import styles from "./_app.module.css";
import "../index.css";
import "../variables.css";
import SoknadHeader from "../components/SoknadHeader";
import { useRouter } from "next/router";
import { fetcher } from "../api.utils";
import { SWRConfig } from "swr";
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import ErrorBoundary from "../components/error-boundary/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const renderHeader = () => {
    if (router.pathname === "/") return <></>;
    return <SoknadHeader />;
  };

  onLanguageSelect(({ locale }) => router.push(router.asPath, router.asPath, { locale }));

  return (
    <ErrorBoundary>
      <SWRConfig value={{ fetcher }}>
        {renderHeader()}
        <div className={styles.app}>
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </ErrorBoundary>
  );
}

App.getInitialProps = async function getInitialProps(context: AppContext) {
  return NextApp.getInitialProps(context);
};

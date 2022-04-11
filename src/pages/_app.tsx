import React from "react";
import NextApp, { AppContext, AppProps } from "next/app";
import styles from "./_app.module.css";
import "../index.css";
import "../variables.css";
import SoknadHeader from "../components/SoknadHeader";
import { useRouter } from "next/router";
import { fetcher } from "../api.utils";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const renderHeader = () => {
    if (router.pathname === "/") return <></>;
    return <SoknadHeader />;
  };

  return (
    <SWRConfig value={{ fetcher }}>
      {renderHeader()}
      <div className={styles.app}>
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

App.getInitialProps = async function getInitialProps(context: AppContext) {
  return NextApp.getInitialProps(context);
};

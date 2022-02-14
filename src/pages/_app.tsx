import React from "react";
import { AppProps } from "next/app";
import { store } from "../store";
import { Provider } from "react-redux";
import styles from "./_app.module.css";
import "../index.css";
import SoknadHeader from "../components/SoknadHeader";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const renderHeader = () => {
    if (router.pathname === "/") return <></>;
    return <SoknadHeader />;
  };

  return (
    <Provider store={store}>
      <div className={styles.app}>
        {renderHeader()}
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

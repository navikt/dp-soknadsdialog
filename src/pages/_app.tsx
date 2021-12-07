import "@navikt/ds-css";
import { AppProps } from "next/app";
import "../styles/global.css";
import { store } from "../store";
import { Provider } from "react-redux";
import styles from "./_app.module.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className={styles.app}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

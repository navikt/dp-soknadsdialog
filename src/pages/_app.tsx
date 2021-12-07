import { AppProps } from "next/app";
import { store } from "../store";
import { Provider } from "react-redux";
import styles from "./_app.module.css";
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className={styles.app}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

import "@navikt/ds-css";
import {AppProps} from "next/app";
import "../styles.css";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  import("../lib/mocks/browser").then(({worker}) =>
    worker().start({
      serviceWorker: {
        url: `/mockServiceWorker.js`,
      },
    })
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app">
      <Component {...pageProps} />

      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 100%;
          min-height: 20rem;
          margin: auto;
          padding: 0.5rem 0.5rem 7.5rem 0.5rem;
        }
      `}</style>
    </div>
  );
}

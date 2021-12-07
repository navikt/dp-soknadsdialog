import { AppProps } from "next/app";
import "../styles/global.css";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  import("../../__mocks__/browser").then(({ worker }) =>
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
    </div>
  );
}

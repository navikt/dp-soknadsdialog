import "./_app.less";
import "nav-frontend-typografi-style/src/index.less";

export default function App({ Component, pageProps }) {
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

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

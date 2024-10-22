import {
  DecoratorEnvProps,
  DecoratorFetchProps,
  DecoratorComponentsReact,
  fetchDecoratorReact,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import { logger } from "@navikt/next-logger";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

const dekoratorEnv = (process.env.DEKORATOR_ENV || "localhost") as DecoratorEnvProps["env"];

const decoratorProps: DecoratorFetchProps = {
  env: dekoratorEnv,
  localUrl: "https://dekoratoren.ekstern.dev.nav.no",
  params: {
    chatbot: false,
    simple: true,
    context: "privatperson",
    redirectToApp: true,
    level: "Level4",
    language: "nb",
  },
};

export default class MyDocument extends Document<DecoratorComponentsReact> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);
    const language = locale || "nb";

    const Dekorator: DecoratorComponentsReact = await fetchDecoratorReact({
      ...decoratorProps,
    }).catch((err) => {
      logger.error(err);
      const empty = () => <></>;
      return {
        Footer: empty,
        Header: empty,
        Scripts: empty,
        HeadAssets: empty,
      };
    });

    return {
      ...initialProps,
      ...Dekorator,
      locale: language,
    };
  }

  render(): JSX.Element {
    const { Scripts, Header, Footer, locale, HeadAssets } = this.props;
    return (
      <Html lang={locale}>
        <Head>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon/favicon-16x16.png`}
          />
          <link
            rel="shortcut icon"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon/favicon.ico`}
          />
          <link
            rel="preload"
            href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <HeadAssets />
        </Head>
        <body>
          <Scripts />
          <Header />
          <Main />
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}

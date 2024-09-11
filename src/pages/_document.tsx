import {
  DecoratorComponents,
  DecoratorEnvProps,
  DecoratorFetchProps,
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
    enforceLogin: false,
    redirectToApp: true,
    level: "Level4",
    language: "nb",
  },
};

export default class MyDocument extends Document<DecoratorComponents> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);
    const language = locale || "nb";

    const Dekorator: DecoratorComponents = await fetchDecoratorReact({
      ...decoratorProps,
    }).catch((err) => {
      logger.error(err);
      const empty = () => <></>;
      return {
        Footer: empty,
        Header: empty,
        Scripts: empty,
        Styles: empty,
      };
    });

    return {
      ...initialProps,
      ...Dekorator,
      locale: language,
    };
  }

  render(): JSX.Element {
    const { Styles, Scripts, Header, Footer, locale } = this.props;
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
          <Styles />
          <link
            rel="preload"
            href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
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

import React from "react";

import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import {
  Components as DecoratorComponents,
  fetchDecoratorReact,
  Locale,
  Props as DecoratorProps,
  Env,
} from "@navikt/nav-dekoratoren-moduler/ssr";

const dekoratorEnv = process.env.DEKORATOR_ENV as Exclude<Env, "localhost">;

const decoratorProps: DecoratorProps = {
  env: dekoratorEnv ?? "prod",
  chatbot: false,
  simple: true,
  context: "privatperson",
  enforceLogin: false,
  redirectToApp: true,
  level: "Level4",
  utloggingsvarsel: true,
};

export default class MyDocument extends Document<DecoratorComponents> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);
    const language = (locale as Locale) === undefined ? "nb" : (locale as Locale);

    const Dekorator: DecoratorComponents = await fetchDecoratorReact({
      ...decoratorProps,
      language: language,
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
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
          <Styles />
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

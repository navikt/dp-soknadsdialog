import React from "react";
import * as Sentry from "@sentry/browser";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import {
  Components as DecoratorComponents,
  Env,
  fetchDecoratorReact,
  Locale,
  Props as DecoratorProps,
} from "@navikt/nav-dekoratoren-moduler/ssr";

const dekoratorEnv = process.env.DEKORATOR_ENV as Exclude<Env, "localhost">;

const supportedLocales = ["nb", "en"];
const availableLanguages = supportedLocales.map((l) => ({
  locale: l,
  url: "https://www.nav.no/dagpenger/soknad/" + l,
  handleInApp: true,
})) as DecoratorProps["availableLanguages"];

const decoratorProps: DecoratorProps = {
  env: dekoratorEnv ?? "prod",
  chatbot: false,
  simple: true,
  context: "privatperson",
  enforceLogin: false,
  redirectToApp: true,
  level: "Level4",
  utloggingsvarsel: true,
  availableLanguages,
};

export default class MyDocument extends Document<DecoratorComponents> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);
    const language = locale === undefined ? "nb" : (locale as Locale);
    Sentry.setContext("culture", { locale: language });

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

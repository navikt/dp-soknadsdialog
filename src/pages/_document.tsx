import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import {
  Components as DecoratorComponents,
  ENV,
  fetchDecoratorReact,
  Props as DecoratorProps,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import { availableLocales } from "../lib/i18n/availableLocales";

const dekoratorEnv = process.env.DEKORATOR_ENV as Exclude<ENV, "localhost">;

const availableLanguages = availableLocales.map((l) => ({
  locale: l,
  url: "https://www.nav.no/dagpenger/" + l,
  handleInApp: true,
}));

const dekoratorProps: DecoratorProps = {
  env: dekoratorEnv ?? "prod",
  simple: true,
  context: "privatperson",
  availableLanguages,
  enforceLogin: process.env.NODE_ENV === "production",
  redirectToApp: true,
  level: "Level4",
  utloggingsvarsel: true,
};

export default class MyDocument extends Document<DecoratorComponents> {
  static async getInitialProps(ctx: DocumentContext) {
    const { locale } = ctx;
    const initialProps = await Document.getInitialProps(ctx);

    const Dekorator: DecoratorComponents = await fetchDecoratorReact({
      ...dekoratorProps,
      language: locale as any,
    }).catch((err) => {
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
      locale,
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

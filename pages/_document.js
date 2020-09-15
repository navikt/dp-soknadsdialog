import Document, { Html, Head, Main, NextScript } from "next/document";
import getDekoratøren from "../components/dekoratøren";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const dekoratøren = await getDekoratøren();

    return { ...initialProps, ...dekoratøren };
  }

  render() {
    const { Styles, Scripts, Header, Footer } = this.props;

    return (
      <Html>
        <Head /> {/* Head må først inn, så kan neste blokk inserte elementer */}
        <Head>
          {Styles}
          {Scripts}
        </Head>
        <body>
          {Header}
          <Main />
          {Footer}
          <NextScript />
        </body>
      </Html>
    );
  }
}

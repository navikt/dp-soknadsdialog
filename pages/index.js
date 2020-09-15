import Head from "next/head";
import Link from "next/link";
import HomeIkon from "../assets/svg/home.svg";
import Panel from "nav-frontend-paneler";
import Lenkepanel from "nav-frontend-lenkepanel";
import { Knapp } from "nav-frontend-knapper";
import {
  Normaltekst,
  Sidetittel,
  Ingress,
  Undertittel,
} from "nav-frontend-typografi";

export default function Home(props) {
  return (
    <div className="root">
      <Head>
        <title>Dagpengre!</title>
      </Head>

      <section>
        <div className="fo">
          <HomeIkon style={{ height: "20px" }} />
          <Sidetittel>Hola!</Sidetittel>
          <Ingress>Nå tester vi quiz</Ingress>
        </div>
      </section>

      <main>
        <div className="boxes">
          <Link href="/quiz">
            <Lenkepanel className="half" href="/quiz" border>
              <Undertittel>Ta en quiz om dagpenger</Undertittel>
              <Normaltekst>Kul link som loader instantly</Normaltekst>
            </Lenkepanel>
          </Link>

          <Link href="/quiz">
            <Lenkepanel className="half" href="/quiz" border>
              <Undertittel>Finn ut hva du har krav på</Undertittel>
              <Normaltekst>Kul link som gir mad speeds</Normaltekst>
            </Lenkepanel>
          </Link>
        </div>
        <Normaltekst>PartyTime</Normaltekst>
        <Link href="/quiz">
          <Knapp>
            <a>Ta en quiz!</a>
          </Knapp>
        </Link>
      </main>

      <style jsx>{`
        .root {
          max-width: 100%;
          display: flex;
          flex-direction: column;
          margin: auto;
          width: 1000px;
          margin: 0 0.5rem 0 0.5rem;
        }

        .boxes {
          display: flex;
          flex-direction: row;
          flex-wrap: row;
          width: 100%;
        }

        .root :global(.half:not(:nth-child(2n))) {
          margin-right: 1rem;
        }
        .root :global(.half) {
          display: flex;
          flex-direction: row;
          padding: 1rem;
          flex-grow: 1;
          flex-shrink: 0;
          max-width: calc(50% - 0.5rem);
        }

        section {
          justify-content: center;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

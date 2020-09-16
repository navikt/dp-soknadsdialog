import Head from "next/head";
import Link from "next/link";
import HomeIkon from "../assets/svg/home.svg";
import Lenkepanel from "nav-frontend-lenkepanel";
import Stegindikator from "nav-frontend-stegindikator";
import { Knapp, Flatknapp } from "nav-frontend-knapper";
import {
  Normaltekst,
  Sidetittel,
  Ingress,
  Undertittel,
} from "nav-frontend-typografi";

import Søknad from "../components/søknad"

export default function Home(props) {
  return (
    <div className="root">
      <Head>
        <title>Pop quiz!</title>
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
          <Lenkepanel className="half" href="/" border>
            <Undertittel>
              Koronavirus - hva gjelder i min situasjon?
            </Undertittel>
            <Normaltekst>Se informasjon om rettighetene dine</Normaltekst>
          </Lenkepanel>
          <Lenkepanel className="half" href="/" border>
            <Undertittel>
              Koronavirus - hva gjelder i min situasjon?
            </Undertittel>
            <Normaltekst>Se informasjon om rettighetene dine</Normaltekst>
          </Lenkepanel>
        </div>

        <Stegindikator
          steg={[
            { label: "Dette steget først" },
            { label: "Og så dette steget", aktiv: true },
            { label: "Deretter må du gjøre dette" },
          ]}
          onChange={() => {}}
          visLabel
        />
        
        <Normaltekst>PartyTime</Normaltekst>
        <Link href="/">
          <Knapp>
            <a >Ta en tur hjem igjen</a>
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

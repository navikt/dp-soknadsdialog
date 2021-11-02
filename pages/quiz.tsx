import Head from "next/head";
import Link from "next/link";
import { Home as HomeIcon } from "@navikt/ds-icons";
import { LinkPanel, Heading, Ingress, Button } from "@navikt/ds-react";
import Subsumsjoner from "../components/subsumsjoner";
import Søknad from "../containers/søknad";
import { v4 as uuidv4 } from "uuid";

import "@navikt/ds-css";

export default function Quiz() {
  const søknadsId = uuidv4();

  return (
    <div className="root">
      <Head>
        <title>Pop quiz!</title>
      </Head>

      <section>
        <div className="fo">
          <HomeIcon style={{ height: "20px" }} />
          <Heading level="1" size="2xlarge">Hola!</Heading>
          <Ingress spacing>Nå tester vi quiz</Ingress>
        </div>
      </section>

      <main>
        <div className="boxes">
          <LinkPanel className="half" href="/" border>
            <LinkPanel.Title>
              Koronavirus - hva gjelder i min situasjon?
            </LinkPanel.Title>
            <LinkPanel.Description>
              Se informasjon om rettighetene dine
            </LinkPanel.Description>
          </LinkPanel>
          <LinkPanel className="half" href="/" border>
          <LinkPanel.Title>
              Koronavirus - hva gjelder i min situasjon?
            </LinkPanel.Title>
            <LinkPanel.Description>
              Se informasjon om rettighetene dine
            </LinkPanel.Description>
          </LinkPanel>
        </div>

        <Søknad id={søknadsId} />
        <Subsumsjoner søknadId={søknadsId} />

        <p className="typo-normal">PartyTime</p>
        <Link href="/">
          <Button>
            <a>Ta en tur hjem igjen</a>
          </Button>
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

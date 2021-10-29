import Head from "next/head";
import Link from "next/link";
import { LinkPanel, Button } from "@navikt/ds-react";
import { Home as HomeIcon } from "@navikt/ds-icons";

export default function Home(props) {
  return (
    <div className="root">
      <Head>
        <title>Dagpengre!</title>
      </Head>

      <section>
        <div className="fo">
          <HomeIcon />
          <p className="typo-sidetittel">Hola!</p>
          <p className="typo-ingress">Nå tester vi quiz</p>
        </div>
      </section>

      <main>
        <div className="boxes">
          <Link href="/quiz">
            <LinkPanel className="half" href="/quiz" border>
              <LinkPanel.Title>Ta en quiz om dagpenger</LinkPanel.Title>
              <LinkPanel.Description>
                Kul link som loader instantly
              </LinkPanel.Description>
            </LinkPanel>
          </Link>

          <Link href="/quiz">
            <LinkPanel className="half" href="/quiz" border>
              <LinkPanel.Title>Finn ut hva du har krav på</LinkPanel.Title>
              <LinkPanel.Description>
                Kul link som gir mad speeds
              </LinkPanel.Description>
            </LinkPanel>
          </Link>
        </div>
        <p className="typo-normal">PartyTime</p>
        <Link href="/quiz">
          <Button>
            <a>Ta en quiz veldig fort!</a>
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

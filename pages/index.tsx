import Head from "next/head";
import Link from "next/link";
import {LinkPanel, Heading, Ingress, Button} from "@navikt/ds-react";
import { Home as HomeIcon } from "@navikt/ds-icons";

export default function Home(props) {
  return (
    <div className="root">
      <Head>
        <title>Dagpenger!</title>
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
          <Link href="/quiz">
            <LinkPanel className="half" href="/quiz" border>
              <LinkPanel.Title>Ny søknad</LinkPanel.Title>
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
      </main>
    </div>
  );
}

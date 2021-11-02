import Head from "next/head";
import Link from "next/link";
import { Home as HomeIcon } from "@navikt/ds-icons";
import { LinkPanel, Heading, Ingress } from "@navikt/ds-react";
import Subsumsjoner from "../components/subsumsjoner";
import Søknad from "../containers/søknad";


export default function Quiz() {

  const nySøknad = async () => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/soknad`,   {
          method: "POST"
        }
    );

    if (response.status === 201) {
      return await response.json();
    }
  };

  const søknadsId = nySøknad()["uuid"]

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
        <Link href="/">Ta en tur hjem igjen</Link>
      </main>
    </div>
  );
}

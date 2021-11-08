import Head from "next/head";
import { Heading } from "@navikt/ds-react";
import React from "react";

export default function Home() {
  const [søknadId, setSøknadId] = React.useState(null);

  function nySøknad(event) {
    event.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/soknad`, {
      method: "POST",
    })
      .then((data) => {
        setSøknadId(data.søknad_uuid);
      })
      .catch((error) => {
        console.log(error);
        throw new Error("Kunne ikke opprette søknad");
      });
  }

  return (
    <div className="root">
      <Head>
        <title>Dagpenger!</title>
      </Head>

      <main>
        <Heading level="1" size="xlarge">
          Viktig informasjon
        </Heading>

        <section>
          <h3>her skal det stå viktige ting... </h3>
          informasjon om dine viktige ting...
        </section>

        <button onClick={nySøknad}>Start søknad</button>
      </main>
    </div>
  );
}

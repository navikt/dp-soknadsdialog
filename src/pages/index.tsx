import Head from "next/head";
import { Heading } from "@navikt/ds-react";

export default function Home() {
  return (
    <div className="root">
      <Head>
        <title>Dagpenger!</title>
      </Head>


      <main>
        <Heading level="1" size="xlarge">Den spede begynnelse</Heading>
      </main>
    </div>
  );
}

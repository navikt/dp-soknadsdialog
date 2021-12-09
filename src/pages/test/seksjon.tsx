import { sanityClient } from "../../../sanity-client";
import { fetchSeksjonById } from "../../sanity/groq-queries";
import { GetStaticPropsResult } from "next";
import { ApiSeksjon } from "../api/mock/mock-data";
import { ISeksjon, Seksjon } from "../../components/seksjon/Seksjon";

export async function getStaticProps(): Promise<GetStaticPropsResult<ISeksjon>> {
  const apiSeksjon: ApiSeksjon = await fetch(`http://localhost:3000/api/mock/neste-seksjon`).then(
    (data) => {
      return data.json();
    }
  );

  if (!apiSeksjon) {
    console.error("Fikk ingen seksjon fra API");
    return { notFound: true };
  }

  const sanitySeksjon = await sanityClient.fetch<ISeksjon>(fetchSeksjonById, {
    id: apiSeksjon.id,
  });

  if (!sanitySeksjon) {
    console.error("Fant ikke seksjon i sanity");
    return { notFound: true };
  }

  return {
    props: {
      _id: sanitySeksjon._id,
      title: sanitySeksjon.title,
      description: sanitySeksjon.description,
      helpText: sanitySeksjon.helpText,
      faktum: sanitySeksjon.faktum || [],
    },
    revalidate: 120,
  };
}

export default function SanityTestPage(props: ISeksjon) {
  return <Seksjon {...props} />;
}

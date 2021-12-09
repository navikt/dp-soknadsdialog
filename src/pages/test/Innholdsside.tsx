import { sanityClient } from "../../../sanity-client";
import { fetchForside } from "../../sanity/groq-queries";
import { Forside } from "../../views/Forside";
import { SanityLandingPage } from "../../sanity/types";
import { GetStaticPropsResult } from "next";

export async function getStaticProps(): Promise<GetStaticPropsResult<ForsideData>> {
  const sanityData = await sanityClient.fetch<SanityLandingPage>(fetchForside);

  return {
    props: {
      title: sanityData.title,
      content: sanityData.content,
    },
    revalidate: 120,
  };
}

interface ForsideData {
  title: string;
  content: any;
}

export default function SanityTestPage(props: ForsideData) {
  return <Forside title={props.title} content={props.content} />;
}

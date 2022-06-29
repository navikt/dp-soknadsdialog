import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";
import { SanityTexts } from "../types/sanity.types";
import { StartSoknad } from "../views/StartSoknad";
import { sanityClient } from "../../sanity-client";
import { allTextsQuery } from "../sanity/groq-queries";
import { SanityProvider } from "../context/sanity-context";

interface Props {
  sanityTexts: SanityTexts;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  const { locale } = context;

  const sanityTexts = await sanityClient.fetch<SanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });

  return {
    props: {
      sanityTexts,
    },
  };
}

export default function Soknad(props: Props) {
  if (!props.sanityTexts.apptekster) {
    return <div>Noe gikk galt ved henting av texter fra sanity</div>;
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <StartSoknad />
    </SanityProvider>
  );
}

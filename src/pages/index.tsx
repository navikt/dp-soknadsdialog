import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";
import { ISanityTexts } from "../types/sanity.types";
import { StartSoknad } from "../views/StartSoknad";
import { sanityClient } from "../../sanity-client";
import { allTextsQuery } from "../sanity/groq-queries";
import { SanityProvider } from "../context/sanity-context";

interface IProps {
  sanityTexts: ISanityTexts;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<IProps>> {
  const { locale } = context;

  const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang: locale,
  });

  return {
    props: {
      sanityTexts,
    },
  };
}

export default function Soknad(props: IProps) {
  if (!props.sanityTexts.apptekster) {
    return <div>Noe gikk galt ved henting av texter fra sanity</div>;
  }

  return (
    <SanityProvider initialState={props.sanityTexts}>
      <StartSoknad />
    </SanityProvider>
  );
}

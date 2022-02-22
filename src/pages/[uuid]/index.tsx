import React from "react";
import { Provider } from "react-redux";
import { initialiseStore, RootState } from "../../store";
import { Soknad } from "../../components/view/Soknad";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { sanityClient } from "../../../sanity-client";
import { fetchAllSeksjoner } from "../../sanity/groq-queries";
import { ISection } from "../../types/section.types";
import { getSession } from "@navikt/dp-auth/server";
import { audience } from "../../api.utils";
import { getFakta } from "../../server-side/quiz-api";
import { mapQuizFaktaToReduxState } from "../../server-side/quiz-to-redux-mapper";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<RootState>> {
  const { query } = context;
  const uuid = query.uuid as string;

  const sanitySections = await sanityClient.fetch<ISection[]>(fetchAllSeksjoner);

  if (sanitySections.length <= 0) {
    // eslint-disable-next-line no-console
    console.error("Fant ikke seksjon i sanity");
    return { notFound: true };
  }

  const { token, apiToken } = await getSession(context);
  let initialState: RootState = {
    soknadId: uuid,
    sections: sanitySections,
    answers: [],
    barnetillegg: { id: "", beskrivendeId: "faktum.barn-liste", type: "generator", answers: [] },
    arbeidsforhold: {
      id: "",
      beskrivendeId: "faktum.arbeidsforhold",
      type: "generator",
      answers: [],
    },
  };

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    const fakta = await getFakta(uuid, "");
    initialState = { ...initialState, ...mapQuizFaktaToReduxState(fakta) };
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    const fakta = await getFakta(uuid, onBehalfOfToken);
    initialState = { ...initialState, ...mapQuizFaktaToReduxState(fakta) };
  }

  return {
    props: { ...initialState },
  };
}

export default function SoknadMedId(props: RootState) {
  const reduxStore = initialiseStore(props);

  return (
    <Provider store={reduxStore}>
      <Soknad />
    </Provider>
  );
}

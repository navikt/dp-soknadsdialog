import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../../sanity-client";
import { audience } from "../../../../api.utils";
import { fetchAllSeksjoner } from "../../../../sanity/groq-queries";
import { getFakta } from "../../../../server-side/quiz-api";
import { RootState } from "../../../../store";
import { ISection } from "../../../../types/section.types";
import { mapQuizFaktaToReduxState } from "../../../../server-side/quiz-to-redux-mapper";

async function initializeHandler(req: NextApiRequest, res: NextApiResponse<RootState>) {
  const sanitySections = await sanityClient.fetch<ISection[]>(fetchAllSeksjoner);
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
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

  if (sanitySections.length <= 0) {
    // eslint-disable-next-line no-console
    console.error("Fant ikke seksjon i sanity");
    return res.status(404);
  }

  return res.status(200).json(initialState);
}
export default initializeHandler;

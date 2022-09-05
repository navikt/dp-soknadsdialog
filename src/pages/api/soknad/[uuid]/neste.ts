import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";
import { getSoknadState } from "../../../../api/server/quiz-api";
import { BARN_LISTE_REGISTER_FAKTUM_ID } from "../../../../constants";
import { withSentry } from "@sentry/nextjs";

let localhostAnswerIndex = 0;

async function nesteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
  const sistLagret = req.query.sistLagret as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    const soknadState = await getSoknadState(uuid, "");

    const quizSeksjoner = soknadState.seksjoner.map((seksjon) => {
      const fakta = seksjon.fakta.map((faktum, index) => {
        if (faktum.beskrivendeId === BARN_LISTE_REGISTER_FAKTUM_ID) {
          return faktum;
        }

        const { svar, ...faktumWithoutAnswer } = faktum;
        if (index <= localhostAnswerIndex) {
          return { ...faktumWithoutAnswer, svar };
        } else {
          return faktumWithoutAnswer;
        }
      });

      return { ...seksjon, fakta };
    });

    localhostAnswerIndex++;
    return res.status(200).json({ ...soknadState, seksjoner: quizSeksjoner });
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    const soknadState = await getSoknadState(uuid, onBehalfOfToken, sistLagret);
    return res.status(200).json(soknadState);
  }

  res.status(404).end();
}

export default withSentry(nesteHandler);

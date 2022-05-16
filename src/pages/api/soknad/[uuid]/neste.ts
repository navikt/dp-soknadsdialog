import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";
import { getSoknadState } from "../../../../server-side/quiz-api";

let localhostAnswerIndex = 0;

async function nesteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    const soknadState = await getSoknadState(uuid, "");

    const quizSeksjoner = soknadState.seksjoner.map((seksjon) => {
      const fakta = seksjon.fakta.map((faktum, index) => {
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
    const soknadState = await getSoknadState(uuid, onBehalfOfToken);
    return res.status(200).json(soknadState);
  }

  res.status(404).end();
}
export default nesteHandler;

import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { audienceDPSoknad, getErrorMessage } from "../../../api.utils";
import { getSession } from "../../../auth.utils";
import { allTextsQuery } from "../../../sanity/groq-queries";
import { textStructureToHtml } from "../../../sanity/textStructureToHtml";
import { logRequestError } from "../../../error.logger";
import { ISanityTexts } from "../../../types/sanity.types";
import { headersWithToken } from "../../../api/quiz-api";
import { type Locale } from "@navikt/nav-dekoratoren-moduler/ssr";

export interface IFerdigstillBody {
  uuid: string;
  locale?: Locale;
}

async function ferdigstillHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { uuid, locale } = req.body;
  try {
    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
    const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
      baseLang: "nb",
      lang: locale,
    });

    const sanityTextsWithHTML = textStructureToHtml(sanityTexts);
    const ferdigstillResponse = await fetch(
      `${process.env.API_BASE_URL}/soknad/${uuid}/ferdigstill`,
      {
        method: "PUT",
        headers: headersWithToken(onBehalfOfToken),
        body: JSON.stringify({ sanityTexts: sanityTextsWithHTML }),
      }
    );

    if (!ferdigstillResponse.ok) {
      logRequestError(
        ferdigstillResponse.statusText,
        uuid,
        "Ferdigstill soknad - Failed to post to dp-soknad"
      );
      return res.status(ferdigstillResponse.status).send(ferdigstillResponse.statusText);
    }
    return res.status(ferdigstillResponse.status).send(ferdigstillResponse.statusText);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid, "Ferdigstill soknad - Generic error");
    return res.status(500).send(message);
  }
}

export default withSentry(ferdigstillHandler);

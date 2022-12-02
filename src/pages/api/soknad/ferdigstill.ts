import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { audienceDPSoknad } from "../../../api.utils";
import { getSession } from "../../../auth.utils";
import { allTextsQuery } from "../../../sanity/groq-queries";
import { textStructureToHtml } from "../../../sanity/textStructureToHtml";
import { FERDIGSTILL_ERROR } from "../../../sentry-constants";
import { logRequestError } from "../../../sentry.logger";
import { ISanityTexts } from "../../../types/sanity.types";
import { headersWithToken } from "../../../api/quiz-api";
import { type Locale } from "@navikt/nav-dekoratoren-moduler/ssr";

export interface IFerdigstillBody {
  uuid: string;
  locale?: Locale;
}

async function ferdigstillHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(201).json("Mock content");
  }

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
      logRequestError(FERDIGSTILL_ERROR, uuid);
      return res.status(ferdigstillResponse.status).send(ferdigstillResponse.statusText);
    }
    return res.status(ferdigstillResponse.status).end();
  } catch (error: unknown) {
    logRequestError(FERDIGSTILL_ERROR, uuid);
    return res.status(500).send(error);
  }
}

export default withSentry(ferdigstillHandler);

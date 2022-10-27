import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../../api.utils";
import { headersWithToken } from "../../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { sanityClient } from "../../../../../sanity-client";
import { ISanityTexts } from "../../../../types/sanity.types";
import { allTextsQuery } from "../../../../sanity/groq-queries";
import { textStructureToHtml } from "../../../../sanity/textStructureToHtml";
import { getSession } from "../../../../auth.utils";

async function completeHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(201).json("Mock content");
  }

  const session = await getSession(req);
  const uuid = req.query.uuid as string;
  const locale = req.query.locale as string;

  if (!session) {
    return res.status(401).end();
  }

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
        method: "Put",
        headers: headersWithToken(onBehalfOfToken),
        body: JSON.stringify({ sanityTexts: sanityTextsWithHTML }),
      }
    );

    if (!ferdigstillResponse.ok) {
      return res.status(ferdigstillResponse.status).send(ferdigstillResponse.statusText);
    }
    return res.status(ferdigstillResponse.status).end();
  } catch (error: unknown) {
    return res.status(500).send(error);
  }
}

export default withSentry(completeHandler);

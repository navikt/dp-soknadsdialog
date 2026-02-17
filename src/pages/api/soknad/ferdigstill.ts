import { DecoratorLocale } from "@navikt/nav-dekoratoren-moduler/ssr";
import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { getErrorMessage } from "../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { logRequestErrorAsInfo } from "../../../error.logger";
import { allTextsQuery } from "../../../sanity/groq-queries";
import { textStructureToHtml } from "../../../sanity/textStructureToHtml";
import { ISanityTexts } from "../../../types/sanity.types";
import { headersWithToken } from "../common/quiz-api";

export interface IFerdigstillBody {
  uuid: string;
  locale?: DecoratorLocale;
}

async function ferdigstillHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(201).json("Mock content");
  }

  const { uuid, locale } = req.body;
  try {
    const onBehalfOf = await getSoknadOnBehalfOfToken(req);
    if (!onBehalfOf.ok) {
      return res.status(401).end();
    }

    const sanityTexts = await sanityClient.fetch<ISanityTexts>(allTextsQuery, {
      baseLang: "nb",
      lang: locale,
    });

    const sanityTextsWithHTML = textStructureToHtml(sanityTexts);
    const ferdigstillResponse = await fetch(
      `${process.env.API_BASE_URL}/soknad/${uuid}/ferdigstill`,
      {
        method: "PUT",
        headers: headersWithToken(onBehalfOf.token),
        body: JSON.stringify({ sanityTexts: sanityTextsWithHTML }),
      },
    );

    if (!ferdigstillResponse.ok) {
      logRequestErrorAsInfo(
        ferdigstillResponse.statusText,
        uuid,
        "Ferdigstill soknad - Failed to post to dp-soknad",
      );
      return res.status(ferdigstillResponse.status).send(ferdigstillResponse.statusText);
    }
    return res.status(ferdigstillResponse.status).send(ferdigstillResponse.statusText);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestErrorAsInfo(message, uuid, "Ferdigstill soknad - Generic error");
    return res.status(500).send("Internal server error");
  }
}

export default ferdigstillHandler;

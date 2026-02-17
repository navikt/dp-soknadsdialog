import { OboResult, expiresIn, getToken, requestOboToken, validateToken } from "@navikt/oasis";
import { IncomingMessage } from "http";

const audienceDPSoknad = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-soknad`;
const audienceDPSoknadOrkestrator = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-soknad-orkestrator`;
const audienceMellomlagring = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-mellomlagring`;
const audienceArbeidsoekkerregisteret = `${process.env.NAIS_CLUSTER_NAME}:paw:paw-arbeidssoekerregisteret-api-oppslag-v2`;

async function getOnBehalfOfToken(req: IncomingMessage, audience: string): Promise<OboResult> {
  const token = getToken(req);
  if (!token) {
    return OboResult.Error("missing token");
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    return OboResult.Error("token validation failed");
  }

  return requestOboToken(token, audience);
}

export async function getSoknadOnBehalfOfToken(req: IncomingMessage): Promise<OboResult> {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    if (process.env.DP_SOKNAD_TOKEN && expiresIn(process.env.DP_SOKNAD_TOKEN) <= 0) {
      console.log("\n ⛔️ Lokalt sessjon utløpt! Kjør: npm run generate-token på nytt.");
    }

    return OboResult.Ok(process.env.DP_SOKNAD_TOKEN || "");
  }

  return getOnBehalfOfToken(req, audienceDPSoknad);
}

export async function getSoknadOrkestratorOnBehalfOfToken(
  req: IncomingMessage,
): Promise<OboResult> {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    if (
      process.env.DP_SOKNAD_ORKESTRATOR_TOKEN &&
      expiresIn(process.env.DP_SOKNAD_ORKESTRATOR_TOKEN) <= 0
    ) {
      console.log("\n ⛔️ Lokalt sessjon utløpt! Kjør: npm run generate-token på nytt.");
    }

    return OboResult.Ok(process.env.DP_SOKNAD_ORKESTRATOR_TOKEN || "");
  }

  return getOnBehalfOfToken(req, audienceDPSoknadOrkestrator);
}

export async function getArbeidsoekkerregisteretOnBehalfOfToken(
  req: IncomingMessage,
): Promise<OboResult> {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return OboResult.Ok(process.env.ARBEIDSSOEKERREGISTERET_TOKEN || "");
  }

  return getOnBehalfOfToken(req, audienceArbeidsoekkerregisteret);
}

export async function getMellomlagringOnBehalfOfToken(req: IncomingMessage): Promise<OboResult> {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return OboResult.Ok(process.env.DP_MELLOMLAGRING || "");
  }

  return getOnBehalfOfToken(req, audienceMellomlagring);
}

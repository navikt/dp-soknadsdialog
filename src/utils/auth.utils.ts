import { OboResult, getToken, requestOboToken, validateToken } from "@navikt/oasis";
import { audienceDPSoknad, audienceMellomlagring, audienceVeilarb } from "./api.utils";
import { IncomingMessage } from "http";

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
    return OboResult.Ok(process.env.DP_SOKNAD_TOKEN || "");
  }

  return getOnBehalfOfToken(req, audienceDPSoknad);
}

export async function getVeilarbregistreringOnBehalfOfToken(
  req: IncomingMessage
): Promise<OboResult> {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return OboResult.Ok(process.env.VEILARBPROXY_TOKEN || "");
  }

  return getOnBehalfOfToken(req, audienceVeilarb);
}

export async function getMellomlagringOnBehalfOfToken(req: IncomingMessage): Promise<OboResult> {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return OboResult.Ok(process.env.DP_MELLOMLAGRING || "");
  }

  return getOnBehalfOfToken(req, audienceMellomlagring);
}

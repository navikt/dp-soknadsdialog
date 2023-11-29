import { GetSessionWithOboProvider, SessionWithOboProvider, makeSession } from "@navikt/dp-auth";
import { idporten } from "@navikt/dp-auth/identity-providers";
import { tokenX, withInMemoryCache } from "@navikt/dp-auth/obo-providers";
import { withPrometheus } from "@navikt/dp-auth/obo-providers/withPrometheus";
import { audienceDPSoknad, audienceMellomlagring, audienceVeilarb } from "./api.utils";

export let getSession: GetSessionWithOboProvider;

if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
  getSession = makeSession({
    identityProvider: async () => process.env.DP_SOKNAD_TOKEN || "",
    oboProvider: tokenX,
  });
} else {
  getSession = makeSession({
    identityProvider: idporten,
    oboProvider: withInMemoryCache(withPrometheus(tokenX)),
  });
}

export async function getSoknadOnBehalfOfToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.DP_SOKNAD_TOKEN || "";
  }

  return session.apiToken(audienceDPSoknad);
}

export async function getVeilarbregistreringOnBehalfOfToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.VEILARBPROXY_TOKEN || "";
  }

  return session.apiToken(audienceVeilarb);
}

export async function getMellomlagringOnBehalfOfToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.DP_MELLOMLAGRING || "";
  }

  return session.apiToken(audienceMellomlagring);
}

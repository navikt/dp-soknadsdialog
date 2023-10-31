import { GetSessionWithOboProvider, SessionWithOboProvider, makeSession } from "@navikt/dp-auth";
import { idporten } from "@navikt/dp-auth/identity-providers";
import { tokenX, withInMemoryCache } from "@navikt/dp-auth/obo-providers";
import { withPrometheus } from "@navikt/dp-auth/obo-providers/withPrometheus";
import { audienceDPSoknad, audienceMellomlagring, audienceVeilarb } from "./api.utils";

export let getSession: GetSessionWithOboProvider;

const fallbackToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
  getSession = makeSession({
    identityProvider: async () => process.env.DP_SOKNAD_TOKEN || fallbackToken,
    oboProvider: tokenX,
  });
} else {
  getSession = makeSession({
    identityProvider: idporten,
    oboProvider: withInMemoryCache(withPrometheus(tokenX)),
  });
}

export async function getSoknadOboToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.DP_SOKNAD_TOKEN || fallbackToken;
  }

  return session.apiToken(audienceDPSoknad);
}

export async function getVeilarbregistreringOboToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.VEILARBPROXY_TOKEN || fallbackToken;
  }

  return session.apiToken(audienceVeilarb);
}

export async function getMellomlagringOboToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.DP_MELLOMLAGRING || fallbackToken;
  }

  return session.apiToken(audienceMellomlagring);
}

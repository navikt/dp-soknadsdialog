import { GetSessionWithOboProvider, SessionWithOboProvider, makeSession } from "@navikt/oasis";
import { idporten } from "@navikt/oasis/identity-providers";
import { tokenX, withInMemoryCache } from "@navikt/oasis/obo-providers";
import { withPrometheus } from "@navikt/oasis/obo-providers/withPrometheus";

const audienceDPSoknad = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-soknad`;
const audienceMellomlagring = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-mellomlagring`;
const audienceArbeidsoekkerregisteret = `${process.env.NAIS_CLUSTER_NAME}:paw:paw-arbeidssoekerregisteret-api-oppslag`;

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

export async function getArbeidsoekkerregisteretOnBehalfOfToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.ARBEIDSSOEKERREGISTERET_TOKEN || "";
  }

  return session.apiToken(audienceArbeidsoekkerregisteret);
}

export async function getMellomlagringOnBehalfOfToken(session: SessionWithOboProvider) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true") {
    return process.env.DP_MELLOMLAGRING_TOKEN || "";
  }

  return session.apiToken(audienceMellomlagring);
}

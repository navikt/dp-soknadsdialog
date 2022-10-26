import { makeSession } from "@navikt/dp-auth";
import { idporten } from "@navikt/dp-auth/identity-providers";
import { tokenX, withInMemoryCache } from "@navikt/dp-auth/obo-providers";

export const getSession = makeSession({
  identityProvider: idporten,
  oboProvider: withInMemoryCache(tokenX, {
    // eslint-disable-next-line no-console
    cacheHit: () => console.log(`TokenX cache hit`),
    // eslint-disable-next-line no-console
    cacheMiss: () => console.log(`TokenX cache miss`),
  }),
});

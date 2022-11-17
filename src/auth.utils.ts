import { GetSessionWithOboProvider, makeSession } from "@navikt/dp-auth";
import { idporten } from "@navikt/dp-auth/identity-providers";
import { tokenX, withInMemoryCache } from "@navikt/dp-auth/obo-providers";

let getSession: GetSessionWithOboProvider;

if (process.env.AUTH_PROVIDER == "local") {
  const staticToken =
    process.env.LOCAL_TOKEN ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  getSession = makeSession({
    identityProvider: async () => staticToken,
    oboProvider: process.env.LOCAL_TOKEN
      ? tokenX
      : async (token: string, audience: string) => token + audience,
  });
} else {
  getSession = makeSession({
    identityProvider: idporten,
    oboProvider: withInMemoryCache(tokenX, {
      // eslint-disable-next-line no-console
      cacheHit: () => console.log(`TokenX cache hit`),
      // eslint-disable-next-line no-console
      cacheMiss: () => console.log(`TokenX cache miss`),
    }),
  });
}

export { getSession };

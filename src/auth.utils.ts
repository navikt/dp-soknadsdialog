import { GetSessionWithOboProvider, makeSession } from "@navikt/dp-auth";
import { idporten } from "@navikt/dp-auth/identity-providers";
import { tokenX, withInMemoryCache } from "@navikt/dp-auth/obo-providers";

let getSession: GetSessionWithOboProvider;

if (process.env.AUTH_PROVIDER == "local") {
  const staticToken =
    process.env.LOCAL_TOKEN ||
    "eyJraWQiOiJ2UHBaZW9HOGRkTHpmdHMxLWxnc3VnOHNyYVd3bW04dHhJaGJ3Y1h3R01JIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ3aWxWRW9Zbk1ZTEo5cXROWE9vUHJCbDVMNjhNdTdpUlBZRUhXc2pYT2tRPSIsImlzcyI6Imh0dHBzOlwvXC9vaWRjLXZlcjIuZGlmaS5ub1wvaWRwb3J0ZW4tb2lkYy1wcm92aWRlclwvIiwiY2xpZW50X2FtciI6InByaXZhdGVfa2V5X2p3dCIsInBpZCI6IjA4ODk2Njk5Mjg5IiwidG9rZW5fdHlwZSI6IkJlYXJlciIsImNsaWVudF9pZCI6ImE5ZjY4MzI4LWNkMmEtNDgyOS04YTIyLWJiN2MyN2Y2MzQ1OCIsImF1ZCI6Imh0dHBzOlwvXC9uYXYubm8iLCJhY3IiOiJMZXZlbDQiLCJzY29wZSI6Im9wZW5pZCIsImV4cCI6MTY2ODY5NTI1MCwiaWF0IjoxNjY4NjkxNjUwLCJjbGllbnRfb3Jnbm8iOiI4ODk2NDA3ODIiLCJqdGkiOiJjX3NFbjFQZ3gtYnRxM2RTQUZORmN0ZVhqVWg0LVlldFU4MFc1alN6WnQwIiwiY29uc3VtZXIiOnsiYXV0aG9yaXR5IjoiaXNvNjUyMy1hY3RvcmlkLXVwaXMiLCJJRCI6IjAxOTI6ODg5NjQwNzgyIn19.BRsmQMo1u3ngJfGKtlw7y3quO3j4PaoyppsEruSJPhunR5iT5wQYyBS5lmanYH5wfZsS2X0214J4uUrpicYVfgd8qBAr3Ylnh_TahxSkpoHNH_431OShQnTPYwbVE34sBsM04ah0dVErij_x19lMY0x86GlG07QQv6MW0gkYsgDC9QsEXttFJYUqF-sixDyW2kyFUAjiPZw2O7RyvBC_9foKxGyHJYykCnxeesocYBwcUfo3xbKU-a9OSd4qdm7utld8mRF34mb5LDF_XNf_IeirENyr4ONT5txWISgC1idVL-aRmT7kMxFQUql5GtRYc6gE7BrbD7E8rJVVnXI-lQ";
  getSession = makeSession({
    identityProvider: async () => staticToken,
    oboProvider: tokenX,
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

import { SessionWithOboProvider } from "@navikt/dp-auth/index/";

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJwaWQiOiIxMjMxMjMxMjMifQ.XdPmoIvLFmgz51eH_05WBNOllgWEtp9kYHkWAHqMwEc";

export function mockGetSession(): SessionWithOboProvider {
  const session: SessionWithOboProvider = {
    token: mockToken,
    apiToken: async () => "access_token",
    expiresIn: 123,
  };

  return session;
}

export function mockOnBehalfOfToken() {
  return mockToken;
}

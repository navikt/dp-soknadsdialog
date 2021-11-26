import { ensureAuth } from "./ensure-auth";
import { getSession as _getSession } from "@navikt/dp-auth/server";
import { GetServerSidePropsContext } from "next";

jest.mock("@navikt/dp-auth/server");
const getSession = _getSession as jest.MockedFunction<typeof _getSession>;

const context = {} as GetServerSidePropsContext;

beforeEach(() =>
  getSession.mockResolvedValue({
    token: "123",
    payload: { exp: Date.now() / 1000 + 3000 },
  })
);
afterEach(() => getSession.mockClear());

test("ensureAuth gjør ikke redirect når skrudd av og session mangler", async () => {
  getSession.mockResolvedValue({});

  const getServerSideProps = ensureAuth({ enforceLogin: false })(async (ctx) => {
    expect(ctx).toEqual(context);
    const handler = "handled";
    return { props: { handler } };
  });

  const serverSideProps = await getServerSideProps(context);

  expect(getSession).not.toBeCalled();
  expect(serverSideProps).toMatchObject({
    props: { handler: "handled" },
  });
});

test("ensureAuth redirect når skrudd på og session mangler", async () => {
  getSession.mockResolvedValue({});

  const getServerSideProps = ensureAuth({ enforceLogin: true })(async (ctx) => {
    expect(ctx).toEqual(context);
    const handler = "handled";
    return { props: { handler } };
  });

  const serverSideProps = await getServerSideProps(context);

  expect(serverSideProps).toMatchObject({
    redirect: {
      destination: expect.any(String),
      permanent: false,
    },
  });
});

test("ensureAuth gir ikke redirect når skrudd på og session er der", async () => {
  const getServerSideProps = ensureAuth({ enforceLogin: true })(async (ctx) => {
    expect(ctx).toEqual(context);
    const handler = "handled";
    return { props: { handler } };
  });

  const serverSideProps = await getServerSideProps(context);

  expect(serverSideProps).toMatchObject({
    props: {
      handler: "handled",
      session: {
        expires_in: expect.any(Number),
      },
    },
  });
});

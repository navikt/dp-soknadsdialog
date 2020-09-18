import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
    rest.get(
        `${process.env.NEXT_PUBLIC_API_URL}/neste-fakta`,
        (req, res, ctx) => {
            return res(
                ctx.json([
                    {
                        id: "1231",
                        navn: "Ønsket dato",
                    },
                ])
            );
        }
    ),
    rest.put(
        `${process.env.NEXT_PUBLIC_API_URL}/faktum/:faktumId`,
        (req, res, ctx) => {
            const { faktumId } = req.params;
            const { svar } = req.body;
            return res(
                ctx.json([
                    {
                        id: faktumId,
                        navn: "Ønsket dato",
                        svar,
                    },
                ])
            );
        }
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

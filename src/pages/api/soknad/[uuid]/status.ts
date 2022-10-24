import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";

export type ISoknadStatuser = "Paabegynt" | "UnderBehandling" | "FerdigBehandlet" | "Ukjent";

export interface ISoknadStatus {
  status: ISoknadStatuser;
  opprettet?: string;
  innsendt?: string;
}

async function statusHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ tilstand: "Innsendt" });
  }
}
export default withSentry(statusHandler);

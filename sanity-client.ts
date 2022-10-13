import { createClient } from "next-sanity";

export const sanityConfig = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rt6o382n",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_ACCESS_TOKEN || "",
  apiVersion: "2021-06-06",
};

export const sanityClient = createClient(sanityConfig);

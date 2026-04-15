import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = createClient({
  projectId: projectId ?? "missing-project-id",
  dataset,
  apiVersion: "2026-04-15",
  useCdn: true,
});

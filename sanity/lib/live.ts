import type { ReactNode } from "react";
import { client } from "./client";

type SanityFetchParams = {
  query: string;
  params?: Record<string, unknown>;
};

export async function sanityFetch<T>({
  query,
  params = {},
}: SanityFetchParams): Promise<T> {
  return client.fetch<T>(query, params);
}

export function SanityLive(): ReactNode {
  return null;
}

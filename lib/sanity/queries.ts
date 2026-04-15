import groq from "groq";
import { sanityClient } from "@/lib/sanity/client";

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
};

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  stack?: string[];
};

const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt
  }
`;

const projectsQuery = groq`
  *[_type == "project"] | order(_updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    stack
  }
`;

export async function getPostList(): Promise<PostListItem[]> {
  return sanityClient.fetch<PostListItem[]>(postsQuery);
}

export async function getProjectList(): Promise<ProjectListItem[]> {
  return sanityClient.fetch<ProjectListItem[]>(projectsQuery);
}

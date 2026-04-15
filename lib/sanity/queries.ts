import groq from "groq";
import { sanityClient } from "@/lib/sanity/client";

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
};

export type PostDetail = PostListItem & {
  body?: unknown[];
};

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  stack?: string[];
};

export type ProjectDetail = ProjectListItem & {
  body?: unknown[];
  repoUrl?: string;
  demoUrl?: string;
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

const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body
  }
`;

const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    stack,
    repoUrl,
    demoUrl,
    body
  }
`;

export async function getPostList(): Promise<PostListItem[]> {
  return sanityClient.fetch<PostListItem[]>(postsQuery);
}

export async function getProjectList(): Promise<ProjectListItem[]> {
  return sanityClient.fetch<ProjectListItem[]>(projectsQuery);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return sanityClient.fetch<PostDetail | null>(postBySlugQuery, { slug });
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  return sanityClient.fetch<ProjectDetail | null>(projectBySlugQuery, { slug });
}

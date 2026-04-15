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

type SlugWithUpdatedAt = {
  slug: string;
  _updatedAt?: string;
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

const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(_updatedAt desc){
    "slug": slug.current,
    _updatedAt
  }
`;

const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(_updatedAt desc){
    "slug": slug.current,
    _updatedAt
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

export async function getPostSlugs(limit?: number): Promise<SlugWithUpdatedAt[]> {
  const slugs = await sanityClient.fetch<SlugWithUpdatedAt[]>(postSlugsQuery);
  return typeof limit === "number" ? slugs.slice(0, limit) : slugs;
}

export async function getProjectSlugs(limit?: number): Promise<SlugWithUpdatedAt[]> {
  const slugs = await sanityClient.fetch<SlugWithUpdatedAt[]>(projectSlugsQuery);
  return typeof limit === "number" ? slugs.slice(0, limit) : slugs;
}

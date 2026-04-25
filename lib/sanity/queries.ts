import groq from "groq";
import { sanityClient } from "@/lib/sanity/client";

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  categories?: string[];
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
  repoUrl?: string;
  cardCoverUrl?: string;
  cardImageAssetUrl?: string;
};

export type ProjectDetail = ProjectListItem & {
  body?: unknown[];
  repoUrl?: string;
  demoUrl?: string;
};

export type HomeContent = {
  titleZh?: string;
  titleEn?: string;
  subtitleZh?: string;
  subtitleEn?: string;
  bodyZh?: string;
  bodyEn?: string;
};

export type AboutContent = {
  titleZh?: string;
  titleEn?: string;
  bodyZh?: string;
  bodyEn?: string;
};

type SlugWithUpdatedAt = {
  slug: string;
  _updatedAt?: string;
};

/** 公开列表与 RSS：排除 Sanity 草稿文档（_id 位于 drafts 路径下） */
const publishedPostFilter = `!(_id in path("drafts.**"))`;

const postsQuery = groq`
  *[_type == "post" && ${publishedPostFilter}] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "categories": categories[]->title
  }
`;

const projectsQuery = groq`
  *[_type == "project" && ${publishedPostFilter}] | order(_updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    stack,
    repoUrl,
    cardCoverUrl,
    "cardImageAssetUrl": cardImage.asset->url
  }
`;

const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && ${publishedPostFilter}][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body
  }
`;

const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && ${publishedPostFilter}][0] {
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
  *[_type == "post" && defined(slug.current) && ${publishedPostFilter}] | order(_updatedAt desc){
    "slug": slug.current,
    _updatedAt
  }
`;

const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current) && ${publishedPostFilter}] | order(_updatedAt desc){
    "slug": slug.current,
    _updatedAt
  }
`;

const homeContentQuery = groq`
  *[_type == "homeContent"] | order(_updatedAt desc)[0]{
    titleZh,
    titleEn,
    subtitleZh,
    subtitleEn,
    bodyZh,
    bodyEn
  }
`;

const aboutContentQuery = groq`
  *[_type == "aboutContent"] | order(_updatedAt desc)[0]{
    titleZh,
    titleEn,
    bodyZh,
    bodyEn
  }
`;

export async function getPostList(): Promise<PostListItem[]> {
  return sanityClient.fetch<PostListItem[]>(postsQuery);
}

export async function getRecentPosts(limit: number): Promise<PostListItem[]> {
  const list = await getPostList();
  return list.slice(0, Math.max(0, limit));
}

export async function getProjectList(): Promise<ProjectListItem[]> {
  return sanityClient.fetch<ProjectListItem[]>(projectsQuery);
}

export async function getRecentProjects(limit: number): Promise<ProjectListItem[]> {
  const list = await getProjectList();
  return list.slice(0, Math.max(0, limit));
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

export async function getHomeContent(): Promise<HomeContent | null> {
  return sanityClient.fetch<HomeContent | null>(homeContentQuery);
}

export async function getAboutContent(): Promise<AboutContent | null> {
  return sanityClient.fetch<AboutContent | null>(aboutContentQuery);
}

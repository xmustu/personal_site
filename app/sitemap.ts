import type { MetadataRoute } from "next";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPostSlugs, getProjectSlugs } from "@/lib/sanity/queries";

function getBaseUrl() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const routes = ["/", "/about", "/projects", "/blog", "/contact"];
  const staticEntries = routes.flatMap((route) => {
    const zhPath = route;
    const enPath = route === "/" ? "/en" : `/en${route}`;

    return [
      {
        url: `${baseUrl}${zhPath}`,
        lastModified: now,
        alternates: {
          languages: {
            zh: `${baseUrl}${zhPath}`,
            en: `${baseUrl}${enPath}`,
          },
        },
      },
      {
        url: `${baseUrl}${enPath}`,
        lastModified: now,
        alternates: {
          languages: {
            zh: `${baseUrl}${zhPath}`,
            en: `${baseUrl}${enPath}`,
          },
        },
      },
    ];
  });

  if (!isSanityConfigured) {
    return staticEntries;
  }

  try {
    const [posts, projects] = await Promise.all([getPostSlugs(), getProjectSlugs()]);
    const postEntries = posts.flatMap((post) => {
      const zhPath = `/blog/${post.slug}`;
      const enPath = `/en/blog/${post.slug}`;
      const lastModified = post._updatedAt ? new Date(post._updatedAt) : now;

      return [
        {
          url: `${baseUrl}${zhPath}`,
          lastModified,
          alternates: {
            languages: {
              zh: `${baseUrl}${zhPath}`,
              en: `${baseUrl}${enPath}`,
            },
          },
        },
        {
          url: `${baseUrl}${enPath}`,
          lastModified,
          alternates: {
            languages: {
              zh: `${baseUrl}${zhPath}`,
              en: `${baseUrl}${enPath}`,
            },
          },
        },
      ];
    });

    const projectEntries = projects.flatMap((project) => {
      const zhPath = `/projects/${project.slug}`;
      const enPath = `/en/projects/${project.slug}`;
      const lastModified = project._updatedAt ? new Date(project._updatedAt) : now;

      return [
        {
          url: `${baseUrl}${zhPath}`,
          lastModified,
          alternates: {
            languages: {
              zh: `${baseUrl}${zhPath}`,
              en: `${baseUrl}${enPath}`,
            },
          },
        },
        {
          url: `${baseUrl}${enPath}`,
          lastModified,
          alternates: {
            languages: {
              zh: `${baseUrl}${zhPath}`,
              en: `${baseUrl}${enPath}`,
            },
          },
        },
      ];
    });

    return [...staticEntries, ...postEntries, ...projectEntries];
  } catch {
    return staticEntries;
  }
}

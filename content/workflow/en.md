This project uses **Sanity** as the single **publishable** content source, **ingest scripts** as a **draft-only** curation entrypoint, and **preflight / release** for repeatable shipping.

## 1. Technical writing (original)

1. Run `npm run studio:dev`.  
2. Create or edit a `post` and write the body in Portable Text.  
3. Fill `excerpt` / `sourceUrl` when relevant.  
4. **Publish** — the post appears on `/blog`, sitemap, and RSS (when deployed with `NEXT_PUBLIC_SITE_URL`).

## 2. Curation (external sources → drafts → your review)

1. **Manual URLs**: one URL per line in `data/manual-urls.txt`, then  
   `npm run ingest:manual -- --urls data/manual-urls.txt --dry-run` before writing.  
2. **RSS auto mode**: copy `data/auto-sources.example.json` to `data/auto-sources.json`, tune keywords/feeds, then  
   `npm run ingest:auto -- --config data/auto-sources.json`.  
3. Scripts only create **`post` documents under `_drafts.*`** — they are hidden from public listings until you publish.  
4. In Studio, add your take, verify attribution, then publish.

Note: some publishers return **403** to scripted fetches; see root `README.md` for `INGEST_JINA_ON_403` / `INGEST_USER_AGENT`.

## 3. Ship checklist

1. `npm run lint`  
2. `npm run preflight`  
3. `npm run release:preview` or `npm run release:prod` (Vercel CLI logged in)

## 4. How this differs from “template stacking”

Layout patterns are inspired by popular Next.js portfolio/blog templates, but **Nextra is not bundled** here so `next-intl` + Sanity drafts stay maintainable. If you want a dedicated docs site, add **Nextra in a separate workspace package** rather than mixing it into this App Router tree.

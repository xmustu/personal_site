# Smoke Test Checklist

> Use this checklist before each release.
> Target: finish in 10 minutes and catch critical regressions.

## Run Info

- Date:
- Tester:
- Environment: local / preview / production
- Base URL:
- Branch / Commit:

## 0) Startup (1 min)

- [ ] Run:

```powershell
cd C:\Users\zzf\Projects\personal-site
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm run dev
```

- [ ] Site opens at `http://localhost:3000`

## 1) Core Routes (2 min)

- [ ] `/`
- [ ] `/about`
- [ ] `/projects`
- [ ] `/blog`
- [ ] `/contact`
- [ ] `/en`
- [ ] `/en/about`
- [ ] `/en/projects`
- [ ] `/en/blog`
- [ ] `/en/contact`

Pass condition: all routes return normal pages (no 404/500), language switch and nav links work.

## 2) Detail Pages + 404 Strategy (2 min)

- [ ] Open one blog detail page from `/blog` or `/en/blog`
- [ ] Open one project detail page from `/projects` or `/en/projects`
- [ ] Test an invalid slug (example: `/en/blog/not-exist`)

Pass condition: existing detail pages render title/summary/body; invalid slug returns 404 page.

## 3) Contact Form (1.5 min)

- [ ] Submit valid name/email/message
- [ ] Submit invalid input (empty or bad email)
- [ ] If Resend is configured, verify mailbox receives the message

Pass condition: clear success/error feedback; no blank/500 state.

## 4) Comments (1 min)

- [ ] Open blog detail page comments section
- [ ] If Giscus configured, widget loads
- [ ] If not configured, fallback message displays

Pass condition: comment area has a clear status and no runtime error.

## 5) SEO Basics (1.5 min)

- [ ] `/sitemap.xml` is accessible
- [ ] `/robots.txt` is accessible
- [ ] Check page source of one detail page:
  - [ ] `title`
  - [ ] `meta description`
  - [ ] `canonical`
  - [ ] `og:title` and `og:description`

Pass condition: all required metadata exists and looks correct.

## 6) Automated Preflight (2 min)

- [ ] Run:

```powershell
npm run preflight
```

- [ ] Output includes: `Preflight checks passed.`

## Release Decision

- [ ] **GO**: all checks passed
- [ ] **NO-GO**: any critical item failed

## Notes / Defects

- Issue:
- Steps to reproduce:
- Severity:
- Owner:

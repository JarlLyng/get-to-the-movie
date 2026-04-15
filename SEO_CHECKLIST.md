# SEO Implementation Checklist — Get to the Movie!

> Quick-reference for developers and AI agents. Each item links to the file where it's implemented.  
> For the full SEO/GEO strategy, see [SEO_STRATEGY.md](./SEO_STRATEGY.md).

**Last updated:** 2026-04-15

---

## Implemented

### Core SEO — `src/app/layout.tsx`
- [x] Title tag with template: `Get to the Movie! — Arnold Schwarzenegger Recommendation Quiz`
- [x] Meta description (155 chars, action-oriented with "Free quiz" CTA)
- [x] Keywords meta tag (11 keywords incl. long-tail: "which arnold movie should i watch")
- [x] Canonical URL via `metadataBase` → `https://gettothemovie.iamjarl.com`
- [x] Language attribute: `lang="en"` on `<html>`
- [x] Robots meta tags: `index: true, follow: true`
- [x] Googlebot specific: max-video-preview, max-image-preview "large", max-snippet

### Open Graph & Social — `src/app/layout.tsx`
- [x] og:type: `website`
- [x] og:title: `Get to the Movie! — What's Your Arnold?`
- [x] og:description (personality quiz angle)
- [x] og:image: `/og-image.png` (1200x630px)
- [x] twitter:card: `summary_large_image`
- [x] twitter:title (matches OG title)
- [x] twitter:creator: `@iamjarl`

### Structured Data (JSON-LD) — `src/app/page.tsx`
- [x] `@graph` stacking with 3 schema types:
  - `WebApplication` — name, description, URL, category, free offer, creator (Person)
  - `ItemList` — Top 5 Arnold movies (Terminator, Predator, Total Recall, T2, True Lies)
  - `FAQPage` — 4 questions matching the on-page FAQ section

### On-Page SEO Content — `src/app/page.tsx`
- [x] H1: "GET TO THE MOVIE!" (hero section)
- [x] H2: "How It Works" — 3-step explainer with crawlable text
- [x] H2: "Your Recommendations" — shown after quiz completion
- [x] H2: "Frequently Asked Questions" — 5 FAQs in `<details>` elements
- [x] Footer with TMDB attribution (required by TMDB ToS)
- [x] Footer with cross-link to iamjarl.com
- [x] Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<details>`

### Technical SEO
- [x] `public/robots.txt` — allows all crawlers + explicit AI bot rules (GPTBot, ClaudeBot, PerplexityBot, etc.)
- [x] `public/llms.txt` — structured summary for AI/LLM indexing
- [x] `src/app/sitemap.ts` — auto-generated sitemap with `force-static` export
- [x] Static export via `next.config.ts` (`output: 'export'`) — excellent Core Web Vitals
- [x] Image alt text on all images (movie posters include title + year)
- [x] ARIA labels on interactive elements (buttons)

### Icons & Branding — `src/app/layout.tsx`
- [x] `favicon.ico`
- [x] Icon sizes: 16x16, 32x32, 180x180
- [x] Apple touch icon configured

### Analytics — `src/app/layout.tsx` + `src/lib/umami.ts`
- [x] Umami analytics (self-hosted at umami-iamjarl.vercel.app)
- [x] Event tracking: quiz_started, quiz_completed, quiz_reset, recommendations_received, etc.

---

## Not Yet Implemented

### Search Engine Verification
- [x] Google Search Console — domænet er registreret
- [ ] Bing Webmaster Tools verification

### Performance Monitoring
- [ ] Core Web Vitals monitoring (LCP, CLS, FID)
- [ ] Lighthouse CI: maintain >90 performance score

### Phase 2 Content
- [ ] `/movies` page — complete Arnold filmography with ratings, synopsis, internal links
- [ ] `/about` page — quiz story + cross-links to iamjarl.com ecosystem
- [ ] Social sharing CTA on results page (pre-filled tweet)
- [ ] "Top Arnold Movies" table on homepage
- [ ] Internal linking between pages (Quiz → Movies → About)

### Cross-linking (done)
- [x] Footer nav with links to EmotionWave, Made by Human, BeerTuner, iamjarl.com

---

## Validation Tools

| Tool | URL |
|------|-----|
| Google Rich Results Test | https://search.google.com/test/rich-results |
| Schema.org Validator | https://validator.schema.org/ |
| Facebook Sharing Debugger | https://developers.facebook.com/tools/debug/ |
| Twitter Card Validator | https://cards-dev.twitter.com/validator |
| Google PageSpeed Insights | https://pagespeed.web.dev/ |

---

## File Map

| SEO Feature | File |
|-------------|------|
| Meta tags, OG, Twitter | `src/app/layout.tsx` |
| JSON-LD structured data | `src/app/page.tsx` (structuredData const) |
| FAQ section (on-page) | `src/app/page.tsx` (FAQ section near bottom) |
| How It Works (on-page) | `src/app/page.tsx` (How It Works section) |
| Footer + TMDB attribution | `src/app/page.tsx` (footer element) |
| robots.txt (with AI bot rules) | `public/robots.txt` |
| llms.txt (AI/LLM summary) | `public/llms.txt` |
| Sitemap | `src/app/sitemap.ts` |
| OG image | `public/og-image.png` |
| Analytics tracking | `src/lib/umami.ts` |
| Static export config | `next.config.ts` |

# Get to the Movie!

An Arnold Schwarzenegger movie recommendation quiz. Answer 4 personality-driven questions and get 1–3 personalized movie recommendations with over-the-top Arnold-style commentary.

**Live:** https://gettothemovie.iamjarl.com  
**Author:** [Jarl Lyng](https://iamjarl.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + IAMJARL Design System tokens |
| Components | shadcn/ui (Radix UI-based) |
| Icons | Phosphor React |
| Movie data | TMDB API v3 (client-side) |
| Analytics | Umami (self-hosted) |
| Hosting | GitHub Pages (custom domain) |
| CI/CD | GitHub Actions |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, OG tags, analytics
│   ├── page.tsx            # Main page: quiz, results, FAQ, How It Works, footer
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── globals.css         # Tailwind + IAMJARL design tokens (CSS variables)
├── components/
│   ├── Quiz/
│   │   ├── QuizForm.tsx    # 4-step quiz with progress indicator
│   │   └── QuizQuestion.tsx
│   ├── Result/
│   │   ├── ResultList.tsx  # Movie recommendation list
│   │   └── MovieCard.tsx   # Single movie card with Arnold comment
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── tmdb-client.ts      # TMDB API integration + recommendation logic
│   ├── arnold-comments.ts  # Arnold-style commentary generator
│   ├── umami.ts            # Analytics event tracking
│   ├── design-tokens.ts    # IAMJARL Design System tokens (TypeScript)
│   └── utils.ts
└── types/
    └── quiz.ts             # Domain types (QuizState, RecommendedMovie, etc.)

public/
├── robots.txt              # SEO: crawler directives
├── og-image.png            # Open Graph image (1200x630)
├── favicon.ico
└── icon-*.png, apple-touch-icon.png
```

---

## Quiz Flow

Users answer 4 questions:

1. **Brain Level** — "How much brain do you have left today?" (low / medium / high)
2. **Energy Level** — "How much explosion in your evening?" (low / medium / high)
3. **Era** — Movie release era (80s / 90s / modern / any)
4. **Mood** — Tone preference (funny / action / dark)

The recommendation engine:
- Fetches Arnold Schwarzenegger movies from TMDB (cast ID 1100)
- Filters by era and genre based on mood
- Scores by vote_average + popularity weighted by energy and brain level
- Returns 1–3 movies with Arnold-style commentary
- Falls back to hardcoded Arnold movie IDs if the API fails

---

## SEO & Structured Data

The site has comprehensive SEO implementation. See these docs for details:

| Document | Purpose |
|----------|---------|
| [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) | What's implemented, with file paths for each feature |
| [SEO_STRATEGY.md](./SEO_STRATEGY.md) | Full SEO/GEO strategy: keywords, content plan, distribution, roadmap |

### Key SEO features
- JSON-LD `@graph` stacking: WebApplication + ItemList + FAQPage
- Open Graph + Twitter Card tags with custom OG image
- "How It Works" + FAQ sections for crawlable text content
- TMDB attribution in footer (required by TMDB ToS)
- Auto-generated sitemap + robots.txt
- Umami analytics with quiz event tracking

---

## Design System

Uses the **IAMJARL Design System** with CSS custom properties:

- **Dark mode** enabled by default (`className="dark"` on `<html>`)
- **Primary color:** `#D0FF00` (lime green) in dark mode
- **Background:** `#000000` / **Text:** `#FFFFFF`
- **Typography:** system-ui (platform native fonts)
- **Tokens** defined in `src/app/globals.css` and `src/lib/design-tokens.ts`

---

## Development

### Prerequisites
- Node.js 20+
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your TMDB API key:
# NEXT_PUBLIC_TMDB_API_KEY=your_key_here
npm run dev
```

App runs at http://localhost:3000.

### Build

```bash
npm run build
```

Produces a static export in `out/` directory.

---

## Deployment

Deployed via **GitHub Actions** to **GitHub Pages** with custom domain.

- **Workflow:** `.github/workflows/deploy.yml`
- **Trigger:** Push to `main` branch or manual dispatch
- **Domain:** `gettothemovie.iamjarl.com` (CNAME configured)
- **Secrets required:** `TMDB_API_KEY` in GitHub repository secrets

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Yes | TMDB API v3 key (exposed in client bundle — acceptable for read-only keys) |
| `NEXT_PUBLIC_SITE_URL` | No | Defaults to `https://gettothemovie.iamjarl.com` |
| `NEXT_PUBLIC_BASE_PATH` | No | Empty for custom domain deployment |

---

## Related Projects

- [iamjarl.com](https://iamjarl.com) — Portfolio hub
- [madebyhuman.iamjarl.com](https://madebyhuman.iamjarl.com) — AI transparency badge
- [emotionwave.iamjarl.com](https://emotionwave.iamjarl.com) — AI-powered entertainment

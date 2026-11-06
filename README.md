# Get to the Movie!

[![Co-created with AI](https://madebyhuman.iamjarl.com/badges/co-created-white.svg)](https://madebyhuman.iamjarl.com)

A quiz that tells you which Arnold Schwarzenegger you are. You answer 7 questions, get matched to one of six Arnold personas, and get up to three of his films that fit that persona, each with a line of over-the-top Arnold commentary.

**Live:** https://gettothemovie.iamjarl.com
**Made by:** [Jarl](https://iamjarl.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 with IAMJARL design tokens |
| Components | shadcn/ui (Radix UI based) |
| Icons | Phosphor React |
| Movie data | TMDB API v3 (client side) |
| Share images | `next/og`, rendered at build time |
| Analytics | Umami (self-hosted) |
| Hosting | GitHub Pages (custom domain) |
| CI/CD | GitHub Actions |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout, metadata, OG tags, analytics
│   ├── page.tsx                 # Main page: quiz, results, How It Works, personas, FAQ, footer
│   ├── sitemap.ts               # Sitemap, including the share pages
│   ├── globals.css              # Tailwind, design tokens and animations
│   └── share/[persona]/
│       ├── page.tsx             # Share landing page per persona, with its own OG tags
│       └── card.png/route.tsx   # 1200x630 share card per persona, prerendered at build
├── components/
│   ├── AnalysisSequence.tsx     # Terminal-style scan shown while the result loads
│   ├── ChoppaRain.tsx           # Easter egg
│   ├── Quiz/
│   │   ├── QuizForm.tsx         # 7-step quiz with progress bar and keyboard shortcuts
│   │   └── QuizQuestion.tsx
│   ├── Result/
│   │   ├── PersonaCard.tsx      # Persona reveal, attribute bars and share button
│   │   ├── ResultList.tsx       # Movie list
│   │   └── MovieCard.tsx        # One movie with its Arnold comment
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── personas.ts              # The six personas, their films and the matching logic
│   ├── tmdb-client.ts           # Fetches the persona's films from TMDB and ranks them
│   ├── arnold-comments.ts       # Arnold-style comment per film
│   ├── share-card.tsx           # Renders the share card image
│   ├── umami.ts                 # Analytics events
│   └── utils.ts
└── types/
    ├── persona.ts               # Persona and PersonaStats
    └── quiz.ts                  # QuizState, PersonaMatch, RecommendedMovie

public/
├── robots.txt
├── llms.txt
├── og-image.png                 # Default Open Graph image (1200x630)
└── icon-*.png, apple-touch-icon.png
```

---

## How the quiz works

The quiz asks about brain level, energy, era, mood, decision style, workout vibe and catchphrase energy. Each persona has a signature that weights some of those answers, and the persona with the highest total wins. The result also shows the runner-up, how close the match is as a percentage of that persona's best possible score, and the answers that decided it.

The six personas are Terminator, Commando, Kindergarten Cop, Total Recall, True Lies and Mr. Freeze. Each one has a short hand-picked list of TMDB movie IDs in `personas.ts`. The app fetches those films from TMDB, puts the ones from your preferred era first, sorts by rating within that, and shows up to three. There is no search across Arnold's whole filmography.

Matching runs locally before anything is fetched, so if TMDB fails you still see your persona, with a note that the movie list could not load.

A few smaller things. While the result loads, a terminal-style scan plays. The quiz moves to the next question once you answer, and the number keys and arrow keys work too. The share button opens your device's share sheet, or copies the link if there is none, and the link goes to a page for your persona with its own preview image. Clicking the title three times starts an easter egg.

---

## SEO and structured data

The main page carries JSON-LD in one `@graph` with WebApplication, ItemList (the personas) and FAQPage. There are Open Graph and Twitter Card tags, and each share page has its own. The How It Works, persona and FAQ sections give crawlers real text to read. TMDB is credited in the footer, as their terms require. The sitemap and `robots.txt` are generated at build time.

---

## Design

The site is dark only. Colours, radii and animations live as CSS custom properties in `src/app/globals.css`. The primary colour is red (`#FF2A2A`) on a near-black background (`#050505`). Headings use Outfit and body text uses Inter, both loaded with `next/font`.

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

The app runs at http://localhost:3000. Without an API key the quiz still works and shows your persona, but the movie list will not load.

### Build

```bash
npm run build
```

With `NEXT_PUBLIC_BASE_PATH` set (an empty string is fine), the build is a static export in `out/`, which is what the deploy workflow does. The build needs network access, because it downloads fonts.

---

## Deployment

GitHub Actions builds the site and deploys it to GitHub Pages on every push to `main`, or by hand from the Actions tab. The workflow is `.github/workflows/deploy.yml`, the domain is `gettothemovie.iamjarl.com`, and the TMDB key comes from the `TMDB_API_KEY` repository secret.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Yes | TMDB API v3 key. It ends up in the client bundle, which is fine for a read-only key. |
| `NEXT_PUBLIC_SITE_URL` | No | Defaults to `https://gettothemovie.iamjarl.com` |
| `NEXT_PUBLIC_BASE_PATH` | No | Turns on static export. Empty for the custom domain. |

---

## Related Projects

- [iamjarl.com](https://iamjarl.com): the portfolio hub
- [madebyhuman.iamjarl.com](https://madebyhuman.iamjarl.com): a badge for saying how much AI went into a project
- [emotionwave.iamjarl.com](https://emotionwave.iamjarl.com): a live visualisation of sentiment

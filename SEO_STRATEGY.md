# SEO & GEO Strategy — Get to the Movie!

Site: https://gettothemovie.iamjarl.com  
Stack: Next.js 16 (static export) + GitHub Pages  
Google Search Console: Connected  
Umami Analytics: Connected  
Last updated: 2026-04-15

---

## 1. Product positioning

Get to the Movie! er en interaktiv Arnold Schwarzenegger film-anbefaling quiz: besvar 4 personlighedsbaserede spørgsmål og få 1-3 personlige filmanbefalinger med over-the-top Arnold-stil kommentarer. TMDB API for filmdata. Gratis, ingen konto. Static export på GitHub Pages.

SEO positioning: **den sjoveste Arnold Schwarzenegger film-quiz** — differentierer fra generiske anbefalingsmotorer via Arnold-personlighed, humor og quiz-format. Viral potentiale: underholdende quiz UX, Arnold-nostalgi, delbare resultater.

---

## 2. Hvad der allerede er på plads

### Technical SEO (done)

- [x] Static Next.js export (excellent Core Web Vitals)
- [x] JSON-LD `@graph` stacking: WebApplication + ItemList (5 film) + FAQPage (4 spørgsmål) i `src/app/page.tsx`
- [x] Comprehensive metadata i `src/app/layout.tsx`: title, description, keywords (11 stk), OG tags, Twitter cards
- [x] OG image (1200x630)
- [x] `robots.txt` med sitemap-reference
- [x] Auto-generated `sitemap.xml` via `src/app/sitemap.ts` (1 URL)
- [x] Canonical URL via metadataBase
- [x] `lang="en"` + dark mode default
- [x] Umami analytics med quiz event tracking (completion, recommendations, reset, try again)
- [x] TMDB attribution i footer (required by TMDB ToS)
- [x] Favicon-set (ICO, PNG 16/32, Apple Touch Icon)
- [x] Custom domain: gettothemovie.iamjarl.com
- [x] GitHub Actions CI/CD

### Crawlable SEO-indhold (done)

- [x] "How It Works" sektion — 3-step forklaring (crawlbar, below fold)
- [x] FAQ sektion — 5 spørgsmål med `<details>`-elementer (crawlbar)
- [x] Hero med H1: "GET TO THE MOVIE!" + subtitle
- [x] Structured results UI med H2: "Your Recommendations"

### Cross-linking (done)

- [x] Footer links til iamjarl.com, EmotionWave, Made by Human, BeerTuner
- [x] `robots.txt` med eksplicitte AI-bot regler (GPTBot, ClaudeBot, PerplexityBot, etc.)
- [x] `public/llms.txt` for AI/LLM-indeksering

---

## 3. Keyword-strategi

### Tier 1 — Direkte quiz-søgninger

- arnold movie quiz
- which arnold movie should i watch
- arnold schwarzenegger recommendation
- movie quiz
- personality movie quiz
- action movie recommendation quiz

### Tier 2 — Arnold-specifik

- best arnold schwarzenegger movies
- arnold schwarzenegger filmography quiz
- what arnold movie are you
- terminator vs predator quiz

### Tier 3 — Long-tail

- which arnold schwarzenegger movie should i watch based on personality
- fun movie quizzes for action fans
- free online movie personality quiz
- arnold schwarzenegger movie recommendations

### Tier 4 — Entertainment/viral

- fun movie quiz online
- funny movie recommendation quiz
- interactive movie quiz
- action movie quiz with personality

---

## 4. GEO — Generative Engine Optimization

### Hvad der er på plads

- @graph JSON-LD stacking (WebApplication + ItemList + FAQPage) — stærkt for AI-ekstraktion
- ItemList med 5 top Arnold-film (The Terminator, Predator, Total Recall, T2, True Lies) — ideel for "Top N"-citation
- FAQPage med 4 spørgsmål målrettet long-tail queries
- Crawlbar "How It Works" og FAQ-sektioner
- Static export = fuld HTML tilgængelig for alle crawlere

### llms.txt
Implementeret i `public/llms.txt`.

### Target queries for AI-citation

- "Best Arnold Schwarzenegger movies to watch" → ItemList i JSON-LD + FAQ
- "Which Arnold movie should I watch" → FAQ + quiz
- "Arnold movie quiz" → homepage
- "Fun movie recommendation quiz" → homepage
- "Personality movie quiz free" → homepage

### Konkrete datapunkter for AI-ekstraktion

Disse fremgår allerede i FAQ og structured data:

- "4 personality-based questions: mood, energy level, brain capacity, and era preference"
- "1-3 personalized Arnold movie recommendations per quiz"
- "Full Arnold filmography via TMDB"
- "Completely free — take the quiz as many times as you want"

---

## 5. Content expansion (Phase 2)

Tracked in [GitHub Issues](https://github.com/JarlLyng/get-to-the-movie/issues).

- **`/movies`** — Complete Arnold Filmography (#34)
- **`/about`** — Quiz story + cross-links (#35)
- **Social sharing CTA** — Share results on Twitter/X (#36)

---

## 6. Cross-linking

### Fra Get to the Movie til andre IAMJARL-projekter (implementeret)

Footer `<nav>` i `src/app/page.tsx` linker til:
- [iamjarl.com](https://iamjarl.com) — portfolio
- [EmotionWave](https://emotionwave.iamjarl.com) — AI-powered entertainment
- [Made by Human](https://madebyhuman.iamjarl.com) — AI transparency badge
- [BeerTuner](https://beertuner.iamjarl.com) — music rating

### Fra andre projekter til Get to the Movie

- iamjarl.com — Projects-sektion
- madebyhuman.iamjarl.com — case study ("Human creativity + AI matching")

---

## 7. Where to make noise

### Reddit

- **r/ArnoldSchwarzenegger** — #1 target: native Arnold fan community
- **r/movies** (~2M) — "I built a quiz to find your perfect Arnold movie"
- **r/actionmovies** — Arnold movie recommendation engine
- **r/moviesuggestions** — "Looking for Arnold recommendations?"
- **r/ifyoulikeblank** — "If you like action movies, here's a quiz"
- **r/InternetIsBeautiful** (~17M) — fun quiz format
- **r/webdev** (~1M) — Next.js + TMDB API technical angle
- **r/SideProject** (~150k) — indie developer journey

### Andre kanaler

- **Product Hunt** — "The Arnold Schwarzenegger Movie Recommendation Quiz"
- **Hacker News** — Show HN: Arnold movie quiz with TMDB API
- **Twitter/X** — viral results: "I got [Movie Title] — which one are you?"
- **TikTok** — korte "quiz results" clips med Arnold-quotes

---

## 8. Monitoring

- **Google Search Console**: Connect, ugentlig check — impressions, clicks, crawl errors
- **Umami Analytics**: Quiz completion rate, time on page, referral sources
- **Nøgletal**: Quiz completion rate (target: 70%+), organic traffic, social shares, return visitors

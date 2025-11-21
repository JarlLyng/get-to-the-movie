This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Get to the Movie! 🎬💪

“Get to the Movie!” is a small, fun **Arnold Schwarzenegger–inspired “what to watch?” web app** built with **Next.js**.

The app asks the user a short quiz in a playful Arnold-voice and then recommends 1–3 movies based on their answers, decorated with over-the-top **Arnold-style commentary**.

This README is written so that an AI assistant (like Cursor) can understand the project goals, scope and architecture and help implement it.

---

## 1. Concept & User Experience

### Elevator pitch

> A silly, over-the-top **movie recommendation app**, where Arnold is your chaotic movie coach.

Instead of klassiske filtre (“genre”, “imdb score”), brugeren svarer på nogle fjollede spørgsmål som:

1. **Brain level** – “Hvor meget hjerne har du tilbage i dag?”  
   - `low` – “Max én catchphrase per scene, tak”  
   - `medium` – “Jeg kan godt følge en nogenlunde plottråd”  
   - `high` – “Jeg er klar til noget der kræver hjerne”

2. **Arnold level** – “Hvor meget Arnold vil du have på skærmen?”  
   - `none` – Ingen Arnold på skærmen, kun som “ånd”  
   - `medium` – Arnold-vibe film (80’er/90’er action, sci-fi, etc.)  
   - `full` – Kun Arnold-film, ellers glem det

3. **Energy level** – “Hvor meget eksplosion i din aften?”  
   - `low` – Langsom / stemningsfuld  
   - `medium` – Blandet tempo  
   - `high` – Helikopter, eksplosioner, skrigende skurke

4. **Era preference**  
   - `80s` – VHS/nostalgi  
   - `90s` – Klassisk blockbuster  
   - `modern` – Nyere film  
   - `any` – Ligeglad

5. **Mood**  
   - `funny` – Comedy / self-aware action  
   - `action` – Ren action / sci-fi  
   - `dark` – Lidt dystert / thriller

På baggrund af disse svar bliver der:
- Bygget en **“movie profile”** (et sæt parametre)
- Kaldt en **film-API** (TMDb) på serveren
- Vist 1–3 anbefalede film med Arnold-kommentarer ovenpå.

---

## 2. Tech Stack

- **Framework**: Next.js (App Router, `app/` directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (eller moderne utility-first CSS – antag Tailwind som default)
- **API-integration**: [TMDb API](https://www.themoviedb.org/documentation/api) for filmdata
- **Runtime**: Server-side route handlers til API-kald

---

## 2.1 UI Libraries (Design System)

This project uses **Tailwind CSS** for layout and styling, combined with **shadcn/ui** for high‑quality, accessible React components.

### Why this setup?

- **Tailwind CSS** gives full creative freedom to build an 80s/Arnold-inspired aesthetic (neon, glow, metal, laser effects).
- **shadcn/ui** provides beautifully designed, headless Radix‑based components such as:
  - Button
  - Card
  - Select
  - Radio Group
  - Skeleton (used for loading states like “Arnold is thinking…”)
  - Dialog / Sheet (optional future features)
- Everything is fully themeable and easily adapted to the Arnold tone of voice.
- Cursor understands this component system extremely well, making development faster.

### Commands for installing shadcn/ui

```bash
npx shadcn-ui init
```

Install commonly used components:

```bash
npx shadcn-ui add button card select radio-group badge skeleton
```

Tailwind CSS is already preconfigured via `create-next-app`, but this project may extend it with a custom Arnold-inspired theme (colors like neon yellow, thermographic red, gunmetal gray, etc.).

---

## 3. Core Features (v1)

### 3.1 Quiz flow

- En enkelt side (`app/page.tsx`) med:
  - Hero / intro (“Get to the Movie!” + Arnold-tone)
  - En multi-step eller single-page quiz med 4–5 spørgsmål (se ovenfor).
  - En “PUMP MY MOVIE!”-knap som sender quiz-svar til en intern API-route.

- Quiz state håndteres på klientsiden, fx:
  ```ts
  export type BrainLevel = 'low' | 'medium' | 'high';
  export type ArnoldLevel = 'none' | 'medium' | 'full';
  export type EnergyLevel = 'low' | 'medium' | 'high';
  export type Era = '80s' | '90s' | 'modern' | 'any';
  export type Mood = 'funny' | 'action' | 'dark';

  export type QuizState = {
    brainLevel: BrainLevel;
    arnoldLevel: ArnoldLevel;
    energy: EnergyLevel;
    era: Era;
    mood: Mood;
  };
  ```

- Når brugeren trykker “PUMP MY MOVIE!”, sendes `QuizState` til en **server-side API route**.

### 3.2 Recommendation engine

Der er to lag i anbefalingen:

1. **Mapping fra quiz → søgeparametre til TMDb**  
   Eksempel (pseudo):

   - `arnoldLevel = 'full'`  
     - Begræns søgning til kendte Arnold-film (enten via hårdkodet liste med TMDb IDs eller søgning på “Arnold Schwarzenegger” som cast).
   - `era = '80s'`  
     - Begræns `primary_release_date` til 1980–1989.
   - `mood = 'action'` + `energy = 'high'`
     - Brug genrer som “Action”, “Adventure”, “Sci-Fi”, sorteret efter popularity eller vote_average.

   Resultat: et sæt parametre til TMDb Discover / Search endpoint.

2. **Arnold-commentary layer**  
   Når en film er valgt, genereres en sjov kommentar baseret på quizprofilen + filmens metadata:

   Eksempel:
   ```ts
   type ArnoldCommentContext = {
     quiz: QuizState;
     movieTitle: string;
     year: number;
     voteAverage?: number;
   };

   function getArnoldComment(ctx: ArnoldCommentContext): string {
     // Return a short string like:
     // "BRAIN OFF. EXPLOSIONS ON. WATCH \"PREDATOR\" NOW."
   }
   ```

### 3.3 API route

Brug App Router route handlers, fx:

- `app/api/recommend/route.ts`

Ansvar:
- Modtage `QuizState` (POST body)
- Mappe quiz → TMDb query
- Kald TMDb (med `fetch`) på serveren
- Vælge 1–3 film
- Returnere JSON til klienten

Pseudo-type for respons:

```ts
export type RecommendedMovie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseYear: number | null;
  arnoldComment: string;
};

export type RecommendResponse = {
  movies: RecommendedMovie[];
};
```

---

## 4. TMDb API Integration

Vi bruger TMDb til at hente faktiske filmdata (titel, poster, år, osv.).

### 4.1 Environment variables

I `.env.local` (oprettes lokalt, ikke committed):

```bash
TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
```

I koden bruges det kun på server-side:

```ts
const TMDB_API_KEY = process.env.TMDB_API_KEY;
```

### 4.2 Eksempel på server-kald (pseudo)

```ts
const url = new URL('https://api.themoviedb.org/3/discover/movie');
url.searchParams.set('api_key', TMDB_API_KEY!);
url.searchParams.set('include_adult', 'false');
url.searchParams.set('language', 'en-US');
// Additional params derived from quiz: with_cast, primary_release_date.lte/gte, with_genres, sort_by, etc.

const res = await fetch(url.toString());
const data = await res.json();
```

For Arnold-specifikt niveau `full` kan vi:
- enten bruge `with_cast` med Arnold’s person ID, eller
- bruge en hårdkodet liste med Arnold-film IDs, og slå dem op enkeltvis.

---

## 5. UI & Styling

Målet er et **fjollet, men relativt clean UI**:

- Mørk baggrund, lidt “laser/gym/80s”-vibes.
- En tydelig quiz med ikoner/emojis.
- Resultatside:
  - Stor anbefalet film-card
  - Poster-billede (fra TMDb’s image base URL)
  - Titel, år, kort beskrivelse
  - Et badge med fx “BRAIN OFF”, “NOSTALGIA MAX”, “HIGH EXPLOSIONS”
  - Arnold-quote øverst.

Forslag til komponentstruktur:

- `components/Layout.tsx` – generel layout/ramme
- `components/Quiz/QuizForm.tsx` – quiz flow
- `components/Quiz/QuizQuestion.tsx` – enkel question-komponent
- `components/Result/ResultList.tsx` – liste med anbefalede film
- `components/Result/MovieCard.tsx` – enkelt filmcard med Arnold-kommentar

---

## 6. Roadmap / Versions

### v1 (MVP)

- [ ] Single-page quiz med 4–5 spørgsmål
- [ ] `QuizState`-model i TypeScript
- [ ] `app/api/recommend/route.ts` med TMDb integration
- [ ] 1–3 anbefalede film returneres
- [ ] Simpel UI med Tailwind (eller tilsvarende)
- [ ] Arnold-commentary funktion der genererer en sætning pr. film

### v2 (Nice to have)

- [ ] “Not pumped enough – give me another” knap (nyt kald med samme quizprofil)
- [ ] Mulighed for at kopiere et “Arnold-anbefaling”-citat (copy to clipboard)
- [ ] Loading-states med “Arnold is thinking…”-tekster
- [ ] Flere quizspørgsmål / finere-grained kategorier
- [ ] Mulighed for at låse app’en til “kun Arnold-film” mode

---

## 7. Getting Started (Dev)

Standard Next.js workflow:

```bash
npm install
npm run dev
# eller
yarn
yarn dev
```

- App kører på `http://localhost:3000`
- Hovedindgang: `app/page.tsx`
- API route: `app/api/recommend/route.ts`

Husk at oprette `.env.local` med `TMDB_API_KEY` før API-kald bygges.

---

## 8. Kort til AI-assistent (Cursor)

**Formål:**  
Byg en Next.js app med ovenstående quiz-flow, en server-side anbefalings-API integreret med TMDb, og et fjollet, Arnold-inspireret UI. Fokus er på:

- Klar og typed domænemodel (`QuizState`, `RecommendedMovie`)
- Ren komponentstruktur
- Robust API-integration (fejlhåndtering, tomme resultater)
- En legende tone i UI-tekster og Arnold-kommentarer.

---

## 9. Deployment on GitHub Pages

This project is configured for deployment on **GitHub Pages**.

### Setup:
- ✅ GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- ✅ Next.js configured with `output: "export"` and `basePath: "/get-to-the-movie"`
- ✅ Static export generates files in `out/` directory
- ✅ TMDb API calls moved to client-side for static hosting compatibility

### GitHub Secrets:
For GitHub Actions to build the site, add the TMDb API key as a GitHub Secret:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add a new secret named `TMDB_API_KEY` with value: `25403f33a1a8dab99f0a469ddc0fa699`

### Hosting:
The site will be publicly hosted at:
```
https://jarllyng.github.io/get-to-the-movie
```

### Local Development:
For local development, create `.env.local` with:
```
NEXT_PUBLIC_TMDB_API_KEY=25403f33a1a8dab99f0a469ddc0fa699
```

**Note:** With static export, the API key will be included in the client bundle. This is acceptable for TMDb read-only API keys, but be aware that the key will be visible in the browser.

---

## 10. TMDb API Keys

The project uses the following TMDb keys (do **not** commit them to GitHub):

Your keys:
- **API Read Access Token (v4)**: `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTQwM2YzM2ExYThkYWI5OWYwYTQ2OWRkYzBmYTY5OSIsIm5iZiI6MTc2Mzc2ODExMi43MTUwMDAyLCJzdWIiOiI2OTIwZjczMDg3NjA2MGIxYzYwNTkwMzIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.klQUrXnq6fyT6-lKKSllIn_I0MOeN1x5zAcQC8KwQHQ`
- **API Key (v3)**: `25403f33a1a8dab99f0a469ddc0fa699`

Add to `.env.local` for local development:
```
NEXT_PUBLIC_TMDB_API_KEY=25403f33a1a8dab99f0a469ddc0fa699
```

**Important:**  
- For local development: Add to `.env.local` (not committed to git)
- For GitHub Pages: Add `TMDB_API_KEY` as a GitHub Secret (see section 9)
- **Note:** With static export, the API key will be visible in the client bundle. This is acceptable for TMDb read-only keys, but be aware of this limitation.
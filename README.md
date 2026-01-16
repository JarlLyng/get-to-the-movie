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

# Get to the Movie!

“Get to the Movie!” is a small, fun **Arnold Schwarzenegger–inspired “what to watch?” web app** built with **Next.js**.

The app asks the user a short quiz in a playful Arnold-voice and then recommends 1–3 movies based on their answers, decorated with over-the-top **Arnold-style commentary**.

This README is written so that an AI assistant (like Cursor) can understand the project goals, scope and architecture and help implement it.

---

## 1. Concept & User Experience

### Elevator pitch

> A silly, over-the-top **movie recommendation app**, where Arnold is your chaotic movie coach.

Instead of classic filters ("genre", "imdb score"), the user answers some silly questions like:

1. **Brain level** – "How much brain do you have left today?"  
   - `low` – "Max one catchphrase per scene, please"  
   - `medium` – "I can follow a decent plot thread"  
   - `high` – "I'm ready for something that requires brain power"

2. **Energy level** – "How much explosion in your evening?"  
   - `low` – Slow / atmospheric  
   - `medium` – Mixed tempo  
   - `high` – Helicopters, explosions, screaming villains

3. **Era preference**  
   - `80s` – VHS / nostalgia  
   - `90s` – Classic blockbuster  
   - `modern` – Newer films  
   - `any` – Don't care

4. **Mood**  
   - `funny` – Comedy / self-aware action  
   - `action` – Pure action / sci-fi  
   - `dark` – A bit dark / thriller

**Important:** The app **only recommends Arnold Schwarzenegger movies**. All recommendations are filtered to include only films where Arnold appears.

Based on these answers:
- A **"movie profile"** is built (a set of parameters)
- The **movie API** (TMDb) is called on the client-side
- 1–3 recommended Arnold movies are shown with Arnold-style commentary.

---

## 2. Tech Stack

- **Framework**: Next.js (App Router, `app/` directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (modern utility-first CSS)
- **API-integration**: [TMDb API](https://www.themoviedb.org/documentation/api) for movie data
- **Runtime**: Client-side API calls (static export compatible)

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

- A single page (`app/page.tsx`) with:
  - Hero / intro ("Get to the Movie!" + Arnold-tone)
  - A single-page quiz with 4 questions (see above).
  - A "PUMP MY MOVIE!" button that sends quiz answers to a client-side function.

- Quiz state is handled on the client-side:
  ```ts
  export type BrainLevel = 'low' | 'medium' | 'high';
  export type ArnoldLevel = 'full'; // Always 'full' - only Arnold movies
  export type EnergyLevel = 'low' | 'medium' | 'high';
  export type Era = '80s' | '90s' | 'modern' | 'any';
  export type Mood = 'funny' | 'action' | 'dark';

  export type QuizState = {
    brainLevel: BrainLevel;
    arnoldLevel: ArnoldLevel; // Always 'full'
    energy: EnergyLevel;
    era: Era;
    mood: Mood;
  };
  ```

- When the user clicks "PUMP MY MOVIE!", `QuizState` is sent to a **client-side function** that fetches Arnold movies from TMDb.

### 3.2 Recommendation engine

There are two layers in the recommendation:

1. **Fetching Arnold movies from TMDb**  
   The app always fetches Arnold Schwarzenegger movies:
   - Uses TMDb cast search with Arnold's person ID (1100)
   - Falls back to a hardcoded list of known Arnold movie IDs if needed
   - Applies era filtering if specified (80s, 90s, modern)
   - Selects 1-3 movies based on quiz preferences (brain level, energy, mood)

2. **Arnold-commentary layer**  
   When a movie is selected, a fun comment is generated based on the quiz profile + movie metadata:

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

### 3.3 Client-side API function

Uses a client-side function:

- `src/lib/tmdb-client.ts`

Responsibilities:
- Receive `QuizState` as parameter
- Fetch Arnold movies from TMDb API (client-side)
- Apply era filtering if specified
- Select 1–3 movies based on preferences
- Return array of recommended movies

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

We use TMDb to fetch actual movie data (title, poster, year, etc.).

### 4.1 Environment variables

In `.env.local` (created locally, not committed):

```bash
NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
```

In the code, it's used client-side:

```ts
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'default_key';
```

### 4.2 Client-side API call example

```ts
const url = new URL('https://api.themoviedb.org/3/discover/movie');
url.searchParams.set('api_key', apiKey);
url.searchParams.set('with_cast', '1100'); // Arnold's person ID
url.searchParams.set('include_adult', 'false');
url.searchParams.set('language', 'en-US');

const res = await fetch(url.toString());
const data = await res.json();
```

For Arnold movies, we:
- Use `with_cast` with Arnold's person ID (1100), or
- Use a hardcoded list of Arnold movie IDs and fetch them individually as fallback.

---

## 5. UI & Styling

The goal is a **silly, but relatively clean UI**:

- Dark background, a bit of "laser/gym/80s" vibes.
- A clear quiz with icons/emojis.
- Results page:
  - Large recommended movie card
  - Poster image (from TMDb's image base URL)
  - Title, year, short description
  - Arnold-style quote at the top

Component structure:

- `components/Quiz/QuizForm.tsx` – quiz flow
- `components/Quiz/QuizQuestion.tsx` – single question component
- `components/Result/ResultList.tsx` – list of recommended movies
- `components/Result/MovieCard.tsx` – single movie card with Arnold comment

---

## 6. Roadmap / Versions

### v1 (MVP)

- [x] Single-page quiz with 4 questions
- [x] `QuizState` model in TypeScript
- [x] Client-side TMDb integration (`src/lib/tmdb-client.ts`)
- [x] 1–3 recommended Arnold movies returned
- [x] Simple UI with Tailwind CSS
- [x] Arnold-commentary function that generates a sentence per movie
- [x] Only Arnold movies are recommended

### v2 (Nice to have)

- [ ] "Not pumped enough – give me another" button (new call with same quiz profile)
- [ ] Ability to copy an "Arnold-recommendation" quote (copy to clipboard)
- [x] Loading states with "Arnold is thinking…" text
- [ ] More quiz questions / finer-grained categories

---

## 7. Getting Started (Dev)

Standard Next.js workflow:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

- App runs on `http://localhost:3000`
- Main entry: `app/page.tsx`
- Client-side API function: `src/lib/tmdb-client.ts`

Remember to create `.env.local` with `NEXT_PUBLIC_TMDB_API_KEY` before building.

---

## 8. Notes for AI Assistant (Cursor)

**Purpose:**  
Build a Next.js app with the above quiz flow, a client-side recommendation function integrated with TMDb, and a silly, Arnold-inspired UI. Focus on:

- Clear and typed domain model (`QuizState`, `RecommendedMovie`)
- Clean component structure
- Robust API integration (error handling, empty results)
- A playful tone in UI texts and Arnold comments.
- **Important:** Only Arnold Schwarzenegger movies should be recommended.

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
2. Add a new secret named `TMDB_API_KEY` with your TMDb API key value

### Hosting:
The site is publicly hosted at:
```
https://gettothemovie.iamjarl.com
```

The site is deployed via GitHub Pages with a custom domain.

### Local Development:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your TMDb API key:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```

**⚠️ Important Security Note:**  
With static export, the `NEXT_PUBLIC_TMDB_API_KEY` will be included in the client-side JavaScript bundle and will be visible in the browser. This is acceptable for TMDb read-only API keys, but:
- Never commit `.env.local` to git (it's in `.gitignore`)
- Consider rate limiting on your TMDb API key
- Monitor your API usage in TMDb dashboard
- Rotate your API key if it's exposed or compromised

---

## 10. TMDb API Keys

The project requires a TMDb API key to fetch movie data.

**Setup:**
- For local development: Create `.env.local` with:
  ```
  NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
  ```
- For GitHub Pages: Add `TMDB_API_KEY` as a GitHub Secret (see section 9)

**Getting a TMDb API Key:**
1. Sign up at [TMDb](https://www.themoviedb.org/)
2. Go to Settings → API
3. Request an API key (v3)
4. Add it to your `.env.local` file

**Important:**  
- Never commit API keys to git
- With static export, the API key will be visible in the client bundle. This is acceptable for TMDb read-only keys, but be aware of this limitation.
- If your API key is exposed, rotate it immediately in TMDb settings
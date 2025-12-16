# Projektreview – Get to the Movie!

## Fund (ordnet efter alvor)
1. **API-nøgler offentliggjort** – `README.md:330-378` indeholder både TMDb v3 API-nøgle og v4 bearer-token. De er allerede i git-historikken og kan misbruges til misbrug/kvoteforbrug. *Anbefaling:* Fjern nøglerne fra repoet, erstat med placeholders, og rotér både v3- og v4-nøglerne i TMDb samt GitHub Actions-secrets.
2. **Quiz-svar påvirker ikke reelle anbefalinger** – `src/lib/tmdb-client.ts:32-226` ignorerer mood/genre-filtrering og Arnold-niveau: `buildTMDBQuery` dækker genre/era, men bliver aldrig brugt, og `fetchArnoldMovies` henter blot top 10 Arnold-film uanset svar. Resultatet er næsten statiske anbefalinger og brud på “kun Arnold-film + humørfiltrering”-kravet. *Anbefaling:* Brug `buildTMDBQuery` (eller tilsvarende) til at bygge `discover`-kaldet med genre, era, include_adult=false og language, og koble quizfelter direkte til parametre/scorelogik.
3. **Fejltilstand skjules efter submit** – `src/app/page.tsx:91-169` viser resultatlayout, selv når `error` er sat (f.eks. manglende API-key), så brugeren ender med generisk “No movies found” i `ResultList` i stedet for den faktiske fejl. *Anbefaling:* Vise `error`-kortet også i resultatvisningen eller short-circuite renderen, så fejlmeddelelser forbliver synlige efter submit.
4. **Typer vs. UI om Arnold-niveau** – `src/types/quiz.ts:1-10` giver mulighed for `'none' | 'medium' | 'full'`, men `QuizForm` sætter altid `'full'` og UI’et har ingen valg. Det gør data/typer misvisende og kan forvirre fremtidige ændringer. *Anbefaling:* Stram `ArnoldLevel` til den reelt understøttede værdi eller eksponer en kontrolleret UI-indstilling hvis flere niveauer er ønsket.
5. **Død kode og ufuldstændige TMDb-parametre** – `src/lib/tmdb-client.ts:32-77` (ubrugt query-builder) og `TMDB_IMAGE_BASE_URL` er ikke i brug. `fetchArnoldMovies` sætter heller ikke `include_adult` eller `language`, så resultatet kan variere uforudsigeligt. *Anbefaling:* Fjern ubrugte konstanter/funktioner eller tag dem i brug, og tilføj de manglende TMDb-parametre for stabile, sikre resultater.

## Åbne spørgsmål
- Skal anbefalingslogikken kunne returnere ikke-Arnold-film (jf. `ArnoldLevel`) eller er “kun Arnold” et hårdt krav for alle miljøer?
- Skal Umami-scriptet altid loades (prod + preview), eller bør det være konfigurerbart via env for at undgå tracking i lokale builds/tests?
- Hvad er forventet fallback, hvis TMDb er utilgængelig? (Statisk cache af Arnold-film, eller bare fejlbesked?)

## Anbefalede næste skridt
- Rotér og fjern de eksponerede TMDb-nøgler som første handling.
- Refaktor `tmdb-client` til at respektere alle quizfelter og tilføj tests for filtrering/scorelogik.
- Opdater fejlhåndtering i `page.tsx`, så brugeren ser konkrete fejl og kan prøve igen uden at miste kontekst.

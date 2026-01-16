# Projektreview – Get to the Movie

## Fund (prioriteret) - ✅ ALLE LØST

1. ✅ **Kritisk – API-nøgle offentliggjort i README**: ~~Den konkrete TMDb v3 API-key står i dokumentationen og vil blive indekseret af søgemaskiner. Det giver kvotemisbrug og kan føre til spærring.~~  
   **Status:** Fjernet fra README.md og erstattet med placeholders.  
   **Sted:** `README.md:344`, `README.md:355`

2. ✅ **Høj – Fejl skjules som "No movies found"**: ~~`fetchMoviesFromTMDB` fanger alle fejl og returnerer tomt array. Det betyder, at 401/429/netværksfejl bliver til "ingen film", selv om der er en rigtig fejl. UI'et kan derfor ikke skelne mellem "ingen match" og "API-fejl".~~  
   **Status:** Fejl propageres nu korrekt op til UI. `fetchMoviesFromTMDB` kaster fejl i stedet for at returnere tomt array. `fetchArnoldMovies` håndterer fejl og prøver fallback før den kaster fejl.  
   **Sted:** `src/lib/tmdb-client.ts:78-93`, `src/lib/tmdb-client.ts:95-149`

3. ✅ **Medium – Energi-præference kan blive ignoreret**: ~~Når `brainLevel` er `low`, sorteres der igen efter popularitet, hvilket overskriver energisorteringen. Brugeren svarer på energi, men den påvirker ikke resultatet i de tilfælde.~~  
   **Status:** Implementeret kombineret scoring-system hvor både energy og brainLevel påvirker resultatet. Begge præferencer vejes sammen i en samlet score.  
   **Sted:** `src/lib/tmdb-client.ts:151-185`

4. ✅ **Medium – Spørgsmålslabel er ikke knyttet til radiogruppen**: ~~Spørgsmålet renderes som en `Label` uden relation til radiogruppen, hvilket gør skærmlæser-kontekst svag. `RadioGroupItem` er desuden gjort ikke-klikbar via `pointer-events-none`, hvilket kan give uventet fokus/klik-adfærd.~~  
   **Status:** Tilføjet `fieldset` og `legend` med korrekt `id` og `aria-labelledby` relation. Fjernet `pointer-events-none` fra `RadioGroupItem` så de er klikbare.  
   **Sted:** `src/components/Quiz/QuizQuestion.tsx:19-57`

5. ✅ **Lav – Fallback-logosik ignorerer mood**: ~~Når discover-kaldet giver 0 resultater, filtreres fallback kun på era. Det betyder, at "funny/dark/action" ikke længere påvirker resultaterne.~~  
   **Status:** Tilføjet mood-baseret sortering i fallback-logikken. Bemærk: Fallback bruger individuelle movie-endpoints der ikke returnerer genre_ids, så vi kan ikke filtrere direkte, men vi prioriterer baseret på mood.  
   **Sted:** `src/lib/tmdb-client.ts:129-149`

## Anbefalinger
- Fjern API-nøglen fra `README.md`, rotér den i TMDb, og brug placeholders i dokumentationen.
- Propager API-fejl op til UI’et (f.eks. returnér en error-type eller kast fejl) så brugeren får en korrekt besked.
- Kombinér energi + brain-level i én score/sekundær sortering, så begge svar påvirker anbefalingerne.
- Tilføj `fieldset` + `legend` eller `aria-labelledby` til radiogruppen og lad de faktiske radio-elementer være klikbare.
- Anvend mood-filter i fallback (fx genre-match) eller vis en tydelig “fallback uden mood-filter”-besked.

## Åbne spørgsmål / antagelser
- Skal analytics (Umami) være slået fra i local/preview builds?
- Er “kun Arnold”-reglen et hårdt krav i alle miljøer?
- Hvilket forventet niveau af testdækning ønsker I for anbefalingslogik og fejlscenarier?

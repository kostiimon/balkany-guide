# Plan: Interaktywne elementy (tylko desktop)

## Zmiany w `app.ts`
1. Dodać mapowanie miast do tabów:
   ```
   cityNameToTab: Record<string, TabId> = {
     'Tirana': 'city-tirana', 'Sarandë': 'city-sarande',
     'Ohrid': 'city-ohrid', 'Skopje': 'city-skopje',
     'Prisztina': 'city-prishtina', 'Prizren': 'city-prizren',
     'Peć': 'city-pec', 'Kotor': 'city-kotor', 'Podgorica': 'city-podgorica'
   }
   ```
2. Leaflet markery — popup z przyciskiem "Zobacz miasto →" który wywołuje `showTab()` (przez `window.__showTab`)
3. Dodać `countryFirstCity` mapę: al→city-tirana, mk→city-ohrid, ko→city-prishtina, me→city-kotor

## Zmiany w `app.html`
1. **Flagi w topbarze** — rozbić na osobne `<span>` z `(click)="showTab('city-tirana')"` itd, klasa `.tb-flag`
2. **Flagi w masthead** — analogicznie `.mh-flag` z klikami
3. **Route strip** — dodać `(click)="showTab('city-tirana')"` do `.rs-al`, `.rs-mk` itd (nie do transferów)
4. **Legenda mapy** — dodać `(click)` na `.rol` → otwiera pierwszy tab danego kraju
5. **DMC cards** — dodać przycisk "Zobacz miasto →" (`.dmc-link`) w headerze, tylko dla kart z istniejącym tabem (Tirana, Sarandë, Ohrid, Skopje, Prisztina, Prizren, Peć, Kotor, Podgorica)
6. **Country headers w itinerary** — dodać chipy z miastami linkującymi do city tabs

## Zmiany w `app.scss`
1. `.tb-flag` — cursor pointer, hover: scale(1.15), transition
2. `.mh-flag` — cursor pointer, hover glow
3. `.rs` (country) — cursor pointer, hover underline na `.cn`
4. `.rol` — cursor pointer, hover brightness
5. `.dmc-link` — nowy przycisk, pill-shape, kolor wg kraju
6. `.city-chips` — chipy z miastami w country-hdr
7. **Wszystko pod `@media (hover: hover) and (min-width: 769px)`** — desktop only
8. Na mobilce: brak kursorów, brak linków, brak chipów

## Pliki bez zmian
- `app.html` — żadne treści nie ulegają zmianie, tylko dodanie atrybutów interaktywności
- `styles.scss` — bez zmian

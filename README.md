# Asbury Park Postmarks

Collect postcards around Asbury Park. Postmarks confirm visits.

## What this is

A mobile-first postcard collection foundation for Asbury Park, NJ. Final route data, stop copy, hours, coordinates, history notes, websites, and social handles are pending and intentionally represented as `PLACEHOLDER` strings.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Static JSON data layer
- localStorage for postmark state

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Data

All business data lives in `/src/data/`.

- `shops.json` - 15 core stops + 3 directory stops (all copy currently PLACEHOLDER)
- `layers.json` - 7 content layers (coffee, music, vintage, records, books, food, vices)
- `badges.json` - 3 badge tiers (1, 8, 15)
- `trivia.json` - trivia records (needs Asbury-specific content)

## Notes

- Architecture cloned from Old Naples Passport golden master.
- 15 core stops: Bangs Ave (1–4), Main St (5), Cookman Ave (6–13), Boardwalk (14–15).
- Stops 14–15 (Wonder Bar, Stone Pony) are anchor stops with distinct editorial treatment.
- 3 directory stops on Cookman Ave (Antique Emporium, House of Independents, Cookman Creamery).
- Layer-based radio filter with coffee as default.

## Credits

- **OG image:** "Boardwalk and Convention Hall - Asbury Park, New Jersey, USA - October 3, 2023" by Giorgio Galeotti, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Boardwalk_and_Convention_Hall_-_Asbury_Park,_New_Jersey,_USA_-_October_3,_2023.jpg).

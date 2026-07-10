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

- `shops.json` - placeholder postmark, boardwalk bonus, and read-only history layer records
- `layers.json` - layer definitions
- `badges.json` - placeholder badge tiers
- `trivia.json` - placeholder trivia records

## Notes

- Naples remains the golden master for architecture.
- Object Americana is not in the core route.
- Boardwalk is bonus content.
- Springwood / West Side is a read-only history layer placeholder.
- Cedarburg is only a later reference for the two-street schematic and railroad-divider behavior.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Asbury Park Postmarks — Claude Code Project Brief
> John Kean · Peachy Kean DevOps LLC · Asheville, NC
> Last updated: July 10, 2026

## What This Is
Asbury Park Postmarks is a mobile-first digital walking postcard
collection for Asbury Park, NJ. 15 core stops, Bangs Ave to the
Boardwalk, west to east. Users walk the corridor, collect
postmarks at each stop, and finish at the Boardwalk.
No auth, no login, no cookies, no PII. localStorage only.

## Commands

```bash
npm run dev        # Start local dev server at localhost:3000
npm run build      # Production build
npm run lint       # ESLint (Next.js config)
npx tsc --noEmit   # Type-check without emitting (required before finishing any task)
```

No test suite exists. Manual review at localhost:3000 is the test process.

## Live URLs
- Production: asbury-park-postcards.vercel.app (TBD)
- Repo: github.com/juanitok94/asbury-park-postcards (TBD)
- Local: localhost:3000 (npm run dev)

## Tech Stack
- Next.js 16 App Router
- TypeScript (strict)
- Tailwind CSS 4
- localStorage for all user state
- Vercel for deployment (auto-deploy on git push)

## Design Principles — Non-Negotiable
1. Hygge — warmth, slowness, belonging
2. Camino — journey, earned progress, west to east
3. Krug — don't make me think, clarity first
4. Mobile-first — primary user is walking the corridor
   holding a phone. Desktop is graceful enhancement only.
5. Human first — if it feels like a generic app,
   it's wrong. It should feel like Asbury Park.

## Color System — Do Not Change
Defined in globals.css as CSS custom properties:
- Cream background: #F4EBDA (--cream)
- Deep navy: #10222F (--navy)
- Navy mid: #1A3A4A (--navy-mid)
- Rust/coral accent: #E8543F (--gold, legacy name)
- Gold light: #F0A868 (--gold-light)
- Body text: #10222F (--body-text)
- Teal accent: #4FA89B (--teal)

## Typography — Do Not Change
- Playfair Display — headings (font-serif)
- Crimson Pro — body text (font-serif)
- IBM Plex Mono — labels, UI elements (font-mono)

## Two ICPs
1. VISITORS — day-tripping or weekending in Asbury Park,
   want authentic local stops beyond the obvious.
   Respond to discovery, walking, feeling like an insider.
2. BUSINESS OWNERS — independent shop owners on Cookman
   and Bangs who want foot traffic and to feel proud
   of being featured, not marketed at.

## Journey Direction
West to east. Bangs Ave first (stops 1–4), cross Main St
(stop 5), Cookman Ave (stops 6–13), then east to the
Boardwalk (stops 14–15). Convention Hall is the visual
icon for the destination/completion.

## Convention Hall
Symbol of Asbury Park. The Convention Hall silhouette is
the postcard collection's visual hero mark. Its SVG
appears on the passport completion certificate.

## The 15 Core Stops
| # | Shop | Zone | Address | Layers |
|---|------|------|---------|--------|
| 1 | Café Volan | bangs | 510 Bangs Ave | coffee |
| 2 | Object Americana | bangs | 713 Bangs Ave | vintage |
| 3 | Goldrush | bangs | 719 Bangs Ave | coffee |
| 4 | Cardinal Provisions | bangs | 513 Bangs Ave | food |
| 5 | Funky Donkey | main | 404 Main St | vices |
| 6 | Paranormal Books | cookman | 621 Cookman Ave | books |
| 7 | Groovy Graveyard | cookman | 658 Cookman Ave | records |
| 8 | Blackbird Presents | cookman | 651 Cookman Ave | music |
| 9 | Talula's | cookman | 550 Cookman Ave | food |
| 10 | Lola's European Cafe | cookman | 539 Cookman Ave | vices |
| 11 | TAKA | cookman | 660 Cookman Ave | food |
| 12 | Confections of a Rockstar | cookman | 550 Cookman Ave | vices |
| 13 | Asbury Park Brewery | cookman | 614 Cookman Ave | vices |
| 14 | Wonder Bar | boardwalk | 1213 Ocean Ave | music |
| 15 | Stone Pony | boardwalk | 913 Ocean Ave | music |

Stops 14–15 are anchor stops (Wonder Bar, Stone Pony).
Their editorial copy uses ANCHOR_PLACEHOLDER — do not
draft anchor stories without explicit approval.

## Directory Stops
| Shop | Zone | Address | Layers |
|------|------|---------|--------|
| Antique Emporium | cookman | 646 Cookman Ave | vintage |
| House of Independents | cookman | 572 Cookman Ave | music |
| Cookman Creamery | cookman | 711 Cookman Ave | food |

## Seven Content Layers (filter order)
| Layer | Color | Icon |
|-------|-------|------|
| coffee | #6F4E37 | CF |
| music | #E8543F | MU |
| vintage | #4FA89B | VN |
| records | #10222F | RC |
| books | #8B5A3C | BK |
| food | #C4703A | FD |
| vices | #7B4B94 | VC |

Layers are radio-button filters (one active at a time).
Default filter: coffee. Music must follow coffee in order.

## Zone Field Values
| Zone | Description |
|------|-------------|
| `"bangs"` | Bangs Avenue (west, stops 1–4) |
| `"main"` | Main Street crossing (stop 5) |
| `"cookman"` | Cookman Avenue corridor (stops 6–13) |
| `"boardwalk"` | Boardwalk / Ocean Ave (stops 14–15) |

## File Structure
src/
  app/
    page.tsx          — homepage (server component)
    map/page.tsx      — interactive map
    passport/         — postcard collection
    stop/[slug]/      — individual stop pages
  components/
    RouteFilter.tsx   — layer-based filter (client)
  data/
    shops.json        — canonical data, source of truth
    layers.json       — seven content layers
    badges.json       — achievement badges (3)
    trivia.json       — trivia questions per stop
  lib/
    stamps.ts         — localStorage stamp logic

## shops.json Data Shape

Key fields on each shop object:

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | kebab-case slug, used in URL and image paths |
| `passportType` | `"core"` \| `"directory"` | core = numbered passport stop |
| `passportStop` | number \| null | 1–15, west-to-east order; null for directory |
| `zone` | `"bangs"` \| `"main"` \| `"cookman"` \| `"boardwalk"` | which corridor segment |
| `coordinates` | `[lon, lat]` | longitude first (not lat/lon) — currently `[0, 0]` placeholder |
| `selloColor` | hex | per-shop accent color for stamp circles and headers |
| `layers` | string[] | e.g. `["coffee"]` — used for layer filter visibility |
| `hygge` | boolean | hygge-quality stop — do not modify without confirmation |
| `hours` | `{ mon–sun: string, note?: string }` | `"Closed"` for closed days |
| `stamp` | `{ welcomeLine, subLine }` | Shown after stamping on stop page |
| `story` | `{ headline, body, insiderTip?, parkingNote? }` | Editorial content |
| `status` | string | `"placeholder"` or `"confirmed-open"` |
| `instagram` | string | Instagram handle (no @), empty string if unknown |
| `website` | string | URL without protocol, empty string if unknown |

## Client vs. Server components

- `app/page.tsx` — server component (no `'use client'`, no localStorage)
- `app/map/page.tsx` — `'use client'` (uses stamps, useState)
- `app/passport/page.tsx` — `'use client'` (uses stamps, useState)
- `app/stop/[slug]/page.tsx` — `'use client'` (uses stamps, useState)

All stamp reads must be guarded: `lib/stamps.ts` returns `{}` during SSR.
Never call stamp functions outside `useEffect` or client components.

## Standing Rules for Claude Code
1. Always check TypeScript compiles before finishing
   (npx tsc --noEmit)
2. Never modify shops.json stop numbers or core/directory
   status without explicit confirmation from John
3. Never change colors, fonts, or design tokens
4. Mobile-first — test layout at 390px width thinking
5. Always localhost review before git push
6. Commit message format:
   feat: for new features
   fix: for corrections
   refactor: for restructuring
7. Data mapping — when mapping values to shops or stops,
   always verify against the source table above; never
   assume geographic order
8. Truncated messages — if a message appears cut off,
   complete the task based on available context
9. Zero PII — no cookies, no phone numbers, no email
   collection, no analytics that identify users.
   localStorage only. This is a hard constraint.

## Current Build Status (July 10, 2026)
- ✅ Cloned from Naples golden master
- ✅ shops.json rebuilt with 15 core + 3 directory Asbury stops
- ✅ layers.json: 7 content layers (coffee, music, vintage, records, books, food, vices)
- ✅ badges.json: 3 badges retargeted to 15 stops
- ✅ globals.css: Asbury palette in place
- ✅ layout.tsx: metadata updated for Asbury Park
- ✅ map/page.tsx: 4-zone layout, west-to-east, layer filter
- ✅ passport/page.tsx: Convention Hall SVG, 15-stop grid
- ✅ stop/[slug]/page.tsx: zone labels, dynamic stop count
- ✅ stop/[slug]/opengraph-image.tsx: Asbury zones, raw hex for Satori
- ✅ RouteFilter.tsx: layer-based radio filter, coffee default
- ✅ page.tsx: Asbury hero, placeholder body copy
- ✅ PII scaffolding removed (passportApi.ts, usePhone.ts, PhoneModal.tsx)
- ✅ mealtime field stripped from shops.json
- ✅ CLAUDE.md rewritten for Asbury Park
- ⬜ Editorial copy (all stops currently PLACEHOLDER)
- ⬜ Anchor stop copy (Wonder Bar, Stone Pony — ANCHOR_PLACEHOLDER)
- ⬜ Homepage body copy (4 PLACEHOLDERs remain)
- ⬜ trivia.json (needs Asbury-specific content)
- ⬜ Real coordinates for all 18 stops
- ⬜ Real hours for all stops
- ⬜ Shop photos (after photo walk)
- ⬜ GitHub repo creation
- ⬜ Vercel deployment

## Photo Library
Photos location: public/images/shops/
Naming convention: {shop-id}-exterior.jpg, {shop-id}-interior.jpg

## Lab Notes Protocol
When you make a mistake or take a wrong approach, automatically
append a lab note under ## Lab Notes without being asked.
Format: [date] - what failed - why - what to do instead.

## Lab Notes
- 2026-07-09 - usePhone.ts wrote a phone number to a 1-year cookie.
  It was never called, but it's PII scaffolding with placeholder
  privacy copy attached. Naples shipped with zero cookies and zero
  PII, and that's a property worth preserving deliberately rather
  than by accident. If server-side check-ins come back, build them
  fresh with real consent copy.
- 2026-07-09 - Previous session assumed 10 stops (Naples model).
  Asbury Park has 15 core stops. All hardcoded "10" references
  were converted to dynamic coreStops.length.
- 2026-07-09 - Previous session assumed zones were fifth/third/
  design/bay (Naples). Asbury Park zones are bangs/main/cookman/
  boardwalk. All zone references corrected.
- 2026-07-09 - Previous session assumed mealtime-based filtering
  (Naples model). Asbury uses layer-based filtering with 7 content
  layers. RouteFilter.tsx was rewritten accordingly.
- 2026-07-10 - OG image replaced. Source: "Boardwalk and Convention
  Hall - Asbury Park, New Jersey, USA - October 3, 2023" by Giorgio
  Galeotti, CC BY-SA 4.0, via Wikimedia Commons. Cropped to 1200x630,
  quality 85, 194KB. Attribution in README.md Credits section.

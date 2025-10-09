# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A production-ready scoring-based search API for matching people based on their attributes. Implements weighted substring matching across name, music genres, movies, location, and musical artists.

**Core Requirements:**
- Case-insensitive substring matching with weighted scoring
- In-memory dataset management (6 people, 6 music genres)
- Two HTTP endpoints: search and add artist
- Results sorted by score DESC, then name ASC

## Development Commands

```bash
# Development (uses tsx for fast TypeScript execution)
npm run dev

# Production build
npm run build

# Run production build
npm start

# Clean build artifacts
npm run clean

# Run API tests (server must be running)
node test-api.js
```

## Project Architecture

### Module Structure

```
src/
├── main.ts        # Express server + route handlers (/search, /artists)
├── search.ts      # Core search algorithm with weighted scoring
├── artists.ts     # addMusicArtist() function
├── data.ts        # In-memory datasets (PEOPLE, ARTISTS_BY_GENRE)
├── types.ts       # TypeScript type definitions
└── util.ts        # String matching helpers (includesCI, anyIncludes)
```

### Key Architecture Points

**1. Search Algorithm Flow (search.ts:13-72)**
- Iterates through PEOPLE array
- For each person, checks 5 match categories (name, genres, movies, location, artists)
- Uses `includesCI()` for single string matches, `anyIncludes()` for arrays
- Artist matching: dynamically resolves artists based on person's genres
- Critical: Each category counts **at most once** (multiple movie matches = 1 point)
- Sorting: primary by score DESC, secondary by name ASC (case-insensitive)

**2. Data Model**
- `PEOPLE` array: name, genres[], movies[], location (data.ts:3-40)
- `ARTISTS_BY_GENRE` object: genre → artist[] mapping (data.ts:42-49)
- Artist matching requires genre lookup: person.genres → ARTISTS_BY_GENRE[genre] → artists[]

**3. API Layer (main.ts)**
- Uses Express 5.1.0 with JSON middleware
- Validation via Zod (artistSchema for POST /artists)
- Error handling: catches all errors, returns 500 with generic message
- GET /search: query param → search() → JSON response
- POST /artists: validates body → addMusicArtist() → 204 No Content

**4. ES Modules Configuration**
- package.json has `"type": "module"`
- **Critical**: All relative imports MUST use `.js` extension (e.g., `import { search } from "./search.js"`)
- tsconfig.json: ES2022 target, strict mode enabled
- Uses `tsx` for dev (not ts-node) to handle ES modules properly

## Scoring System

| Match Type     | Points | Implementation |
|----------------|--------|----------------|
| Name           | 4      | `includesCI(person.name, query)` |
| Musical Artist | 2      | Match in person's genre artists |
| Music Genre    | 1      | `anyIncludes(person.genres, query)` |
| Movie          | 1      | `anyIncludes(person.movies, query)` |
| Location       | 1      | `includesCI(person.location, query)` |

**Match Rules:**
- Substring matching: "nni" matches "Bonnie Wang"
- Case-insensitive: "EDDY" matches "Eddy Verde"
- Each category counted once: searching "the" on Greta matches "The Departed" + "The Godfather" = 1 point total (not 2)
- Only returns results with score > 0


## Testing

The `test-api.js` file contains 23 automated tests covering:
- README examples (search 'ed', 'the', 'beethoven')
- All scoring categories
- Case insensitivity
- Substring matching
- "Count once" rule for multiple matches in same category
- Adding artists (with and without existing genre)
- Validation errors
- Sorting behavior

Run tests with server running in another terminal.

## Documentation

- **API.md**: Comprehensive API documentation with 10 detailed examples
- **openapi.yaml**: Full OpenAPI 3.0 specification
- **README.md**: Original assignment requirements and dataset (DO NOT MODIFY)

## Dataset

6 people with attributes, 6 music genres with artists each. See data.ts for complete dataset. In-memory only - resets on server restart.

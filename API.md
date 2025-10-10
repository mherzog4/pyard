# API Documentation

This document provides comprehensive examples and usage guidelines for the Search & Music Artist API.

## Table of Contents
- [Getting Started](#getting-started)
- [Base URL](#base-url)
- [Endpoints](#endpoints)
  - [GET /search](#get-search)
  - [POST /artists](#post-artists)
- [Scoring System](#scoring-system)
- [Examples](#examples)

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation & Running
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The API will be available at `http://localhost:3000`

## Base URL

```
http://localhost:3000
```

## Endpoints

### GET /search

Search for people in the dataset based on a query string.

**Query Parameters:**
| Parameter | Type   | Required | Description                                    |
|-----------|--------|----------|------------------------------------------------|
| query     | string | Yes      | Search query (case-insensitive, substring match) |

**Response:**
- **200 OK**: Array of search results
- **500 Internal Server Error**: Server error

**Response Schema:**
```typescript
{
  name: string;      // Person's name
  score: number;     // Total match score
  matches: string[]; // Properties that matched: 'name', 'artists', 'genres', 'movies', 'location'
}[]
```

---

### POST /artists

Add a new musical artist to a specific genre.

**Request Body:**
```json
{
  "genre": "string",  // Music genre (creates if doesn't exist)
  "artist": "string"  // Artist name (duplicates prevented)
}
```

**Response:**
- **204 No Content**: Artist successfully added
- **400 Bad Request**: Invalid request body
- **500 Internal Server Error**: Server error

---

## Scoring System

The search function uses a weighted scoring system:

| Match Type        | Points | Description                                    |
|-------------------|--------|------------------------------------------------|
| Name              | 4      | Query matches person's name                    |
| Musical Artist    | 2      | Query matches artists in person's genres       |
| Music Genre       | 1      | Query matches person's music genres            |
| Movie             | 1      | Query matches person's favorite movies         |
| Location          | 1      | Query matches person's location                |

### Matching Rules
- **Case-insensitive**: "EDDY" matches "Eddy Verde"
- **Substring matching**: "nni" matches "Bonnie Wang"
- **Count once per category**: Multiple movie matches = 1 point total
- **Sorted results**: By score (DESC), then by name (ASC)
- **Only positive scores**: Returns only results with score > 0

---

## Examples

### Example 1: Name Match

**Request:**
```bash
curl "http://localhost:3000/search?query=eddy"
```

**Response:**
```json
[
  {
    "name": "Eddy Verde",
    "score": 6,
    "matches": ["name", "artists"]
  }
]
```

**Explanation:**
- Name match: "eddy" in "Eddy Verde" = 4 points
- Artist match: "ed" in "Led Zeppelin" = 2 points
- Total: 6 points

---

### Example 2: Artist Match

**Request:**
```bash
curl "http://localhost:3000/search?query=zeppelin"
```

**Response:**
```json
[
  {
    "name": "Doug Akridge",
    "score": 2,
    "matches": ["artists"]
  },
  {
    "name": "Eddy Verde",
    "score": 2,
    "matches": ["artists"]
  },
  {
    "name": "Greta Heissenberger",
    "score": 2,
    "matches": ["artists"]
  },
  {
    "name": "Jason Leo",
    "score": 2,
    "matches": ["artists"]
  }
]
```

**Explanation:**
- All four people like Rock music
- "Led Zeppelin" is a Rock artist
- Each gets 2 points for artist match
- Sorted alphabetically (same score)

---

### Example 3: Multiple Matches (Complex)

**Request:**
```bash
curl "http://localhost:3000/search?query=ed"
```

**Response:**
```json
[
  {
    "name": "Eddy Verde",
    "score": 6,
    "matches": ["name", "artists"]
  },
  {
    "name": "Greta Heissenberger",
    "score": 3,
    "matches": ["movies", "artists"]
  },
  {
    "name": "Doug Akridge",
    "score": 2,
    "matches": ["artists"]
  },
  {
    "name": "Jason Leo",
    "score": 2,
    "matches": ["artists"]
  }
]
```

**Explanation:**
- **Eddy Verde**: Name (4) + Artist "Led Zeppelin" (2) = 6 points
- **Greta Heissenberger**: Movie "The Departed" (1) + Artist "Led Zeppelin" (2) = 3 points
- **Doug Akridge**: Artist "Led Zeppelin" (2) = 2 points
- **Jason Leo**: Artist (2) = 2 points

---

### Example 4: Multiple Matches in Same Category

**Request:**
```bash
curl "http://localhost:3000/search?query=the"
```

**Response:**
```json
[
  {
    "name": "Jason Leo",
    "score": 3,
    "matches": ["movies", "artists"]
  },
  {
    "name": "Eddy Verde",
    "score": 1,
    "matches": ["movies"]
  },
  {
    "name": "Greta Heissenberger",
    "score": 1,
    "matches": ["movies"]
  },
  {
    "name": "Justin Coker",
    "score": 1,
    "matches": ["movies"]
  }
]
```

**Explanation:**
- Greta has TWO movies with "the": "The Departed" and "The Godfather"
- But movies only count ONCE = 1 point total
- Jason Leo gets movie (1) + artists "The Mighty Mighty Bosstones" (2) = 3 points

---

### Example 5: Case Insensitivity

**Request:**
```bash
curl "http://localhost:3000/search?query=EDDY"
```

**Response:**
```json
[
  {
    "name": "Eddy Verde",
    "score": 6,
    "matches": ["name", "artists"]
  }
]
```

**Same result with:**
```bash
curl "http://localhost:3000/search?query=EdDy"
curl "http://localhost:3000/search?query=eddy"
```

---

### Example 6: Substring Matching

**Request:**
```bash
curl "http://localhost:3000/search?query=nni"
```

**Response:**
```json
[
  {
    "name": "Bonnie Wang",
    "score": 4,
    "matches": ["name"]
  }
]
```

**Explanation:**
- "nni" is a substring of "Bonnie"
- Name match = 4 points

---

### Example 7: No Results

**Request:**
```bash
curl "http://localhost:3000/search?query=zzzzz"
```

**Response:**
```json
[]
```

---

### Example 8: Add Artist

**Request:**
```bash
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"genre": "Classical", "artist": "Beethoven"}'
```

**Response:**
```
HTTP/1.1 204 No Content
```

**Verify the addition:**
```bash
curl "http://localhost:3000/search?query=beethoven"
```

**Response:**
```json
[
  {
    "name": "Bonnie Wang",
    "score": 2,
    "matches": ["artists"]
  }
]
```

**Explanation:**
- Beethoven added to Classical genre
- Bonnie Wang likes Classical music
- Now matches "beethoven" query with 2 points

---

### Example 9: Add Artist to New Genre

**Request:**
```bash
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"genre": "Pop", "artist": "Michael Jackson"}'
```

**Response:**
```
HTTP/1.1 204 No Content
```

**Explanation:**
- Creates new "Pop" genre
- Adds "Michael Jackson" to it
- No one in dataset likes Pop yet, so search won't return results

---

### Example 10: Invalid Requests

**Missing genre:**
```bash
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"artist": "Beethoven"}'
```

**Response:**
```json
{
  "error": "Invalid request body",
  "details": {
    "genre": ["Required"]
  }
}
```

**Missing artist:**
```bash
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"genre": "Classical"}'
```

**Response:**
```json
{
  "error": "Invalid request body",
  "details": {
    "artist": ["Required"]
  }
}
```

---

## Testing

Run the automated test suite:

```bash
# Make sure server is running first
npm run dev

# In another terminal, run tests
node test-api.js
```

Expected output:
```
Passed: 23
Failed: 0
All tests passed!
```

---

## OpenAPI Specification

For a complete OpenAPI 3.0 specification, see [`openapi.yaml`](./openapi.yaml).

You can view the spec in tools like:
- [Swagger Editor](https://editor.swagger.io/)
- [Postman](https://www.postman.com/)
- [Redoc](https://redocly.github.io/redoc/)

---

## Dataset

The API searches across the following dataset:

### People (6 total)
1. **Eddy Verde** - Rock, Country | Florida
2. **Bonnie Wang** - Classical | Maryland
3. **Greta Heissenberger** - Jazz, Rock | Massachusetts
4. **Justin Coker** - Country | South Carolina
5. **Jason Leo** - Rock, Ska | Maine
6. **Doug Akridge** - Rock, Blues | Washington, D.C.

### Music Artists (by Genre)
- **Rock**: Led Zeppelin, AC/DC, Rolling Stones
- **Country**: Alabama, Rascal Flatts
- **Classical**: Mozart, Bach, Chopin
- **Jazz**: Miles Davis Quintet, Duke Ellington, Louis Armstrong
- **Ska**: Sublime, Reel Big Fish, The Mighty Mighty Bosstones
- **Blues**: John Mayer Trio, B.B. King, Eric Clapton

---

## Architecture

```
src/
├── main.ts        # API server and route handlers
├── search.ts      # Search logic and scoring
├── artists.ts     # Add artist functionality
├── data.ts        # In-memory dataset
├── types.ts       # TypeScript type definitions
└── util.ts        # Helper functions
```

---

## Notes

- Dataset is stored **in-memory** (resets on server restart)
- All string comparisons are **case-insensitive**
- **No authentication** required
- **No rate limiting** implemented
- **No persistence** (no database)

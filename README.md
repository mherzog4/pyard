# Take-Home Project Assignment

## Overview

Build this project as if it were part of a larger, production-ready codebase. Structure your code, directory layout, configuration, and tests accordingly.

> **Note:** You do not need to build any user interface, focus purely on designing and implementing a clean, well-documented API.

---

## Part 1: Core Functions

### 1. Search Function

**Signature:**
```typescript
search(query: string) → Array<{ name: string; score: number; matches: string[] }>
```

**Behavior:**
- Compute a match score for each person in the dataset.
- **Scoring rules** (case-insensitive, substring matches, count each property at most once):
  - Name match: **4 points**
  - Music genre match: **1 point**
  - Movie match: **1 point**
  - Location match: **1 point**
  - Musical artist match: **2 points**
- Return only those with score > 0, sorted descending by score, then by name.
- Populate `matches` with the properties that contributed (e.g. `['name', 'artists']`).

### 2. Add Music Artist Function

**Signature:**
```typescript
addMusicArtist(genre: string, artist: string) → void
```

**Behavior:**
- Add the given artist to the specified genre in the in-memory dataset (avoid duplicates).
- Subsequent search calls should reflect this addition.

---

## Notes

- All matches should be **case insensitive**
- A property is considered a match if it shares **any substring**
  - Example: `"nni"` should match to `"Bonnie Wang"`
- Each match property should only be **counted once** to the score
  - Example: a search for `"the"` on the person Greta Heissenberger should only produce a score of 1 even though "The Departed" and "The Godfather" both match the search input.
- The dataset is unformatted—you are expected to format it however you would like
- You can assume the input arguments to your functions are always strings

---

## Part 2: API Layer

- Expose your two functions as HTTP endpoints using any web framework of your choice.
- Document your API (e.g. OpenAPI spec, README examples).

---

## Examples

### Example Usage

```javascript
>>> search('ed')
[
  { name: 'Eddy Verde', score: 6, matches: [ 'name', 'artists' ] },
  { name: 'Greta Heissenberger', score: 3, matches: [ 'movies', 'artists' ] },
  { name: 'Jason Leo', score: 2, matches: [ 'artists' ] },
  { name: 'Doug Akridge', score: 2, matches: [ 'artists' ] }
]

>>> search('the')
[
  { name: 'Jason Leo', score: 3, matches: [ 'movies', 'artists' ] },
  { name: 'Eddy Verde', score: 1, matches: [ 'movies' ] },
  { name: 'Greta Heissenberger', score: 1, matches: [ 'movies' ] },
  { name: 'Justin Coker', score: 1, matches: [ 'movies' ] }
]

>>> search('beethoven')
[]

>>> addMusicArtist('Classical', 'Beethoven')
>>> search('beethoven')
[
  { name: 'Bonnie Wang', score: 2, matches: [ 'artists' ] }
]
```

---

## Dataset

### PEOPLE

```
Name: Eddy Verde
Music Genre: Rock; Country
Movies: Avatar; The Good, the Bad and the Ugly
Location: Florida

Name: Bonnie Wang
Music Genre: Classical
Movies: Lilo & Stitch; Die Hard
Location: Maryland

Name: Greta Heissenberger
Music Genre: Jazz; Rock
Movies: The Departed; M*A*S*H; The Godfather
Location: Massachusetts

Name: Justin Coker
Music Genre: Country
Movies: Raiders of the Lost Ark; Apollo 13
Location: South Carolina

Name: Jason Leo
Music Genre: Rock; Ska
Movies: The Dark Knight; Top Gun
Location: Maine

Name: Doug Akridge
Music Genre: Rock; Blues
Movies: Jurassic Park; Cast Away; Romeo + Juliet
Location: Washington, D.C.
```

### MUSIC ARTISTS

```
Rock:
  Led Zeppelin
  AC/DC
  Rolling Stones

Country:
  Alabama
  Rascal Flatts

Classical:
  Mozart
  Bach
  Chopin

Jazz:
  Miles Davis Quintet
  Duke Ellington
  Louis Armstrong

Ska:
  Sublime
  Reel Big Fish
  The Mighty Mighty Bosstones

Blues:
  John Mayer Trio
  B.B. King
  Eric Clapton
```

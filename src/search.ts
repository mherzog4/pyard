import { PEOPLE, ARTISTS_BY_GENRE } from "./data.js";
import { SearchHit } from "./types.js";
import { anyIncludes, includesCI } from "./util.js";

const WEIGHTS = {
  name: 4,
  genres: 1,
  movies: 1,
  location: 1,
  artists: 2,
} as const;

export function search(query: string): SearchHit[] {
  const q = query.trim();
  if (!q) return [];

  const hits: SearchHit[] = [];

  for (const person of PEOPLE) {
    let score = 0;
    const matches: SearchHit["matches"] = [];

    // name
    if (includesCI(person.name, q)) {
      score += WEIGHTS.name;
      matches.push("name");
    }

    // genres (only once even if multiple genres match)
    if (anyIncludes(person.genres, q)) {
      score += WEIGHTS.genres;
      matches.push("genres");
    }

    // movies (only once even if several match)
    if (anyIncludes(person.movies, q)) {
      score += WEIGHTS.movies;
      matches.push("movies");
    }

    // location
    if (includesCI(person.location, q)) {
      score += WEIGHTS.location;
      matches.push("location");
    }

    // artists: union of artists across person’s genres (count once)
    const artistsForPerson = person.genres.flatMap((g) => {
      const key = Object.keys(ARTISTS_BY_GENRE).find(
        (k) => k.toLowerCase() === g.toLowerCase(),
      );
      return key ? ARTISTS_BY_GENRE[key] : [];
    });

    if (artistsForPerson.length > 0 && anyIncludes(artistsForPerson, q)) {
      score += WEIGHTS.artists;
      matches.push("artists");
    }

    if (score > 0) {
      hits.push({ name: person.name, score, matches });
    }
  }

  // sort: score desc, then name asc (case-insensitive)
  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  return hits;
}

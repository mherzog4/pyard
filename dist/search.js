import { PEOPLE, ARTISTS_BY_GENRE } from "./data.js";
import { anyIncludes, includesCI } from "./util.js";
const WEIGHTS = {
    name: 4,
    genres: 1,
    movies: 1,
    location: 1,
    artists: 2,
};
export function search(query) {
    const q = query.trim();
    if (!q)
        return [];
    const hits = [];
    for (const person of PEOPLE) {
        let score = 0;
        const matches = [];
        if (includesCI(person.name, q)) {
            score += WEIGHTS.name;
            matches.push("name");
        }
        if (anyIncludes(person.genres, q)) {
            score += WEIGHTS.genres;
            matches.push("genres");
        }
        if (anyIncludes(person.movies, q)) {
            score += WEIGHTS.movies;
            matches.push("movies");
        }
        if (includesCI(person.location, q)) {
            score += WEIGHTS.location;
            matches.push("location");
        }
        const artistsForPerson = person.genres.flatMap((g) => {
            const key = Object.keys(ARTISTS_BY_GENRE).find((k) => k.toLowerCase() === g.toLowerCase());
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
    hits.sort((a, b) => {
        if (b.score !== a.score)
            return b.score - a.score;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
    return hits;
}
//# sourceMappingURL=search.js.map
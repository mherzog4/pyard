import { ARTISTS_BY_GENRE } from "./data.js";
export function addMusicArtist(genre, artist) {
    const existingKey = Object.keys(ARTISTS_BY_GENRE).find((g) => g.toLowerCase() === genre.toLowerCase()) ?? genre;
    if (!ARTISTS_BY_GENRE[existingKey]) {
        ARTISTS_BY_GENRE[existingKey] = [];
    }
    const list = ARTISTS_BY_GENRE[existingKey];
    const exists = list.some((a) => a.toLowerCase() === artist.toLowerCase());
    if (!exists)
        list.push(artist);
}
//# sourceMappingURL=artists.js.map
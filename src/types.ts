export type Person = {
  name: string;
  genres: string[];
  movies: string[];
  location: string;
};

export type ArtistsByGenre = Record<string, string[]>;

export type SearchHit = {
  name: string;
  score: number;
  matches: Array<"name" | "genres" | "movies" | "location" | "artists">;
};

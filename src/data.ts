import { ArtistsByGenre, Person } from "./types.js";

export const PEOPLE: Person[] = [
  {
    name: "Eddy Verde",
    genres: ["Rock", "Country"],
    movies: ["Avatar", "The Good, the Bad and the Ugly"],
    location: "Florida",
  },
  {
    name: "Bonnie Wang",
    genres: ["Classical"],
    movies: ["Lilo & Stitch", "Die Hard"],
    location: "Maryland",
  },
  {
    name: "Greta Heissenberger",
    genres: ["Jazz", "Rock"],
    movies: ["The Departed", "M*A*S*H", "The Godfather"],
    location: "Massachusetts",
  },
  {
    name: "Justin Coker",
    genres: ["Country"],
    movies: ["Raiders of the Lost Ark", "Apollo 13"],
    location: "South Carolina",
  },
  {
    name: "Jason Leo",
    genres: ["Rock", "Ska"],
    movies: ["The Dark Knight", "Top Gun"],
    location: "Maine",
  },
  {
    name: "Doug Akridge",
    genres: ["Rock", "Blues"],
    movies: ["Jurassic Park", "Cast Away", "Romeo + Juliet"],
    location: "Washington, D.C.",
  },
];

export const ARTISTS_BY_GENRE: ArtistsByGenre = {
  Rock: ["Led Zeppelin", "AC/DC", "Rolling Stones"],
  Country: ["Alabama", "Rascal Flatts"],
  Classical: ["Mozart", "Bach", "Chopin"],
  Jazz: ["Miles Davis Quintet", "Duke Ellington", "Louis Armstrong"],
  Ska: ["Sublime", "Reel Big Fish", "The Mighty Mighty Bosstones"],
  Blues: ["John Mayer Trio", "B.B. King", "Eric Clapton"],
};

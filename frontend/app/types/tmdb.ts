export enum TmdbMediaType {
  Movie = "movie",
  Tv = "tv",
}

export type TmdbTrendingResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
};

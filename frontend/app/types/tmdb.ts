export enum TmdbMediaType {
  Movie = "movie",
  Tv = "tv",
}

export enum TmdbTimeWindow {
  Day = "day",
  Week = "week",
}

export type TmdbMediaResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
};

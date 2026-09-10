export type TmdbMediaType = "movie" | "tv";

export type TmdbTrendingResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
};

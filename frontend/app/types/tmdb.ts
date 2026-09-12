export enum TmdbMediaType {
  Movie = "movie",
  Tv = "tv",
}

export enum TmdbTimeWindow {
  Day = "day",
  Week = "week",
}

export enum TmdbImageWidth {
  Poster = "w342",
  Backdrop = "w1280",
  Profile = "w185",
}

export type TmdbMediaResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
};

export type TmdbCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type TmdbCrewMember = {
  id: number;
  name: string;
  job: string;
};

export type TmdbVideo = {
  key: string;
  site: string;
  type: string;
  official: boolean;
};

export type TmdbWatchProvider = {
  provider_name: string;
  logo_path: string;
};

export type TmdbMediaDetailsResponse = {
  id: number;
  title?: string;
  name?: string;
  tagline?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres: { id: number; name: string }[];
  vote_average: number;
  vote_count: number;
  status: string;
  imdb_id?: string;
  budget?: number;
  revenue?: number;
  production_companies?: { name: string }[];
  credits: { cast: TmdbCastMember[]; crew: TmdbCrewMember[] };
  videos: { results: TmdbVideo[] };
  "watch/providers": { results: Record<string, { flatrate?: TmdbWatchProvider[] }> };
  similar: { results: TmdbMediaResult[] };
};

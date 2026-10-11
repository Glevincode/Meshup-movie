export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date?: string;
};

export type MovieDetail = Movie & {
  overview: string;
  tagline?: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  videos?: { results: { key: string; site: string; type: string }[] };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  similar?: { results: Movie[] };
};

export type RootStackParamList = {
  Tabs: undefined;
  Detail: { id: number; title: string };
};

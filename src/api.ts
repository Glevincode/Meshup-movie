import { TMDB_API_KEY } from './config';
import type { Movie, MovieDetail } from './types';

const BASE = 'https://api.themoviedb.org/3';

export const img = (path?: string | null, size = 'w500'): string | null =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const qs = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const res = await fetch(`${BASE}${path}?${qs.toString()}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}). Check your TMDB API key in src/config.ts.`);
  }
  return res.json() as Promise<T>;
}

type Page = { results: Movie[]; total_pages: number };

export const getTrending = () => get<Page>('/trending/movie/week').then(r => r.results);
export const getNowPlaying = () => get<Page>('/movie/now_playing').then(r => r.results);
export const getPopular = () => get<Page>('/movie/popular').then(r => r.results);
export const getTopRated = () => get<Page>('/movie/top_rated').then(r => r.results);
export const searchMovies = (query: string, page = 1) =>
  get<Page>('/search/movie', { query, page, include_adult: 'false' });
export const getMovie = (id: number) =>
  get<MovieDetail>(`/movie/${id}`, { append_to_response: 'videos,credits,similar' });

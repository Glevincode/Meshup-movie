import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from './types';

const KEY = 'favorites:v1';

type Ctx = { favorites: Movie[]; isFav: (id: number) => boolean; toggle: (m: Movie) => void };
const FavoritesContext = createContext<Ctx>({ favorites: [], isFav: () => false, toggle: () => {} });

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(v => v && setFavorites(JSON.parse(v)))
      .catch(() => {});
  }, []);

  const toggle = useCallback((movie: Movie) => {
    setFavorites(prev => {
      const next = prev.some(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [
            {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average,
              release_date: movie.release_date,
            },
            ...prev,
          ];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isFav = useCallback((id: number) => favorites.some(m => m.id === id), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFav, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);

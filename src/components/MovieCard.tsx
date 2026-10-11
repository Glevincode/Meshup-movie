import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { img } from '../api';
import { colors, radius } from '../theme';
import type { Movie } from '../types';

type Props = { movie: Movie; width?: number; onPress: (m: Movie) => void };

export default function MovieCard({ movie, width = 130, onPress }: Props) {
  const uri = img(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);
  const size = { width, height: width * 1.5 };
  return (
    <Pressable onPress={() => onPress(movie)} style={[styles.card, { width }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.poster, size]} />
      ) : (
        <View style={[styles.poster, styles.empty, size]}>
          <Text style={{ fontSize: 28 }}>🎬</Text>
        </View>
      )}
      <Text numberOfLines={1} style={styles.title}>{movie.title}</Text>
      <Text style={styles.meta}>
        <Text style={{ color: colors.star }}>★</Text> {movie.vote_average?.toFixed(1) ?? '–'}
        {year ? `   ${year}` : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginRight: 12 },
  poster: { borderRadius: radius.m, backgroundColor: colors.surface },
  empty: { alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', marginTop: 8 },
  meta: { color: colors.muted, fontSize: 12, marginTop: 2 },
});

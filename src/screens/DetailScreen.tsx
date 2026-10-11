import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getMovie, img } from '../api';
import { useFavorites } from '../favorites';
import MovieCard from '../components/MovieCard';
import { ErrorView, Loading } from '../components/State';
import { colors } from '../theme';
import type { MovieDetail, RootStackParamList } from '../types';

const W = Dimensions.get('window').width;

export default function DetailScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Detail'>) {
  const { id } = route.params;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isFav, toggle } = useFavorites();

  const load = useCallback(() => {
    setError(null);
    getMovie(id).then(setMovie).catch(e => setError((e as Error).message));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!movie) return;
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => toggle(movie)} hitSlop={12}>
          <Text style={{ color: colors.accent, fontSize: 26 }}>{isFav(movie.id) ? '♥' : '♡'}</Text>
        </Pressable>
      ),
    });
  }, [movie, isFav, toggle, navigation]);

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!movie) return <Loading />;

  const trailer = movie.videos?.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  const cast = movie.credits?.cast.slice(0, 12) ?? [];
  const similar = movie.similar?.results.slice(0, 12) ?? [];
  const hours = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const backdrop = img(movie.backdrop_path, 'w780');

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      {backdrop && <Image source={{ uri: backdrop }} style={styles.backdrop} />}
      <View style={styles.body}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.tagline ? <Text style={styles.tagline}>{movie.tagline}</Text> : null}

        <View style={styles.row}>
          <Text style={{ color: colors.star }}>★</Text>
          <Text style={styles.meta}>{movie.vote_average.toFixed(1)}</Text>
          {movie.release_date ? <Text style={styles.meta}>{movie.release_date.slice(0, 4)}</Text> : null}
          {hours ? <Text style={styles.meta}>{hours}</Text> : null}
        </View>

        <View style={[styles.row, { flexWrap: 'wrap', marginTop: 12 }]}>
          {movie.genres.map(g => (
            <View key={g.id} style={styles.chip}><Text style={styles.chipText}>{g.name}</Text></View>
          ))}
        </View>

        {trailer && (
          <Pressable
            style={styles.cta}
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}>
            <Text style={styles.ctaText}>▶  Watch trailer</Text>
          </Pressable>
        )}

        <Text style={styles.section}>Overview</Text>
        <Text style={styles.overview}>{movie.overview || 'No overview available.'}</Text>

        {cast.length > 0 && <Text style={styles.section}>Cast</Text>}
      </View>

      <FlatList
        data={cast}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={c => String(c.id)}
        renderItem={({ item }) => (
          <View style={styles.cast}>
            {item.profile_path ? (
              <Image source={{ uri: img(item.profile_path, 'w185') ?? undefined }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 24 }}>👤</Text>
              </View>
            )}
            <Text numberOfLines={1} style={styles.castName}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.castRole}>{item.character}</Text>
          </View>
        )}
      />

      {similar.length > 0 && (
        <View>
          <Text style={[styles.section, { paddingHorizontal: 16 }]}>More like this</Text>
          <FlatList
            data={similar}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            keyExtractor={m => String(m.id)}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                width={110}
                onPress={m => navigation.push('Detail', { id: m.id, title: m.title })}
              />
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  backdrop: { width: W, height: W * 0.56, backgroundColor: colors.surface },
  body: { padding: 16 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  tagline: { color: colors.muted, fontStyle: 'italic', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  meta: { color: colors.muted, fontSize: 14 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  chipText: { color: colors.text, fontSize: 12 },
  cta: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 13, marginTop: 18 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  section: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  overview: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  cast: { width: 84, marginRight: 12 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.surface },
  castName: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  castRole: { color: colors.muted, fontSize: 11, textAlign: 'center' },
});

import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions, FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getNowPlaying, getPopular, getTopRated, getTrending, img } from '../api';
import MovieCard from '../components/MovieCard';
import { ErrorView, Loading } from '../components/State';
import { colors } from '../theme';
import type { Movie, RootStackParamList } from '../types';

const W = Dimensions.get('window').width;

const SECTIONS = [
  { key: 'nowPlaying', title: 'In theaters', fetch: getNowPlaying },
  { key: 'popular', title: 'Popular', fetch: getPopular },
  { key: 'topRated', title: 'Top rated', fetch: getTopRated },
] as const;

type Data = { trending: Movie[] } & Record<(typeof SECTIONS)[number]['key'], Movie[]>;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [trending, nowPlaying, popular, topRated] = await Promise.all([
        getTrending(), ...SECTIONS.map(s => s.fetch()),
      ]);
      setData({ trending, nowPlaying, popular, topRated });
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const open = (m: Movie) => navigation.navigate('Detail', { id: m.id, title: m.title });

  if (error) return <ErrorView message={error} onRetry={load} />;
  if (!data) return <Loading />;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.accent}
            onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }}
          />
        }>
        <Text style={styles.brand}>Reel</Text>

        <Text style={styles.heading}>Trending this week</Text>
        <FlatList
          data={data.trending.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={W * 0.8 + 12}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={m => String(m.id)}
          renderItem={({ item }) => (
            <Pressable onPress={() => open(item)} style={styles.hero}>
              <Image source={{ uri: img(item.backdrop_path, 'w780') ?? undefined }} style={styles.heroImg} />
              <View style={styles.heroShade} />
              <Text numberOfLines={2} style={styles.heroTitle}>{item.title}</Text>
            </Pressable>
          )}
        />

        {SECTIONS.map(s => (
          <View key={s.key}>
            <Text style={styles.heading}>{s.title}</Text>
            <FlatList
              data={data[s.key]}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={m => String(m.id)}
              renderItem={({ item }) => <MovieCard movie={item} onPress={open} />}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  brand: { color: colors.accent, fontSize: 28, fontWeight: '900', letterSpacing: -0.5, paddingHorizontal: 16, paddingTop: 8 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  hero: { width: W * 0.8, height: W * 0.45, marginRight: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.surface, justifyContent: 'flex-end' },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,17,23,0.45)' },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800', padding: 14 },
});

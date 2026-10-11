import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchMovies } from '../api';
import MovieCard from '../components/MovieCard';
import { Empty } from '../components/State';
import { colors } from '../theme';
import type { Movie, RootStackParamList } from '../types';

const COLS = 3;
const PAD = 16;
const CARD_W = (Dimensions.get('window').width - PAD * 2 - 24) / COLS - 8;

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const run = async (text: string, p: number) => {
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const r = await searchMovies(text, p);
      if (id !== reqId.current) return;
      setResults(prev => (p === 1 ? r.results : [...prev, ...r.results]));
      setPage(p);
      setTotalPages(r.total_pages);
    } catch (e) {
      if (id === reqId.current) setError((e as Error).message);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  };

  useEffect(() => {
    const text = q.trim();
    if (!text) {
      reqId.current++;
      setResults([]);
      setLoading(false);
      return;
    }
    const t = setTimeout(() => run(text, 1), 400);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bar}>
        <Text style={{ color: colors.muted, fontSize: 16 }}>⌕</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search movies"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={results}
        numColumns={COLS}
        keyExtractor={m => String(m.id)}
        contentContainerStyle={{ padding: PAD, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <MovieCard
              movie={item}
              width={CARD_W}
              onPress={m => navigation.navigate('Detail', { id: m.id, title: m.title })}
            />
          </View>
        )}
        onEndReached={() => {
          if (!loading && page < totalPages && q.trim()) run(q.trim(), page + 1);
        }}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={
          loading ? null : error ? (
            <Empty title="Search failed" hint={error} />
          ) : q.trim() ? (
            <Empty title="No matches" hint={`Nothing found for “${q.trim()}”. Try another title.`} />
          ) : (
            <Empty title="Find a movie" hint="Type a title to start searching." />
          )
        }
        ListFooterComponent={loading ? <ActivityIndicator color={colors.accent} style={{ margin: 16 }} /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, margin: 16, marginBottom: 0, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 12, marginLeft: 10 },
});

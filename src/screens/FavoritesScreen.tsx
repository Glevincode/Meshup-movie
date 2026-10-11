import React from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavorites } from '../favorites';
import MovieCard from '../components/MovieCard';
import { Empty } from '../components/State';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

const COLS = 3;
const CARD_W = (Dimensions.get('window').width - 32 - 24) / COLS - 8;

export default function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favorites } = useFavorites();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', padding: 16 }}>Saved</Text>
      <FlatList
        data={favorites}
        numColumns={COLS}
        keyExtractor={m => String(m.id)}
        contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <MovieCard
              movie={item}
              width={CARD_W}
              onPress={m => navigation.navigate('Detail', { id: m.id, title: m.title })}
            />
          </View>
        )}
        ListEmptyComponent={<Empty title="Nothing saved yet" hint="Tap the heart on a movie to keep it here." />}
      />
    </SafeAreaView>
  );
}

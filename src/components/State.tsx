import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '../theme';

export const Loading = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator color={colors.accent} size="large" />
  </View>
);

export const ErrorView = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center' }}>{message}</Text>
    {onRetry && (
      <Pressable
        onPress={onRetry}
        style={{ marginTop: 16, backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Try again</Text>
      </Pressable>
    )}
  </View>
);

export const Empty = ({ title, hint }: { title: string; hint: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
    <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700' }}>{title}</Text>
    <Text style={{ color: colors.muted, marginTop: 6, textAlign: 'center' }}>{hint}</Text>
  </View>
);

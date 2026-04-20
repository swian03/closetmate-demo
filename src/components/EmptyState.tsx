import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cardShadow, colors } from '../theme';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    padding: 22,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    ...cardShadow,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
});

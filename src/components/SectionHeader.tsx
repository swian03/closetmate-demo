import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightText?: string;
}

export const SectionHeader = ({ title, subtitle, rightText }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightText ? (
        <View style={styles.rightBadge}>
          <Text style={styles.rightText}>{rightText}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  textBlock: {
    gap: 5,
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  rightBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rightText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});

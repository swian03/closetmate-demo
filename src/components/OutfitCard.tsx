import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { OutfitPreview } from './OutfitPreview';
import { OCCASION_OPTIONS, STYLE_OPTIONS, getLabel } from '../constants/options';
import { cardShadow, colors } from '../theme';
import { ClothingItem } from '../types';

interface OutfitCardProps {
  title: string;
  score: number;
  note: string;
  weatherHint: string;
  occasion: string;
  style: string;
  count: number;
  previewItems: ClothingItem[];
  highlighted?: boolean;
  badgeText?: string;
  onPrimaryPress?: () => void;
  primaryText?: string;
  onSecondaryPress?: () => void;
  secondaryText?: string;
}

export const OutfitCard = ({
  title,
  score,
  note,
  weatherHint,
  occasion,
  style,
  count,
  previewItems,
  highlighted = false,
  badgeText,
  onPrimaryPress,
  primaryText,
  onSecondaryPress,
  secondaryText,
}: OutfitCardProps) => {
  return (
    <View style={[styles.card, highlighted && styles.cardHighlighted]}>
      {badgeText ? (
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={12} color={colors.white} />
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      ) : null}
      <View style={styles.header}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{score}</Text>
          <Text style={styles.scoreLabel}>匹配度</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {getLabel(occasion, OCCASION_OPTIONS)} · {getLabel(style, STYLE_OPTIONS)} · {count} 件单品
          </Text>
          <Text style={styles.note}>{note}</Text>
          <View style={styles.weatherRow}>
            <Ionicons name="partly-sunny-outline" size={16} color={colors.secondary} />
            <Text style={styles.weatherText}>{weatherHint}</Text>
          </View>
        </View>
      </View>
      <OutfitPreview items={previewItems} />
      <View style={styles.actions}>
        {onPrimaryPress && primaryText ? (
          <Pressable style={styles.primaryButton} onPress={onPrimaryPress}>
            <Text style={styles.primaryButtonText}>{primaryText}</Text>
          </Pressable>
        ) : null}
        {onSecondaryPress && secondaryText ? (
          <Pressable style={styles.secondaryButton} onPress={onSecondaryPress}>
            <Text style={styles.secondaryButtonText}>{secondaryText}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    gap: 16,
    ...cardShadow,
  },
  cardHighlighted: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryDeep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  scoreBox: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryDeep,
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  note: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 21,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.successSoft,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  weatherText: {
    flex: 1,
    fontSize: 12,
    color: colors.secondary,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
});

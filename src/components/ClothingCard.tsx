import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ClothingThumbnail } from './ClothingThumbnail';
import { CATEGORY_OPTIONS, OCCASION_OPTIONS, STATUS_OPTIONS, getLabel } from '../constants/options';
import { cardShadow, colors } from '../theme';
import { ClothingItem } from '../types';
import { formatDateTime } from '../utils/helpers';

interface ClothingCardProps {
  item: ClothingItem;
  onPress: () => void;
  onFavoritePress: () => void;
}

export const ClothingCard = ({ item, onPress, onFavoritePress }: ClothingCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageBox}>
        <ClothingThumbnail item={item} />
      </View>
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.categoryPill}>{getLabel(item.category, CATEGORY_OPTIONS)}</Text>
          </View>
          <Pressable onPress={onFavoritePress} hitSlop={8}>
            <Ionicons name={item.favorite ? 'heart' : 'heart-outline'} size={20} color={colors.primary} />
          </Pressable>
        </View>
        <Text style={styles.meta}>{item.color} · {item.size ?? '未填尺码'} · {item.material ?? '基础材质'}</Text>
        <Text style={styles.meta}>
          状态：{getLabel(item.status, STATUS_OPTIONS)} · 场景：{getLabel(item.occasions[0], OCCASION_OPTIONS)}
        </Text>
        <Text style={styles.meta}>最近穿着：{formatDateTime(item.lastWornAt)} · 次数 {item.wornCount}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 15,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    ...cardShadow,
  },
  imageBox: {
    width: 88,
    height: 88,
    borderRadius: 20,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    gap: 7,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    paddingRight: 10,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    fontSize: 11,
    color: colors.primaryDeep,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 19,
  },
});

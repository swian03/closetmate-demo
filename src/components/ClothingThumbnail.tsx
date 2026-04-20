import React from 'react';
import { DimensionValue, Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { ClothingItem } from '../types';

interface ClothingThumbnailProps {
  item: ClothingItem;
  size?: number;
  width?: DimensionValue;
  height?: number;
  rounded?: number;
  detailMode?: boolean;
}

const colorMap: Record<string, string> = {
  黑色: '#2F3542',
  白色: '#FFFFFF',
  灰色: '#B2BEC3',
  蓝色: '#6C8DFF',
  牛仔蓝: '#5E81AC',
  米色: '#E8D7BA',
  卡其色: '#C8A97E',
  粉色: '#F8A5C2',
  绿色: '#7BC96F',
  红色: '#F25F5C',
};

const categoryIconMap: Record<ClothingItem['category'], keyof typeof Ionicons.glyphMap> = {
  top: 'shirt-outline',
  bottom: 'resize-outline',
  outerwear: 'snow-outline',
  dress: 'woman-outline',
  shoes: 'walk-outline',
  accessory: 'sparkles-outline',
};

const getColor = (value?: string) => colorMap[value ?? ''] ?? '#F5E7EC';

export const ClothingThumbnail = ({
  item,
  size = 88,
  width,
  height,
  rounded = 16,
  detailMode = false,
}: ClothingThumbnailProps) => {
  const cardWidth = width ?? size;
  const cardHeight = height ?? size;

  if (item.imageUri) {
    return (
      <View style={[styles.base, { width: cardWidth, height: cardHeight, borderRadius: rounded }]}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.base,
        styles.generatedCard,
        { width: cardWidth, height: cardHeight, borderRadius: rounded, backgroundColor: getColor(item.color) },
      ]}
    >
      <View style={styles.overlay} />
      <View style={styles.generatedContent}>
        <View style={styles.iconBadge}>
          <Ionicons name={categoryIconMap[item.category]} size={detailMode ? 28 : 20} color={colors.primary} />
        </View>
        <View style={styles.textBox}>
          <Text numberOfLines={2} style={[styles.name, detailMode && styles.detailName]}>
            {item.name}
          </Text>
          <Text style={styles.meta}>{item.color}</Text>
          {detailMode ? <Text style={styles.meta}>{item.material ?? '基础款'}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  generatedCard: {
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.06)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  generatedContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  textBox: {
    gap: 2,
  },
  name: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: colors.text,
  },
  detailName: {
    fontSize: 18,
    lineHeight: 24,
  },
  meta: {
    fontSize: 9,
    color: colors.text,
    opacity: 0.78,
    fontWeight: '600',
  },
});

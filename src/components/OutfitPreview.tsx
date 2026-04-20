import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { ClothingItem } from '../types';

interface OutfitPreviewProps {
  items: ClothingItem[];
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

const getColor = (value?: string) => colorMap[value ?? ''] ?? '#EEDAE2';

const PreviewPiece = ({
  item,
  style,
  label,
}: {
  item?: ClothingItem;
  style: object;
  label: string;
}) => {
  if (item?.imageUri) {
    return (
      <View style={[styles.imageWrap, style]}>
        <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.piece, style, { backgroundColor: getColor(item?.color) }]}>
      <Text style={styles.pieceLabel}>{item?.name ?? label}</Text>
    </View>
  );
};

export const OutfitPreview = ({ items }: OutfitPreviewProps) => {
  const top = items.find((item) => item.category === 'top');
  const outerwear = items.find((item) => item.category === 'outerwear');
  const dress = items.find((item) => item.category === 'dress');
  const bottom = items.find((item) => item.category === 'bottom');
  const shoes = items.find((item) => item.category === 'shoes');
  const accessory = items.find((item) => item.category === 'accessory');
  const upperPiece = outerwear ?? top ?? dress;
  const lowerPiece = dress ?? bottom;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>整身效果</Text>
      <View style={styles.canvas}>
        <View style={styles.head} />
        <PreviewPiece item={upperPiece} label="上装" style={dress ? styles.dressTop : styles.topPiece} />
        {dress ? null : <PreviewPiece item={lowerPiece} label="下装" style={styles.bottomPiece} />}
        <View style={styles.shoesRow}>
          <PreviewPiece item={shoes} label="左鞋" style={styles.shoePiece} />
          <PreviewPiece item={shoes} label="右鞋" style={styles.shoePiece} />
        </View>
        {accessory ? (
          <View style={styles.accessoryBubble}>
            <Ionicons name="sparkles" size={12} color={colors.primary} />
            <Text style={styles.accessoryText}>{accessory.name}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.caption}>基于当前单品生成视觉化穿搭预览</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  canvas: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  head: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F4D4D9',
    marginBottom: 8,
  },
  piece: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.05)',
    paddingHorizontal: 8,
  },
  imageWrap: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.05)',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topPiece: {
    width: 110,
    height: 72,
  },
  dressTop: {
    width: 110,
    height: 132,
  },
  bottomPiece: {
    width: 84,
    height: 78,
    marginTop: 8,
  },
  shoesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  shoePiece: {
    width: 42,
    height: 20,
    borderRadius: 10,
  },
  pieceLabel: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  accessoryBubble: {
    position: 'absolute',
    right: 12,
    top: 56,
    maxWidth: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  accessoryText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '600',
    flexShrink: 1,
  },
  caption: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

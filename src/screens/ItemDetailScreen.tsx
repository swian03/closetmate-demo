import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ClothingThumbnail } from '../components/ClothingThumbnail';
import { CATEGORY_OPTIONS, OCCASION_OPTIONS, SEASON_OPTIONS, STATUS_OPTIONS, STYLE_OPTIONS, getLabel } from '../constants/options';
import { colors } from '../theme';
import { useAppStore } from '../state/useAppStore';
import { formatDateTime } from '../utils/helpers';

export const ItemDetailScreen = ({ navigation, route }: any) => {
  const items = useAppStore((state) => state.items);
  const deleteItem = useAppStore((state) => state.deleteItem);
  const markItemWorn = useAppStore((state) => state.markItemWorn);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const item = useMemo(() => items.find((current) => current.id === route.params.itemId), [items, route.params.itemId]);

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>该衣物不存在或已被删除。</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('确认删除', '删除后会同时移除关联穿搭，是否继续？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteItem(item.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ClothingThumbnail item={item} width="100%" height={280} rounded={24} detailMode />

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>
              {getLabel(item.category, CATEGORY_OPTIONS)} · {item.color} · {item.size ?? '未填尺码'}
            </Text>
          </View>
          <Pressable style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
            <Text style={styles.favoriteText}>{item.favorite ? '取消常用' : '设为常用'}</Text>
          </Pressable>
        </View>

        <Text style={styles.info}>状态：{getLabel(item.status, STATUS_OPTIONS)}</Text>
        <Text style={styles.info}>场景：{item.occasions.map((value) => getLabel(value, OCCASION_OPTIONS)).join(' / ')}</Text>
        <Text style={styles.info}>季节：{item.seasons.map((value) => getLabel(value, SEASON_OPTIONS)).join(' / ')}</Text>
        <Text style={styles.info}>风格：{item.styleTags.map((value) => getLabel(value, STYLE_OPTIONS)).join(' / ')}</Text>
        <Text style={styles.info}>品牌：{item.brand ?? '未填写'} · 材质：{item.material ?? '未填写'}</Text>
        <Text style={styles.info}>穿着次数：{item.wornCount} · 最近穿着：{formatDateTime(item.lastWornAt)}</Text>
        <Text style={styles.info}>备注：{item.notes ?? '暂无备注'}</Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.secondaryButton} onPress={() => markItemWorn(item.id)}>
          <Text style={styles.secondaryButtonText}>标记已穿</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('ItemForm', { itemId: item.id })}>
          <Text style={styles.secondaryButtonText}>编辑信息</Text>
        </Pressable>
      </View>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>删除衣物</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
  },
  favoriteButton: {
    backgroundColor: colors.primarySoft,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  favoriteText: {
    color: colors.primary,
    fontWeight: '700',
  },
  info: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
});

import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CATEGORY_OPTIONS } from '../constants/options';
import { ClothingCard } from '../components/ClothingCard';
import { EmptyState } from '../components/EmptyState';
import { OptionChipGroup } from '../components/OptionChipGroup';
import { SectionHeader } from '../components/SectionHeader';
import { colors } from '../theme';
import { ClothingCategory } from '../types';
import { useAppStore } from '../state/useAppStore';

export const WardrobeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom + 156, 176);
  const items = useAppStore((state) => state.items);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ClothingCategory | 'all'>('all');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = [item.name, item.color, item.material, item.brand]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === 'all' ? true : item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, items, search]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 12, 28), paddingBottom: bottomSpacing }]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SectionHeader title="我的衣柜" subtitle="搜索、筛选和管理所有单品" rightText={`${items.length} 件`} />
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="搜索衣物名称、颜色、材质"
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
              />
            </View>
            <OptionChipGroup
              options={[{ label: '全部', value: 'all' as const }, ...CATEGORY_OPTIONS]}
              value={category}
              onChange={(next) => setCategory(next as ClothingCategory | 'all')}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ClothingCard
            item={item}
            onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<EmptyState title="还没有匹配结果" description="试试修改筛选条件，或者先新增一件衣物。" />}
      />
      <Pressable style={styles.addButton} onPress={() => navigation.navigate('ItemForm')}>
        <Ionicons name="add" size={24} color={colors.white} />
        <Text style={styles.addButtonText}>添加衣物</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  headerBlock: {
    gap: 14,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  addButton: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
});

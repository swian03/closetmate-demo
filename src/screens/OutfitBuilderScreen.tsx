import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClothingThumbnail } from '../components/ClothingThumbnail';
import { OCCASION_OPTIONS, STYLE_OPTIONS, getLabel } from '../constants/options';
import { OptionChipGroup } from '../components/OptionChipGroup';
import { SectionHeader } from '../components/SectionHeader';
import { colors } from '../theme';
import { useAppStore } from '../state/useAppStore';
import { Occasion, Outfit, StyleTag } from '../types';
import { createId, today } from '../utils/helpers';

export const OutfitBuilderScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const items = useAppStore((state) => state.items);
  const outfits = useAppStore((state) => state.outfits);
  const saveOutfit = useAppStore((state) => state.saveOutfit);
  const editingOutfit = useMemo(
    () => outfits.find((outfit) => outfit.id === route.params?.outfitId),
    [outfits, route.params?.outfitId],
  );
  const [name, setName] = useState(editingOutfit?.name ?? '我的自定义搭配');
  const [occasion, setOccasion] = useState<Occasion>(editingOutfit?.occasion ?? 'casual');
  const [style, setStyle] = useState<StyleTag>(editingOutfit?.style ?? 'minimal');
  const [selectedIds, setSelectedIds] = useState<string[]>(editingOutfit?.itemIds ?? []);

  const selectedItems = useMemo(() => items.filter((item) => selectedIds.includes(item.id)), [items, selectedIds]);

  const toggleItem = (itemId: string) => {
    setSelectedIds((current) => (current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]));
  };

  const handleSave = () => {
    if (selectedIds.length < 2) {
      Alert.alert('搭配不足', '至少选择 2 件单品再保存。');
      return;
    }

    const outfit: Outfit = {
      id: editingOutfit?.id ?? createId('outfit'),
      name,
      itemIds: selectedIds,
      occasion,
      style,
      score: editingOutfit?.score ?? 88,
      note: editingOutfit?.note ?? `手动创建，适用于${getLabel(occasion, OCCASION_OPTIONS)}场景。`,
      weatherHint: editingOutfit?.weatherHint ?? '如需更精准建议，可回首页结合天气重新生成。',
      source: editingOutfit?.source ?? 'manual',
      tags: editingOutfit?.tags ?? ['自定义搭配'],
      createdAt: editingOutfit?.createdAt ?? today(),
      updatedAt: today(),
      lastWornAt: editingOutfit?.lastWornAt,
      isTodayLook: editingOutfit?.isTodayLook ?? false,
    };

    saveOutfit(outfit);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 12, 28) }]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SectionHeader
              title={editingOutfit ? '调整搭配' : '自由组合'}
              subtitle={editingOutfit ? '直接修改当前这套穿搭的单品组合' : '从衣柜选择单品组成自己的造型'}
              rightText={`${selectedIds.length} 件已选`}
            />
            <TextInput value={name} onChangeText={setName} placeholder="穿搭名称" placeholderTextColor={colors.textMuted} style={styles.input} />
            <Text style={styles.label}>场景</Text>
            <OptionChipGroup options={OCCASION_OPTIONS} value={occasion} onChange={(next) => setOccasion(next as Occasion)} />
            <Text style={styles.label}>风格</Text>
            <OptionChipGroup options={STYLE_OPTIONS} value={style} onChange={(next) => setStyle(next as StyleTag)} />
          </View>
        }
        renderItem={({ item }) => {
          const active = selectedIds.includes(item.id);
          return (
            <Pressable style={[styles.itemRow, active && styles.activeItemRow]} onPress={() => toggleItem(item.id)}>
              <View style={styles.imageBox}>
                <ClothingThumbnail item={item} size={72} rounded={16} />
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.color} · {item.category} · 已穿 {item.wornCount} 次
                </Text>
              </View>
              <Text style={[styles.checkText, active && styles.activeCheckText]}>{active ? '已选择' : '点选'}</Text>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={
          <View style={styles.footerBlock}>
            <Text style={styles.footerText}>已选单品：{selectedItems.map((item) => item.name).join(' / ') || '暂无'}</Text>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{editingOutfit ? '保存调整结果' : '保存穿搭'}</Text>
            </Pressable>
          </View>
        }
      />
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
    paddingBottom: 32,
  },
  headerBlock: {
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  itemRow: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeItemRow: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  checkText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  activeCheckText: {
    color: colors.primary,
  },
  footerBlock: {
    paddingTop: 16,
    gap: 14,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

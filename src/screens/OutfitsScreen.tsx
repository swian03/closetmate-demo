import React, { useMemo } from 'react';
import { Alert, FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { OutfitCard } from '../components/OutfitCard';
import { SectionHeader } from '../components/SectionHeader';
import { colors } from '../theme';
import { useAppStore } from '../state/useAppStore';
import { sortByDateDesc } from '../utils/helpers';

export const OutfitsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom + 120, 136);
  const outfits = useAppStore((state) => state.outfits);
  const items = useAppStore((state) => state.items);
  const markOutfitWorn = useAppStore((state) => state.markOutfitWorn);

  const orderedOutfits = useMemo(() => {
    return [...outfits].sort((first, second) => {
      if (first.isTodayLook && !second.isTodayLook) return -1;
      if (!first.isTodayLook && second.isTodayLook) return 1;
      return sortByDateDesc(first.lastWornAt ?? first.updatedAt, second.lastWornAt ?? second.updatedAt);
    });
  }, [outfits]);

  const handleShare = async (index: number) => {
    const outfit = orderedOutfits[index];
    if (!outfit) return;
    await Share.share({ message: `${outfit.name}\n匹配度 ${outfit.score}\n${outfit.note}\n${outfit.weatherHint}` });
  };

  const handleMarkTodayLook = (outfitId: string, outfitName: string, isTodayLook?: boolean) => {
    if (isTodayLook) {
      Alert.alert('当前已生效', '这套穿搭已经是今天的穿搭方案。');
      return;
    }

    markOutfitWorn(outfitId);
    Alert.alert('已切换', `今日穿搭已切换为“${outfitName}”。首页和穿搭列表都会同步更新。`);
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 12, 28), paddingBottom: bottomSpacing }]}
      data={orderedOutfits}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.headerBlock}>
          <SectionHeader title="我的穿搭" subtitle="管理保存过的方案，避免重复穿搭" rightText={`${outfits.length} 套`} />
          <Pressable style={styles.builderButton} onPress={() => navigation.navigate('OutfitBuilder')}>
            <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.builderButtonText}>添加自定义穿搭</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item, index }) => (
        <OutfitCard
          title={item.name}
          score={item.score}
          note={item.note}
          weatherHint={item.weatherHint}
          occasion={item.occasion}
          style={item.style}
          count={item.itemIds.length}
          previewItems={items.filter((clothingItem) => item.itemIds.includes(clothingItem.id))}
          highlighted={item.isTodayLook}
          badgeText={item.isTodayLook ? '今日穿搭' : undefined}
          onPrimaryPress={() => handleMarkTodayLook(item.id, item.name, item.isTodayLook)}
          primaryText={item.isTodayLook ? '当前今日穿搭' : '标记今日穿搭'}
          onSecondaryPress={() => handleShare(index)}
          secondaryText="分享"
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListEmptyComponent={<EmptyState title="还没有已保存穿搭" description="你可以在首页保存推荐方案，或者手动创建一套自己的搭配。" />}
      ListFooterComponent={<View style={{ height: 12 }} />}
    />
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
    marginBottom: 2,
  },
  builderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    paddingVertical: 13,
  },
  builderButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});

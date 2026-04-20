import React from 'react';
import { FlatList, Share, StyleSheet, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { OutfitCard } from '../components/OutfitCard';
import { SectionHeader } from '../components/SectionHeader';
import { colors } from '../theme';
import { useAppStore } from '../state/useAppStore';

export const OutfitsScreen = () => {
  const outfits = useAppStore((state) => state.outfits);
  const markOutfitWorn = useAppStore((state) => state.markOutfitWorn);

  const handleShare = async (index: number) => {
    const outfit = outfits[index];
    if (!outfit) return;
    await Share.share({ message: `${outfit.name}\n匹配度 ${outfit.score}\n${outfit.note}\n${outfit.weatherHint}` });
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={outfits}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<SectionHeader title="我的穿搭" subtitle="管理保存过的方案，避免重复穿搭" rightText={`${outfits.length} 套`} />}
      renderItem={({ item, index }) => (
        <OutfitCard
          title={item.name}
          score={item.score}
          note={item.note}
          weatherHint={item.weatherHint}
          occasion={item.occasion}
          style={item.style}
          count={item.itemIds.length}
          onPrimaryPress={() => markOutfitWorn(item.id)}
          primaryText="标记今日穿搭"
          onSecondaryPress={() => handleShare(index)}
          secondaryText="分享"
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListEmptyComponent={<EmptyState title="还没有已保存穿搭" description="你可以在首页保存推荐方案，或者手动创建一套自己的搭配。" />}
      ListFooterComponent={<View style={{ height: 100 }} />}
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
});

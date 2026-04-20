import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CITY_OPTIONS, OCCASION_OPTIONS, STYLE_OPTIONS, getLabel } from '../constants/options';
import { OptionChipGroup } from '../components/OptionChipGroup';
import { OutfitCard } from '../components/OutfitCard';
import { SectionHeader } from '../components/SectionHeader';
import { colors } from '../theme';
import { fetchWeather } from '../services/weather';
import { useAppStore } from '../state/useAppStore';
import { Outfit, Occasion, WeatherSnapshot } from '../types';
import { createId, formatDateTime, today } from '../utils/helpers';
import { generateOutfitSuggestions } from '../utils/outfitEngine';

const weatherFallback: WeatherSnapshot = {
  temperature: 23,
  apparentTemperature: 23,
  weatherCode: 1,
  windSpeed: 2,
  description: '大体晴',
  advice: '体感舒适，可优先选择单层穿搭。',
  fetchedAt: new Date().toISOString(),
};

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom + 120, 136);
  const items = useAppStore((state) => state.items);
  const outfits = useAppStore((state) => state.outfits);
  const profile = useAppStore((state) => state.profile);
  const saveOutfit = useAppStore((state) => state.saveOutfit);
  const [occasion, setOccasion] = useState<Occasion>('commute');
  const [weather, setWeather] = useState<WeatherSnapshot>(weatherFallback);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const todayOutfit = useMemo(() => outfits.find((outfit) => outfit.isTodayLook), [outfits]);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      try {
        setLoadingWeather(true);
        const result = await fetchWeather(profile.city);
        if (!cancelled) {
          setWeather(result);
        }
      } catch (error) {
        console.warn(error);
      } finally {
        if (!cancelled) {
          setLoadingWeather(false);
        }
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [profile.city]);

  const suggestions = useMemo(() => {
    return generateOutfitSuggestions({ items, occasion, profile, weather });
  }, [items, occasion, profile, weather]);

  const saveSuggestion = (index: number) => {
    const suggestion = suggestions[index];
    if (!suggestion) return;

    const payload: Outfit = {
      id: createId('outfit'),
      name: suggestion.title,
      itemIds: suggestion.itemIds,
      occasion: suggestion.occasion,
      style: suggestion.style,
      score: suggestion.score,
      note: suggestion.summary,
      weatherHint: suggestion.weatherHint,
      source: 'generated',
      tags: ['首页推荐'],
      createdAt: today(),
      updatedAt: today(),
    };

    saveOutfit(payload);
    Alert.alert('已保存', '穿搭已加入“我的穿搭”。');
  };

  const shareSuggestion = async (index: number) => {
    const suggestion = suggestions[index];
    if (!suggestion) return;

    await Share.share({
      message: `${suggestion.title}\n匹配度 ${suggestion.score}\n${suggestion.summary}\n${suggestion.weatherHint}`,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 12, 28), paddingBottom: bottomSpacing }]}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroTextBlock}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>ClosetMate Daily Edit</Text>
            </View>
            <Text style={styles.greeting}>你好，{profile.nickname}</Text>
            <Text style={styles.greetingSub}>今天也让衣柜帮你更快出门</Text>
          </View>
          <Pressable style={styles.builderButton} onPress={() => navigation.navigate('OutfitBuilder')}>
            <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.builderText}>自定义搭配</Text>
          </Pressable>
        </View>
        <View style={styles.weatherBox}>
          <View style={styles.weatherIconBubble}>
            <Ionicons name="partly-sunny" size={22} color={colors.primaryDeep} />
          </View>
          <View style={styles.weatherContent}>
            <View>
              <Text style={styles.weatherTemp}>{Math.round(weather.temperature)}°C</Text>
              <Text style={styles.weatherMeta}>
                {getLabel(profile.city, CITY_OPTIONS.map(({ label, value }) => ({ label, value })))} · {weather.description}
              </Text>
            </View>
            <View style={styles.weatherTips}>
              <Text style={styles.weatherTipText}>{loadingWeather ? '正在刷新天气...' : weather.advice}</Text>
              <Text style={styles.weatherTime}>更新时间 {formatDateTime(weather.fetchedAt)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.heroMetricsRow}>
          <View style={styles.metricChip}>
            <Ionicons name="shirt-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.metricChipText}>{items.length} 件衣物</Text>
          </View>
          <View style={styles.metricChip}>
            <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.metricChipText}>{outfits.length} 套穿搭</Text>
          </View>
        </View>
      </View>

      {todayOutfit ? (
        <>
          <SectionHeader title="今日穿搭" subtitle="已为你置顶今天要穿的方案" rightText="已生效" />
          <OutfitCard
            title={todayOutfit.name}
            score={todayOutfit.score}
            note={todayOutfit.note}
            weatherHint={todayOutfit.weatherHint}
            occasion={todayOutfit.occasion}
            style={todayOutfit.style}
            count={todayOutfit.itemIds.length}
            previewItems={items.filter((item) => todayOutfit.itemIds.includes(item.id))}
            highlighted
            badgeText="今日穿搭"
            onPrimaryPress={() => navigation.navigate('Outfits')}
            primaryText="去穿搭页查看"
            onSecondaryPress={() => navigation.navigate('OutfitBuilder', { outfitId: todayOutfit.id })}
            secondaryText="调整搭配"
          />
        </>
      ) : null}

      <SectionHeader title="今日推荐" subtitle="根据天气、场景和偏好自动生成" rightText={`${suggestions.length} 套`} />
      <OptionChipGroup options={OCCASION_OPTIONS} value={occasion} onChange={(next) => setOccasion(next as Occasion)} />

      <View style={styles.listBlock}>
        {suggestions.map((suggestion, index) => (
          <OutfitCard
            key={suggestion.id}
            title={suggestion.title}
            score={suggestion.score}
            note={suggestion.summary}
            weatherHint={suggestion.weatherHint}
            occasion={suggestion.occasion}
            style={suggestion.style}
            count={suggestion.itemIds.length}
            previewItems={items.filter((item) => suggestion.itemIds.includes(item.id))}
            onPrimaryPress={() => saveSuggestion(index)}
            primaryText="保存穿搭"
            onSecondaryPress={() => shareSuggestion(index)}
            secondaryText="分享建议"
          />
        ))}
      </View>

      <SectionHeader title="个人风格" subtitle="系统优先参考你的偏好来推荐" />
      <OptionChipGroup options={STYLE_OPTIONS} value={profile.preferredStyles} multiple onChange={() => undefined} />

      <View style={styles.statsWrap}>
        <View style={styles.statCardLarge}>
          <Text style={styles.statCaption}>衣柜健康度</Text>
          <Text style={styles.statNumber}>{Math.min(99, 72 + items.length)}</Text>
          <Text style={styles.statHint}>常用单品与搭配沉淀正在持续增长</Text>
        </View>
        <View style={styles.statColumn}>
          <View style={styles.statCardSmall}>
            <Text style={styles.statNumberSmall}>{items.filter((item) => item.favorite).length}</Text>
            <Text style={styles.statLabel}>常用单品</Text>
          </View>
          <View style={styles.statCardSmall}>
            <Text style={styles.statNumberSmall}>{outfits.length}</Text>
            <Text style={styles.statLabel}>已存穿搭</Text>
          </View>
        </View>
      </View>
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
    gap: 18,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 32,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroTextBlock: {
    flex: 1,
    gap: 8,
    paddingTop: 2,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  eyebrowText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDeep,
    letterSpacing: 0.4,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    flexWrap: 'wrap',
    letterSpacing: -0.7,
  },
  greetingSub: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  builderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  builderText: {
    color: colors.primaryDeep,
    fontWeight: '700',
    fontSize: 13,
  },
  weatherBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 24,
    padding: 16,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIconBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherContent: {
    flex: 1,
    gap: 8,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryDeep,
    letterSpacing: -0.8,
  },
  weatherMeta: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  weatherTips: {
    gap: 4,
  },
  weatherTipText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.text,
  },
  weatherTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  heroMetricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
  },
  metricChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  listBlock: {
    gap: 14,
  },
  statsWrap: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardLarge: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  statCaption: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '700',
  },
  statNumber: {
    fontSize: 42,
    color: colors.primaryDeep,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: -1,
  },
  statHint: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  statColumn: {
    flex: 1,
    gap: 12,
  },
  statCardSmall: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  statNumberSmall: {
    fontSize: 28,
    color: colors.primaryDeep,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
});

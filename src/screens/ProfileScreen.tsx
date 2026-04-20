import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CITY_OPTIONS, REMINDER_TIME_OPTIONS, SKIN_TONE_OPTIONS, STYLE_OPTIONS } from '../constants/options';
import { OptionChipGroup } from '../components/OptionChipGroup';
import { SelectField } from '../components/SelectField';
import { SectionHeader } from '../components/SectionHeader';
import { colors } from '../theme';
import { useAppStore } from '../state/useAppStore';
import { CityKey, StyleTag } from '../types';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = Math.max(insets.bottom + 120, 136);
  const profile = useAppStore((state) => state.profile);
  const items = useAppStore((state) => state.items);
  const outfits = useAppStore((state) => state.outfits);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const resetDemoData = useAppStore((state) => state.resetDemoData);

  const [nickname, setNickname] = useState(profile.nickname);
  const [city, setCity] = useState<CityKey>(profile.city);
  const [preferredStyles, setPreferredStyles] = useState<StyleTag[]>(profile.preferredStyles);
  const [height, setHeight] = useState(profile.height ? String(profile.height) : '');
  const [weight, setWeight] = useState(profile.weight ? String(profile.weight) : '');
  const [skinTone, setSkinTone] = useState(profile.skinTone ?? '');
  const [reminderTime, setReminderTime] = useState(profile.reminderTime);

  const handleSave = () => {
    if (!nickname.trim()) {
      Alert.alert('昵称必填', '请填写用户昵称。');
      return;
    }

    if (!preferredStyles.length) {
      Alert.alert('风格必选', '请至少选择一个偏好风格。');
      return;
    }

    updateProfile({
      ...profile,
      nickname,
      city,
      preferredStyles,
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
      skinTone,
      reminderTime,
    });
    Alert.alert('已保存', '个人资料已更新。');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 12, 28), paddingBottom: bottomSpacing }]}
    >
      <SectionHeader title="个人中心" subtitle="维护推荐算法会用到的个人信息" />

      <View style={styles.card}>
        <Text style={styles.label}>昵称</Text>
        <TextInput value={nickname} onChangeText={setNickname} placeholder="输入昵称" placeholderTextColor={colors.textMuted} style={styles.input} />

        <Text style={styles.label}>城市</Text>
        <OptionChipGroup options={CITY_OPTIONS.map(({ label, value }) => ({ label, value }))} value={city} onChange={(next) => setCity(next as CityKey)} />

        <Text style={styles.label}>偏好风格</Text>
        <OptionChipGroup options={STYLE_OPTIONS} value={preferredStyles} multiple onChange={(next) => setPreferredStyles(next as StyleTag[])} />

        <Text style={styles.label}>身高 / 体重</Text>
        <View style={styles.row}>
          <TextInput value={height} onChangeText={setHeight} placeholder="身高 cm" keyboardType="numeric" placeholderTextColor={colors.textMuted} style={[styles.input, styles.halfInput]} />
          <TextInput value={weight} onChangeText={setWeight} placeholder="体重 kg" keyboardType="numeric" placeholderTextColor={colors.textMuted} style={[styles.input, styles.halfInput]} />
        </View>

        <SelectField label="肤色" value={skinTone} placeholder="请选择肤色" options={SKIN_TONE_OPTIONS} onChange={setSkinTone} />
        <SelectField
          label="穿搭提醒时间"
          value={reminderTime}
          placeholder="请选择提醒时间"
          options={REMINDER_TIME_OPTIONS}
          onChange={setReminderTime}
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存个人资料</Text>
        </Pressable>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{items.length}</Text>
          <Text style={styles.metricLabel}>衣物总数</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{outfits.length}</Text>
          <Text style={styles.metricLabel}>穿搭方案</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{items.filter((item) => item.status === 'idle').length}</Text>
          <Text style={styles.metricLabel}>闲置衣物</Text>
        </View>
      </View>

      <Pressable style={styles.secondaryButton} onPress={resetDemoData}>
        <Text style={styles.secondaryButtonText}>恢复演示数据</Text>
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
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    marginTop: 8,
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
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
});

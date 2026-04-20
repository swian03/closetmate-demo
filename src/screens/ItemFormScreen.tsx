import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {
  CATEGORY_OPTIONS,
  COLOR_PRESETS,
  MATERIAL_PRESETS,
  OCCASION_OPTIONS,
  SEASON_OPTIONS,
  STATUS_OPTIONS,
  STYLE_OPTIONS,
} from '../constants/options';
import { OptionChipGroup } from '../components/OptionChipGroup';
import { colors } from '../theme';
import { uploadImageIfNeeded } from '../services/supabase';
import { useAppStore } from '../state/useAppStore';
import { ClothingItem, ClothingStatus, Occasion, Season, StyleTag } from '../types';
import { createId, today } from '../utils/helpers';

export const ItemFormScreen = ({ navigation, route }: any) => {
  const items = useAppStore((state) => state.items);
  const upsertItem = useAppStore((state) => state.upsertItem);
  const editingItem = useMemo(() => items.find((item) => item.id === route.params?.itemId), [items, route.params?.itemId]);

  const [name, setName] = useState(editingItem?.name ?? '');
  const [category, setCategory] = useState(editingItem?.category ?? 'top');
  const [color, setColor] = useState(editingItem?.color ?? '白色');
  const [material, setMaterial] = useState(editingItem?.material ?? '棉');
  const [size, setSize] = useState(editingItem?.size ?? 'M');
  const [brand, setBrand] = useState(editingItem?.brand ?? '');
  const [price, setPrice] = useState(editingItem?.price ? String(editingItem.price) : '');
  const [status, setStatus] = useState<ClothingStatus>(editingItem?.status ?? 'active');
  const [occasions, setOccasions] = useState<Occasion[]>(editingItem?.occasions ?? ['commute']);
  const [seasons, setSeasons] = useState<Season[]>(editingItem?.seasons ?? ['spring', 'autumn']);
  const [styleTags, setStyleTags] = useState<StyleTag[]>(editingItem?.styleTags ?? ['minimal']);
  const [notes, setNotes] = useState(editingItem?.notes ?? '');
  const [imageUri, setImageUri] = useState(editingItem?.imageUri);
  const [saving, setSaving] = useState(false);

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('权限不足', '请先允许访问相机或相册。');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8, mediaTypes: ['images'] as any });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('信息不完整', '请至少填写衣物名称。');
      return;
    }

    if (!occasions.length || !seasons.length || !styleTags.length) {
      Alert.alert('信息不完整', '请至少选择一个场景、季节和风格。');
      return;
    }

    try {
      setSaving(true);
      const uploadedUri = await uploadImageIfNeeded(imageUri);
      const payload: ClothingItem = {
        id: editingItem?.id ?? createId('item'),
        name: name.trim(),
        category,
        color,
        material,
        size,
        brand: brand.trim() || undefined,
        price: price ? Number(price) : undefined,
        occasions,
        seasons,
        styleTags,
        status,
        favorite: editingItem?.favorite ?? false,
        imageUri: uploadedUri,
        notes: notes.trim() || undefined,
        createdAt: editingItem?.createdAt ?? today(),
        updatedAt: today(),
        wornCount: editingItem?.wornCount ?? 0,
        lastWornAt: editingItem?.lastWornAt,
      };

      upsertItem(payload);
      navigation.goBack();
    } catch (error) {
      console.warn(error);
      Alert.alert('保存失败', '请稍后重试。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>衣物图片</Text>
      <View style={styles.imageActions}>
        <Pressable style={styles.imageButton} onPress={() => pickImage(false)}>
          <Text style={styles.imageButtonText}>从相册选择</Text>
        </Pressable>
        <Pressable style={styles.imageButton} onPress={() => pickImage(true)}>
          <Text style={styles.imageButtonText}>拍照录入</Text>
        </Pressable>
      </View>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      ) : (
        <View style={styles.previewPlaceholder}>
          <Text style={styles.placeholderText}>未上传图片</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>基础信息</Text>
      <TextInput value={name} onChangeText={setName} placeholder="衣物名称 *" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput value={brand} onChangeText={setBrand} placeholder="品牌" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput value={size} onChangeText={setSize} placeholder="尺码" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput value={price} onChangeText={setPrice} placeholder="购买价格" keyboardType="numeric" placeholderTextColor={colors.textMuted} style={styles.input} />

      <Text style={styles.label}>分类</Text>
      <OptionChipGroup options={CATEGORY_OPTIONS} value={category} onChange={(next) => setCategory(next as ClothingItem['category'])} />

      <Text style={styles.label}>颜色</Text>
      <View style={styles.presetRow}>
        {COLOR_PRESETS.map((preset) => (
          <Pressable key={preset} style={[styles.presetChip, color === preset && styles.activePresetChip]} onPress={() => setColor(preset)}>
            <Text style={[styles.presetChipText, color === preset && styles.activePresetChipText]}>{preset}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput value={color} onChangeText={setColor} placeholder="也可手动输入颜色" placeholderTextColor={colors.textMuted} style={styles.input} />

      <Text style={styles.label}>材质</Text>
      <View style={styles.presetRow}>
        {MATERIAL_PRESETS.map((preset) => (
          <Pressable key={preset} style={[styles.presetChip, material === preset && styles.activePresetChip]} onPress={() => setMaterial(preset)}>
            <Text style={[styles.presetChipText, material === preset && styles.activePresetChipText]}>{preset}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput value={material} onChangeText={setMaterial} placeholder="也可手动输入材质" placeholderTextColor={colors.textMuted} style={styles.input} />

      <Text style={styles.label}>状态</Text>
      <OptionChipGroup options={STATUS_OPTIONS} value={status} onChange={(next) => setStatus(next as ClothingStatus)} />

      <Text style={styles.label}>穿着场景</Text>
      <OptionChipGroup options={OCCASION_OPTIONS} value={occasions} multiple onChange={(next) => setOccasions(next as Occasion[])} />

      <Text style={styles.label}>季节</Text>
      <OptionChipGroup options={SEASON_OPTIONS} value={seasons} multiple onChange={(next) => setSeasons(next as Season[])} />

      <Text style={styles.label}>风格</Text>
      <OptionChipGroup options={STYLE_OPTIONS} value={styleTags} multiple onChange={(next) => setStyleTags(next as StyleTag[])} />

      <Text style={styles.sectionTitle}>备注</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="补充版型、搭配建议、购买时间等信息"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <Pressable style={[styles.saveButton, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? '保存中...' : '保存衣物'}</Text>
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
    gap: 12,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 6,
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
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  imageActions: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  imageButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: 20,
  },
  previewPlaceholder: {
    height: 180,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textMuted,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  activePresetChip: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  presetChipText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  activePresetChipText: {
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

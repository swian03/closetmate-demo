import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cardShadow, colors } from '../theme';

interface OptionChipGroupProps<T extends string> {
  options: Array<{ label: string; value: T }>;
  value: T | T[];
  multiple?: boolean;
  onChange: (nextValue: T | T[]) => void;
}

export function OptionChipGroup<T extends string>({
  options,
  value,
  multiple = false,
  onChange,
}: OptionChipGroupProps<T>) {
  const selected = Array.isArray(value) ? value : [value];

  const handlePress = (optionValue: T) => {
    if (multiple) {
      const nextValues = selected.includes(optionValue)
        ? selected.filter((item) => item !== optionValue)
        : [...selected, optionValue];
      onChange(nextValues as T[]);
      return;
    }

    onChange(optionValue);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <Pressable key={option.value} onPress={() => handlePress(option.value)} style={[styles.chip, active && styles.activeChip]}>
            <Text style={[styles.chipText, active && styles.activeChipText]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  activeChip: {
    backgroundColor: colors.surface,
    borderColor: colors.primaryTint,
    ...cardShadow,
  },
  chipText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  activeChipText: {
    color: colors.primaryDeep,
  },
});

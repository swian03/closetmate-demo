import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme';
import { useAppStore } from './src/state/useAppStore';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function App() {
  const hydrateDemoData = useAppStore((state) => state.hydrateDemoData);
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hydrated) {
      hydrateDemoData();
    }
  }, [hydrateDemoData, hydrated]);

  const content = useMemo(() => {
    if (!hydrated) {
      return (
        <SafeAreaView style={styles.bootContainer}>
          <View style={styles.bootCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.bootTitle}>正在准备你的数字衣橱</Text>
            <Text style={styles.bootSubtitle}>首次启动会自动写入演示数据，方便你直接预览完整流程。</Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
      </NavigationContainer>
    );
  }, [hydrated]);

  return (
    <>
      <StatusBar style="dark" />
      {content}
    </>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  bootCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  bootTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  bootSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
});

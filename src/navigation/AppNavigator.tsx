import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { WardrobeScreen } from '../screens/WardrobeScreen';
import { OutfitsScreen } from '../screens/OutfitsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ItemFormScreen } from '../screens/ItemFormScreen';
import { ItemDetailScreen } from '../screens/ItemDetailScreen';
import { OutfitBuilderScreen } from '../screens/OutfitBuilderScreen';
import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const tabMeta: Record<
  keyof TabParamList,
  { label: string; activeIcon: keyof typeof Ionicons.glyphMap; inactiveIcon: keyof typeof Ionicons.glyphMap }
> = {
  Home: { label: '首页', activeIcon: 'sparkles', inactiveIcon: 'sparkles-outline' },
  Wardrobe: { label: '衣柜', activeIcon: 'shirt', inactiveIcon: 'shirt-outline' },
  Outfits: { label: '穿搭', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
  Profile: { label: '我的', activeIcon: 'person', inactiveIcon: 'person-outline' },
};

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          height: 72 + Math.max(insets.bottom - 2, 0),
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingHorizontal: 10,
          borderTopWidth: 0,
          borderRadius: 28,
          backgroundColor: 'rgba(255,255,255,0.96)',
          shadowColor: '#D85B82',
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        },
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ color, focused }) => {
          const meta = tabMeta[route.name];
          return (
            <View style={styles.tabVisual}>
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Ionicons name={focused ? meta.activeIcon : meta.inactiveIcon} size={21} color={color} />
              </View>
              <Text style={[styles.tabLabel, { color }, focused && styles.tabLabelActive]}>{meta.label}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Outfits" component={OutfitsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ItemForm" component={ItemFormScreen} options={{ title: '衣物信息', headerBackTitleVisible: false }} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: '单品详情', headerBackTitleVisible: false }} />
      <Stack.Screen
        name="OutfitBuilder"
        component={OutfitBuilderScreen}
        options={{ title: '自定义搭配', headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarItem: {
    justifyContent: 'center',
  },
  tabVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 64,
  },
  iconWrap: {
    width: 42,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primarySoft,
    shadowColor: '#E95D87',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});

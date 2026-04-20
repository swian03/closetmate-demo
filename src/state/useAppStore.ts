import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { defaultProfile, demoItems, demoOutfits } from '../data/demoData';
import { ClothingItem, ClothingStatus, Outfit, UserProfile } from '../types';
import { today } from '../utils/helpers';

interface AppState {
  items: ClothingItem[];
  outfits: Outfit[];
  profile: UserProfile;
  hasBootstrapped: boolean;
  hydrateDemoData: () => void;
  upsertItem: (item: ClothingItem) => void;
  deleteItem: (itemId: string) => void;
  toggleFavorite: (itemId: string) => void;
  updateItemStatus: (itemId: string, status: ClothingStatus) => void;
  markItemWorn: (itemId: string) => void;
  saveOutfit: (outfit: Outfit) => void;
  deleteOutfit: (outfitId: string) => void;
  markOutfitWorn: (outfitId: string) => void;
  updateProfile: (profile: UserProfile) => void;
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      items: [],
      outfits: [],
      profile: defaultProfile,
      hasBootstrapped: false,
      hydrateDemoData: () =>
        set((state) => {
          if (state.hasBootstrapped) {
            return state;
          }

          return {
            items: state.items.length ? state.items : demoItems,
            outfits: state.outfits.length ? state.outfits : demoOutfits,
            profile: state.profile.nickname ? state.profile : defaultProfile,
            hasBootstrapped: true,
          };
        }),
      upsertItem: (item) =>
        set((state) => ({
          items: state.items.some((current) => current.id === item.id)
            ? state.items.map((current) => (current.id === item.id ? item : current))
            : [item, ...state.items],
        })),
      deleteItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          outfits: state.outfits.filter((outfit) => !outfit.itemIds.includes(itemId)),
        })),
      toggleFavorite: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, favorite: !item.favorite, updatedAt: today() } : item,
          ),
        })),
      updateItemStatus: (itemId, status) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === itemId ? { ...item, status, updatedAt: today() } : item)),
        })),
      markItemWorn: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, wornCount: item.wornCount + 1, lastWornAt: today(), updatedAt: today() }
              : item,
          ),
        })),
      saveOutfit: (outfit) =>
        set((state) => ({
          outfits: state.outfits.some((current) => current.id === outfit.id)
            ? state.outfits.map((current) =>
                current.id === outfit.id ? { ...current, ...outfit, isTodayLook: outfit.isTodayLook ?? current.isTodayLook } : current,
              )
            : [{ ...outfit, isTodayLook: outfit.isTodayLook ?? false }, ...state.outfits],
        })),
      deleteOutfit: (outfitId) =>
        set((state) => ({
          outfits: state.outfits.filter((outfit) => outfit.id !== outfitId),
        })),
      markOutfitWorn: (outfitId) =>
        set((state) => ({
          outfits: state.outfits.map((outfit) =>
            outfit.id === outfitId
              ? { ...outfit, lastWornAt: today(), updatedAt: today(), isTodayLook: true }
              : { ...outfit, isTodayLook: false },
          ),
        })),
      updateProfile: (profile) => set({ profile }),
      resetDemoData: () =>
        set({
          items: demoItems,
          outfits: demoOutfits,
          profile: defaultProfile,
          hasBootstrapped: true,
        }),
    }),
    {
      name: 'closetmate-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

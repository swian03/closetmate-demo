export type RootStackParamList = {
  MainTabs: undefined;
  ItemForm: { itemId?: string } | undefined;
  ItemDetail: { itemId: string };
  OutfitBuilder: { outfitId?: string } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Wardrobe: undefined;
  Outfits: undefined;
  Profile: undefined;
};

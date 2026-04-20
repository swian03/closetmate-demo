import { ClothingItem, GeneratedOutfit, Occasion, Season, StyleTag, UserProfile, WeatherSnapshot } from '../types';
import { createId } from './helpers';

interface GenerateParams {
  items: ClothingItem[];
  occasion: Occasion;
  profile: UserProfile;
  weather?: WeatherSnapshot;
}

const neutralColors = ['黑色', '白色', '灰色', '米色', '卡其色'];

const detectSeason = (temperature?: number): Season => {
  if (temperature === undefined) return 'spring';
  if (temperature >= 27) return 'summer';
  if (temperature >= 18) return 'spring';
  if (temperature >= 10) return 'autumn';
  return 'winter';
};

const scoreItem = (item: ClothingItem, occasion: Occasion, season: Season, preferredStyles: StyleTag[]) => {
  let score = 0;

  if (item.status === 'hidden' || item.status === 'damaged') return -100;
  if (item.status === 'laundry') score -= 40;
  if (item.status === 'idle') score -= 10;
  if (item.occasions.includes(occasion)) score += 30;
  if (item.seasons.includes(season)) score += 20;
  if (item.favorite) score += 8;
  if (item.styleTags.some((style) => preferredStyles.includes(style))) score += 14;
  score -= Math.min(item.wornCount, 12);

  return score;
};

const colorScore = (items: ClothingItem[]) => {
  const colors = items.map((item) => item.color);
  const unique = new Set(colors);

  if (unique.size <= 2) return 18;
  if (colors.some((color) => neutralColors.includes(color))) return 12;
  return 6;
};

const buildSummary = (occasion: Occasion, style: StyleTag, temperature?: number) => {
  const occasionText = {
    commute: '通勤',
    date: '约会',
    casual: '休闲',
    sport: '运动',
    formal: '正式',
  }[occasion];

  const styleText = {
    minimal: '简约',
    vintage: '复古',
    sweetcool: '甜酷',
    casual: '休闲',
    elegant: '优雅',
  }[style];

  const weatherHint =
    temperature === undefined ? '适合室内和常规出行场景。' : `当前约 ${Math.round(temperature)}°C，建议优先选择舒适且层次清晰的组合。`;

  return {
    summary: `${occasionText}场景优先，整体偏${styleText}风格，兼顾利用现有衣柜单品。`,
    weatherHint,
  };
};

const pickTopItems = (items: ClothingItem[], count = 4) => {
  return items.slice(0, count);
};

export const generateOutfitSuggestions = ({ items, occasion, profile, weather }: GenerateParams): GeneratedOutfit[] => {
  const season = detectSeason(weather?.temperature);
  const activeItems = items.filter((item) => !['hidden', 'damaged'].includes(item.status));

  const tops = activeItems.filter((item) => item.category === 'top');
  const bottoms = activeItems.filter((item) => item.category === 'bottom');
  const outerwears = activeItems.filter((item) => item.category === 'outerwear');
  const dresses = activeItems.filter((item) => item.category === 'dress');
  const shoes = activeItems.filter((item) => item.category === 'shoes');
  const accessories = activeItems.filter((item) => item.category === 'accessory');

  const sortByScore = (list: ClothingItem[]) =>
    [...list].sort(
      (a, b) => scoreItem(b, occasion, season, profile.preferredStyles) - scoreItem(a, occasion, season, profile.preferredStyles),
    );

  const topPool = pickTopItems(sortByScore(tops), 4);
  const bottomPool = pickTopItems(sortByScore(bottoms), 4);
  const dressPool = pickTopItems(sortByScore(dresses), 3);
  const outerPool = pickTopItems(sortByScore(outerwears), 3);
  const shoePool = pickTopItems(sortByScore(shoes), 3);
  const accessoryPool = pickTopItems(sortByScore(accessories), 2);

  const shouldAddOuterwear = (weather?.temperature ?? 22) < 18;
  const combinations: GeneratedOutfit[] = [];
  const uniqueKeys = new Set<string>();

  for (const top of topPool) {
    for (const bottom of bottomPool) {
      const base = [top, bottom];
      const optionalOuter = shouldAddOuterwear ? outerPool.slice(0, 2) : [undefined];
      const optionalShoes = shoePool.length ? shoePool.slice(0, 2) : [undefined];
      const optionalAccessories = accessoryPool.length ? accessoryPool.slice(0, 1) : [undefined];

      for (const outer of optionalOuter) {
        for (const shoe of optionalShoes) {
          for (const accessory of optionalAccessories) {
            const combined = [...base, outer, shoe, accessory].filter(Boolean) as ClothingItem[];
            const key = combined.map((item) => item.id).sort().join('-');

            if (uniqueKeys.has(key)) continue;
            uniqueKeys.add(key);

            const totalScore =
              combined.reduce((sum, item) => sum + scoreItem(item, occasion, season, profile.preferredStyles), 0) + colorScore(combined);
            const style = combined.flatMap((item) => item.styleTags).find((tag) => profile.preferredStyles.includes(tag)) ?? profile.preferredStyles[0] ?? 'minimal';
            const text = buildSummary(occasion, style, weather?.temperature);

            combinations.push({
              id: createId('generated'),
              title: `${text.summary.split('，')[0]}方案`,
              itemIds: combined.map((item) => item.id),
              occasion,
              style,
              score: Math.max(72, Math.min(99, Math.round(totalScore / combined.length + 58))),
              summary: text.summary,
              weatherHint: text.weatherHint,
            });
          }
        }
      }
    }
  }

  for (const dress of dressPool) {
    const combined = [dress, shoePool[0], accessoryPool[0], shouldAddOuterwear ? outerPool[0] : undefined].filter(Boolean) as ClothingItem[];
    const key = combined.map((item) => item.id).sort().join('-');

    if (!uniqueKeys.has(key)) {
      const style = combined.flatMap((item) => item.styleTags).find((tag) => profile.preferredStyles.includes(tag)) ?? profile.preferredStyles[0] ?? 'elegant';
      const text = buildSummary(occasion, style, weather?.temperature);
      const totalScore =
        combined.reduce((sum, item) => sum + scoreItem(item, occasion, season, profile.preferredStyles), 0) + colorScore(combined);

      combinations.push({
        id: createId('generated'),
        title: `${dress.name}主搭方案`,
        itemIds: combined.map((item) => item.id),
        occasion,
        style,
        score: Math.max(70, Math.min(99, Math.round(totalScore / combined.length + 60))),
        summary: text.summary,
        weatherHint: text.weatherHint,
      });
    }
  }

  return combinations.sort((a, b) => b.score - a.score).slice(0, 5);
};

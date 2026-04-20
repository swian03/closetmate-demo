import { CityKey, ClothingCategory, ClothingStatus, Occasion, Season, StyleTag } from '../types';

export const CATEGORY_OPTIONS: Array<{ label: string; value: ClothingCategory }> = [
  { label: '上装', value: 'top' },
  { label: '下装', value: 'bottom' },
  { label: '外套', value: 'outerwear' },
  { label: '一件式', value: 'dress' },
  { label: '鞋靴', value: 'shoes' },
  { label: '配饰', value: 'accessory' },
];

export const STATUS_OPTIONS: Array<{ label: string; value: ClothingStatus }> = [
  { label: '正常', value: 'active' },
  { label: '闲置', value: 'idle' },
  { label: '待清洗', value: 'laundry' },
  { label: '已损坏', value: 'damaged' },
  { label: '隐藏', value: 'hidden' },
];

export const OCCASION_OPTIONS: Array<{ label: string; value: Occasion }> = [
  { label: '通勤', value: 'commute' },
  { label: '约会', value: 'date' },
  { label: '休闲', value: 'casual' },
  { label: '运动', value: 'sport' },
  { label: '正式', value: 'formal' },
];

export const STYLE_OPTIONS: Array<{ label: string; value: StyleTag }> = [
  { label: '简约', value: 'minimal' },
  { label: '复古', value: 'vintage' },
  { label: '甜酷', value: 'sweetcool' },
  { label: '休闲', value: 'casual' },
  { label: '优雅', value: 'elegant' },
];

export const SEASON_OPTIONS: Array<{ label: string; value: Season }> = [
  { label: '春', value: 'spring' },
  { label: '夏', value: 'summer' },
  { label: '秋', value: 'autumn' },
  { label: '冬', value: 'winter' },
];

export const COLOR_PRESETS = ['黑色', '白色', '灰色', '蓝色', '牛仔蓝', '米色', '卡其色', '粉色', '绿色', '红色'];
export const MATERIAL_PRESETS = ['棉', '麻', '丝', '羊毛', '涤纶', '牛仔', '针织'];
export const SKIN_TONE_OPTIONS = ['冷白皮', '自然白', '自然偏黄', '健康小麦色', '冷调肤色', '暖调肤色'];
export const REMINDER_TIME_OPTIONS = ['07:00', '07:30', '08:00', '08:30', '09:00', '18:00', '20:00', '21:00'];

export const CITY_OPTIONS: Array<{ label: string; value: CityKey; latitude: number; longitude: number }> = [
  { label: '上海', value: 'shanghai', latitude: 31.2304, longitude: 121.4737 },
  { label: '北京', value: 'beijing', latitude: 39.9042, longitude: 116.4074 },
  { label: '广州', value: 'guangzhou', latitude: 23.1291, longitude: 113.2644 },
  { label: '深圳', value: 'shenzhen', latitude: 22.5431, longitude: 114.0579 },
  { label: '杭州', value: 'hangzhou', latitude: 30.2741, longitude: 120.1551 },
];

export const getLabel = (value: string, options: Array<{ label: string; value: string }>) => {
  return options.find((option) => option.value === value)?.label ?? value;
};

import { CITY_OPTIONS } from '../constants/options';
import { CityKey, WeatherSnapshot } from '../types';

const codeMap: Record<number, string> = {
  0: '晴朗',
  1: '大体晴',
  2: '局部多云',
  3: '阴天',
  45: '有雾',
  51: '毛毛雨',
  61: '小雨',
  63: '中雨',
  71: '小雪',
  80: '阵雨',
  95: '雷暴',
};

const buildAdvice = (temperature: number, weatherCode: number) => {
  if (weatherCode >= 61 && weatherCode <= 82) return '有降水风险，建议优先搭配防滑鞋或外套。';
  if (temperature >= 30) return '气温较高，建议选择轻薄透气面料。';
  if (temperature >= 22) return '体感舒适，可优先选择单层穿搭。';
  if (temperature >= 15) return '早晚稍凉，建议带一件轻外套。';
  return '天气偏凉，建议增加针织或外套层次。';
};

export const fetchWeather = async (city: CityKey): Promise<WeatherSnapshot> => {
  const target = CITY_OPTIONS.find((option) => option.value === city) ?? CITY_OPTIONS[0];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${target.latitude}&longitude=${target.longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FShanghai`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('天气接口调用失败');
  }

  const data = await response.json();
  const current = data.current;
  const description = codeMap[current.weather_code] ?? '天气正常';

  return {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    weatherCode: current.weather_code,
    windSpeed: current.wind_speed_10m,
    description,
    advice: buildAdvice(current.temperature_2m, current.weather_code),
    fetchedAt: new Date().toISOString(),
  };
};

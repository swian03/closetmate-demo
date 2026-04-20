export const createId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);

export const formatDateTime = (value?: string) => {
  if (!value) return '暂无';

  const date = new Date(value);
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${month}-${day} ${hours}:${minutes}`;
};

export const today = () => new Date().toISOString();

export const sortByDateDesc = (first?: string, second?: string) => {
  const firstTime = first ? new Date(first).getTime() : 0;
  const secondTime = second ? new Date(second).getTime() : 0;
  return secondTime - firstTime;
};

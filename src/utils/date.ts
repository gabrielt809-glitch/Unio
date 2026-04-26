const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'short',
});

export const toDateKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTodayLabel = (date: Date = new Date()): string =>
  dateFormatter.format(date).replace('.', '');

export const getMonthKey = (date: Date = new Date()): string => toDateKey(date).slice(0, 7);

export const nowIso = (): string => new Date().toISOString();

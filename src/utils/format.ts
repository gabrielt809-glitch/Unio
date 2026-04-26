export const formatCurrencyFromCents = (valueInCents: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);

export const parseCurrencyToCents = (value: string): number => {
  const normalized = value
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
};

export const minutesToHours = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) {
    return `${remainder}min`;
  }
  return `${hours}h ${String(remainder).padStart(2, '0')}min`;
};

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

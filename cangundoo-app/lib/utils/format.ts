export const formatPriceKz = (value: number | string) => {
  const amount = Number(value);
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
};

export const formatArea = (value: number | string) => {
  const amount = Number(value);
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${safe.toLocaleString('pt-AO')} m²`;
};

export const truncate = (value: string, maxLength = 120) =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength).trim()}…`;

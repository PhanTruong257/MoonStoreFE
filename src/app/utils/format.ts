export const formatMoney = (value: number, fractionDigits = 2) =>
  `$${value.toFixed(fractionDigits)}`;

export const formatMoneyShort = (value: number) => formatMoney(value, 0);

export const formatDateTime = (iso: string) => new Date(iso).toLocaleString();

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString();

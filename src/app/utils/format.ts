export const formatMoney = (value: number, fractionDigits = 2) =>
  `$${value.toFixed(fractionDigits)}`;

export const formatMoneyShort = (value: number) => formatMoney(value, 0);

export const formatDateTime = (iso: string) => new Date(iso).toLocaleString();

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString();

/**
 * Render a shipping address JSON blob into a single human-readable line.
 * Tolerant of either `addressLine`/`streetAddress`/`firstName` for the first
 * field (depending on whether the order was placed from a saved address or
 * the inline checkout form).
 */
export const renderAddressLine = (
  address: Record<string, unknown> | null | undefined,
  fallback = "(none)",
): string => {
  if (!address) {
    return fallback;
  }
  const parts = [
    address.addressLine ?? address.streetAddress ?? address.firstName,
    address.district,
    address.city,
  ].filter(Boolean);
  if (parts.length === 0) {
    return "(empty)";
  }
  return parts.join(", ");
};

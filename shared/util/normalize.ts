export const normalizePhone = (raw: string): string | null => {
  const digits = (raw || "").replace(/\D/g, "");
  if (/^010\d{8}$/.test(digits)) {
    return `010-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
  return null;
};

type Language = {luxonLocale?: unknown; [key: string]: unknown};
/** Return one language record, including when matching a device locale. */
export function initialLanguage(
  explicit: unknown,
  available: unknown,
  locale: unknown,
  deviceCode: unknown,
  preferFirst = false,
): Language | undefined {
  const supplied = Array.isArray(explicit) ? explicit[0] : explicit;
  if (supplied && typeof supplied === 'object') return supplied as Language;
  const languages = Array.isArray(available)
    ? (available.filter(item => item && typeof item === 'object') as Language[])
    : [];
  if (preferFirst) return languages[0];
  return (
    languages.find(
      item =>
        typeof item.luxonLocale === 'string' &&
        (item.luxonLocale === locale ||
          item.luxonLocale.split('-')[0] === deviceCode),
    ) ?? languages[0]
  );
}

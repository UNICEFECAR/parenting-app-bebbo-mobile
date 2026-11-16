const digits: Record<string, string> = {bn:'০১২৩৪৫৬৭৮৯',hi:'०१२३४५६७८९',ur:'۰۱۲۳۴۵۶۷۸۹',ar:'٠١٢٣٤٥٦٧٨٩'};
/** Locale keys, legacy aliases and real BCP-47 locales select the same digits. */
export function localisedDigits(input: unknown, locale: unknown): string {
  if (input == null) return '';
  const tag = typeof locale === 'string' ? locale.toLowerCase().replace(/_/g,'-') : '';
  const language = ({grarb:'ar',hin:'hi',urd:'ur'} as Record<string,string>)[tag] ?? tag.split('-')[0];
  const map = digits[language];
  const value = String(input);
  return map ? value.replace(/[0-9]/g, character => map[Number(character)]) : value;
}

import dictionary from './huty.json';

export const LANGS = ['pl', 'en', 'de'] as const;
export type Lang = (typeof LANGS)[number];

type Entries = Record<string, { en: string; de: string }>;
const text = dictionary.text as Entries;

/**
 * Teksty w komponentach są po polsku; t() zwraca tłumaczenie dla EN/DE.
 * Brak tłumaczenia zatrzymuje build, żeby polski tekst nie trafił na stronę EN/DE.
 */
export function useT(lang: Lang) {
  return (pl: string): string => {
    if (lang === 'pl') return pl;
    const entry = text[pl];
    if (!entry) throw new Error(`Brak tłumaczenia (${lang}): "${pl}" w src/i18n/huty.json`);
    return entry[lang];
  };
}

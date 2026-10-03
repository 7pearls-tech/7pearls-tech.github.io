import dictionary from './huty.json';
import { config } from './config';
import type { Lang } from './t';

type Entries = Record<string, { en: string; de: string }>;
const script = dictionary.script as Entries;

// Literały JS w cudzysłowach lub apostrofach (bez przejść do nowej linii).
const LITERAL = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g;

/**
 * Skrypt kalkulatora jest pisany po polsku. Przy budowaniu EN/DE podmieniamy
 * całe literały ze słownika `script` oraz locale i adres case study.
 */
export function translateScript(source: string, lang: Lang): string {
  const cfg = config[lang];
  let out = source
    .replaceAll('"pl-PL"', JSON.stringify(cfg.locale))
    .replaceAll(config.pl.caseUrl, cfg.caseUrl);
  if (lang === 'pl') return out;

  return out.replace(LITERAL, (match, dq?: string, sq?: string) => {
    const body = dq ?? sq ?? '';
    const entry = script[body];
    if (!entry) return match;
    const translated = entry[lang];
    return dq !== undefined
      ? `"${translated}"`
      : `'${translated.replace(/\\'/g, "'").replace(/'/g, "\\'")}'`;
  });
}

import type { Lang } from './t';

/** Wszystko, co poza tekstami różni wersje językowe strony hut. */
export const config: Record<Lang, {
  htmlLang: string;
  locale: string;
  title: string;
  description: string;
  liveUrl: string;
  caseUrl: string;
  nexShrinkUrl: string;
  privacyUrl: string;
  currencies: string[];
}> = {
  pl: {
    htmlLang: 'pl',
    locale: 'pl-PL',
    title: 'Rękawy termokurczliwe dla hut szkła: kalkulator | Kablonex',
    description: 'Policz masę i koszt rękawa termokurczliwego na paletę szkła w 2 minuty. Scenariusze 90, 80 i 70 µm, bez podawania maila.',
    liveUrl: 'https://kablonex.pl/branze/opakowania-szklane-i-huty-szkla/',
    caseUrl: 'https://kablonex.pl/case-study/downgauging-ze-130-do-70-90-%c2%b5m-i-odpornosc-termiczna-w-transporcie-weekendowym-dla-wiodacej-huty-szkla-2/',
    nexShrinkUrl: 'https://kablonex.pl/produkty/nex-shrink/',
    privacyUrl: 'https://kablonex.pl/polityka-prywatnosci-i-cookies',
    currencies: ['PLN', 'EUR'],
  },
  en: {
    htmlLang: 'en',
    locale: 'en-GB',
    title: 'Shrink sleeves for glassworks: film calculator | Kablonex',
    description: 'Calculate the weight and cost of the shrink sleeve per pallet of glass in 2 minutes. Scenarios for 90, 80 and 70 µm, no email required.',
    liveUrl: 'https://kablonex.pl/en/industries/glass-packaging-and-glassworks/',
    caseUrl: 'https://kablonex.pl/en/case-study/downgauging-from-130-to-70-90-%c2%b5m-and-thermal-resistance-in-weekend-transport-for-a-leading-glassworks/',
    nexShrinkUrl: 'https://kablonex.pl/en/products/nex-shrink/',
    privacyUrl: 'https://kablonex.pl/en/privacy-and-cookies-policy/',
    currencies: ['EUR', 'PLN'],
  },
  de: {
    htmlLang: 'de',
    locale: 'de-DE',
    title: 'Schrumpfschläuche für Glashütten: Folienrechner | Kablonex',
    description: 'Berechnen Sie Gewicht und Kosten des Schrumpfschlauchs pro Glaspalette in 2 Minuten. Szenarien für 90, 80 und 70 µm, ohne E-Mail-Angabe.',
    liveUrl: 'https://kablonex.pl/de/branchen/glasverpackungen-und-glashuetten/',
    caseUrl: 'https://kablonex.pl/de/fallstudie/dickenreduzierung-von-130-auf-70-90-%c2%b5m-und-thermische-bestaendigkeit-beim-wochenendtransport-fuer-ein-fuehrendes-glaswerk/',
    nexShrinkUrl: 'https://kablonex.pl/de/produkte/nex-shrink/',
    privacyUrl: 'https://kablonex.pl/de/datenschutz-und-cookie-richtlinie/',
    currencies: ['EUR', 'PLN'],
  },
};

# 7pearls-tech.github.io

Strona na GitHub Pages zbudowana w [Astro](https://astro.build). Jedyna treść: kalkulator folii dla hut szkła (kopia demonstracyjna strony z kablonex.pl, `noindex`, canonical na oryginał).

- https://7pearls-tech.github.io/huty/ (PL)
- https://7pearls-tech.github.io/en/huty/ (EN)
- https://7pearls-tech.github.io/de/huty/ (DE)

## Jak to działa

```
src/
  pages/huty/index.astro        PL  -> <HutyPage lang="pl" />
  pages/en/huty/index.astro     EN
  pages/de/huty/index.astro     DE
  components/huty/
    HutyPage.astro              składa stronę z sekcji
    Hero.astro ... Booking.astro  sekcje; teksty po polsku w t("...")
    Certs.astro                 loga certyfikatów
    client.js                   kalkulator (obliczenia + interfejs), po polsku
  i18n/
    huty.json                   słownik PL -> EN/DE: "text" (HTML) i "script" (literały JS)
    t.ts                        t(): tłumaczy tekst, brak tłumaczenia zatrzymuje build
    config.ts                   różnice między językami: linki, locale, waluty, title
    translate-script.ts         tłumaczy client.js przy budowaniu
  layouts/Base.astro            <head>, noindex, canonical, hreflang, przełącznik języków
  styles/huty.css               style strony (z WordPressa, prefiks .kxh)
```

**Zmiana tekstu:** popraw polski tekst w komponencie i ten sam klucz w `src/i18n/huty.json` (z wersjami EN/DE). Jeśli zapomnisz o słowniku, `npm run build` pokaże, którego tłumaczenia brakuje.

**Nowy język:** dodaj go w `astro.config.mjs`, `src/i18n/t.ts` (`LANGS`), `config.ts`, w słowniku i jako `src/pages/<lang>/huty/index.astro`.

## Lokalnie

```bash
npm install
npm run dev       # http://localhost:4321/huty/
npm run build     # wynik w dist/
```

## Publikacja

Push do `main` uruchamia `.github/workflows/deploy.yml`: GitHub buduje stronę i publikuje ją na Pages (ok. 1 min).

Formularz kontaktowy nie działa poza WordPressem, więc prowadzi do formularza na kablonex.pl.

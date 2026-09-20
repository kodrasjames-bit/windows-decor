# Konfigurátor dekorů

Frontendový konfigurátor oken, posuvného portálu, vchodových dveří, fasády a střechy rodinného domu. Obsahuje fotorealistický podklad dodaný uživatelem, tři plynule přepínatelné pohledy a všechny požadované vzorníky. Materiály se mění pomocí přesných místních masek při zachování fotografických detailů. Barvy a pohled se ukládají pouze do localStorage. Bez databáze, API, účtů, objednávek nebo placených služeb.

## Technologie a spuštění

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, vrstvené SVG, Vitest a React Testing Library. Použijte Node.js **22.18 nebo novější** (ověřeno s Node 24).

V adresáři tohoto README spusťte:

```sh
npm install
npm run dev
```

Otevřete http://localhost:3000. Na Windows s omezenou politikou PowerShellu lze použít `npm.cmd` namísto `npm`.

Jiný port:

```sh
npm run dev -- --port 3001
```

Vývojový server používá standardní programové rozhraní Next.js v jednom procesu (`scripts/dev.mjs`), včetně HMR. Důvodem je kompatibilita s prostředím Windows, které omezuje pipes podprocesů. Nejde o aplikační backend: všechny změny konfigurace probíhají v Reactu v prohlížeči. Pro standardní CLI je také možné spustit `npx next dev`.

## Předvedení z jiného PC přes GitHub Pages

Projekt je připraven pro repozitář `windows-decor`. Na prezentačním počítači stačí prohlížeč a internet; sestavení provede GitHub. Podrobný postup bez instalací je v [GITHUB-PAGES.md](GITHUB-PAGES.md).

Workflow `.github/workflows/pages.yml` při změně větve `main` nainstaluje závislosti podle `package-lock.json`, spustí lint a testy, vytvoří statický build včetně kontroly TypeScriptu a zveřejní `out/` přes GitHub Pages. Lze jej spustit i ručně v Actions. V repozitáři musí být zapnuté **Settings → Pages → Source: GitHub Actions**.

`actions/configure-pages` předá při sestavení `NEXT_PUBLIC_BASE_PATH` (pro tento projekt `/windows-decor`). Tuto hodnotu používá `next.config.ts` pro skripty a `lib/assetPath.ts` pro fotografii, textury, detailní textury a náhledy. Datové soubory nadále obsahují cesty `/houses/...` a `/textures/...`; název repozitáře do nich nevpisujte. Při lokálním spuštění bez této proměnné funguje původní kořenová adresa `http://localhost:3000/`.

Lokální ověření stejného sestavení v PowerShellu:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/windows-decor'
npm.cmd run build
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

Výstup pak musí HTTP server poskytovat pod `/windows-decor/`. Samotný adresář `out/` tuto složku neobsahuje; prefix je součástí URL. Pro návrat ke kořenovému lokálnímu náhledu spusťte znovu `npm run build` bez proměnné.

Oficiální dokumentace: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Next.js basePath](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath).

## Kontroly a produkční build

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run test:watch` spouští testy při změnách. Vitest používá nativní načítání konfigurace a již nainstalovaný TypeScript kompilátor místo pomocného procesu esbuild; proto je vyžadován novější Node.js.

Build vytváří statický web do `out/`. Je možné jej nasadit na libovolný statický HTTP hosting; nepotřebuje Node.js server. Neotvírejte `out/index.html` přes `file://`, protože web používá absolutní cesty k assetům. `next start` se při režimu `output: 'export'` nepoužívá.

Next.js má zapnuté `workerThreads` a vypnuté experimentální `useTypeScriptCli`, aby kontrola typů při buildu probíhala přes TypeScript API ve vlákně. Kontrola TypeScriptu není vynechána.

## Vytvořené zdrojové soubory

```text
app/
  globals.css                       Responzivní vzhled, Tailwind, focus a reduced motion
  icon.svg                          Ikona aplikace
  layout.tsx                        Český jazyk a metadata
  page.tsx                          Složení stránky a propojení stavu
components/
  HouseVisualizer/
    index.tsx                       Animace viewBox a registr rendererů
    ModernHouse.tsx                  Vrstvená ilustrace, světlo, perspektiva, okolí
    PhotographicHouse.tsx            Fotorealistický renderer s místními maskami
    Opening.tsx                      Parametrické okno, portál a dveře
    MaterialDefs.tsx                 SVG patterny a obrazové textury
  HouseSelector/index.tsx            Výběr domu, připravený na více karet
  ViewSwitcher/index.tsx             Tři přístupná tlačítka pohledů
  MaterialPalette/index.tsx          Vzorník barev a textur
  ConfigurationPanel/index.tsx       Sekce podle dostupných prvků domu
  ConfigurationSummary/index.tsx     Aktuální materiály s živým souhrnem
data/
  houses.ts                         Domy, otvory, pohledy a výchozí konfigurace
  linaPhoto.ts                      Geometrie masek a kalibrace světla podkladu
  windowMaterials.ts                Sedm dekorů oken a portálu
  doorMaterials.ts                  Sedm dekorů dveří
  facadeColors.ts                   Šest barev fasády
  roofColors.ts                     Pět barev střechy
hooks/
  useHouseConfiguration.ts          Centrální stav, validace a localStorage
types/
  configurator.ts                   Sdílené datové kontrakty
scripts/
  dev.mjs                           Vývojový server Next.js
tests/
  setup.ts                          Prostředí DOM a úklid mezi testy
  configurator.test.tsx              Funkční testy a kontrola hydratace
  photoMasks.test.tsx                Ochrana skel, kování, svodu a okolí domu
public/
  houses/lina-photo.png              Nezměněný fotorealistický podklad od uživatele
  textures/oak-grain.png             Generovaná jemná rastrová textura dřeva
  textures/README.md                 Původ textury a přesný generační prompt
.gitignore
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
package-lock.json
postcss.config.mjs
tsconfig.json
vitest.config.ts
README.md
```

`node_modules/`, `.next/`, `out/` a `tsconfig.tsbuildinfo` jsou generované soubory, nikoli zdrojový kód.

## Architektura a stav

`Home` vlastní jedinou instanci `useHouseConfiguration` a předává hodnoty a obsluhy událostí komponentám. Vizualizace nemá vlastní kopii výběru materiálů. Stav obsahuje `houseId`, `windowMaterialId`, `portalMaterialId`, `doorMaterialId`, `facadeColorId`, `roofColorId` a `activeView`.

Hook načte uložená data až po hydrataci, validuje každé ID proti katalogu a ignoruje neznámé hodnoty. Teprve potom zapisuje změny. Klíč úložiště je `decor-configurator:v1`. Poškozený JSON i zakázané ukládání nebrání používání aplikace. Reset obnoví celý výchozí stav včetně pohledu a přepíše uložená data.

V této verzi validátor vždy sjednotí `portalMaterialId` s `windowMaterialId`. Pro nezávislé ovládání portálu odstraňte toto sjednocení, automatické propojení v `setMaterial` a přidejte samostatnou sekci palety. SVG už samostatné materiály oken a portálu podporuje.

Aktivní renderer `PhotographicHouse` vkládá originální podklad 1448 × 1086 do SVG. Soubor není upravený. Nad ním má každý měnitelný povrch vlastní masku s výřezy pro skla, kování a neměnné prvky. Výplň materiálu se v každé masce kombinuje s lokální jasovou strukturou původního obrazu pomocí režimů multiply/screen; zůstávají tak zachované reliéfy krytiny, omítka, stíny ostění i profilace rámů. Samotný základní obrázek nemá barevný filtr. Sklo a odrazy jsou původní pixely, nikoli barevné SVG gradienty.

Dřevodekory používají jemnou generovanou rastrovou texturu, tónovanou podle materiálu. Na vodorovných částech profilů se kresba otáčí o 90°. Stav, pohledy i palety jsou společné pro fotografický renderer a původní `ModernHouse`, který zůstal jako alternativní geometrický renderer pro další modely. Fotorealistický vzhled je založen na dodané referenci; nelze z něj dovozovat, že jde o fotografii skutečné stavby. Míra detailu při přiblížení odpovídá rozlišení podkladu. Pro prodejní nasazení doporučujeme vlastní podklad alespoň 4K a skutečné vzorky výrobce; zobrazení odstínů je orientační.

## Jak přidat dekor a skutečnou texturu

Do příslušného pole v `data/windowMaterials.ts` (nebo katalogu dveří) přidejte unikátní záznam:

```ts
{
  id: 'dub-realisticky',
  name: 'Dub přírodní premium',
  type: 'texture',
  value: '#b4936d',
  thumbnail: '/textures/dub-thumbnail.webp',
  textureUrl: '/textures/dub.webp',
  detailTextureUrl: '/textures/dub-detail.webp',
  grainColor: '#725230',
}
```

1. Vytvořte složku `public/textures/` a vložte vlastní WebP nebo PNG soubory.
2. `value` je základní barva a podklad průhledné textury; `thumbnail` se používá ve vzorníku a souhrnu.
3. `textureUrl` vyplňuje jen příslušné rámy nebo dveře. Pro kvalitní spojení použijte bezešvou texturu s vertikální kresbou.
4. `detailTextureUrl` je volitelný obraz s vyšším rozlišením pro detail okna. Bez něj se používá běžná textura.
5. Není-li obrazová textura zadána, vykreslí se procedurální kresba podle `value` a `grainColor`. `type: 'color'` použijte pro jednolitý odstín.
6. U skutečné barevné textury výrobce ponechte `textureMode: 'original'` (nebo pole vynechte). Režim `textureMode: 'tint'` slouží pro neutrální světlou texturu, která se násobí základním odstínem; používají jej výchozí demonstrační dekory.

Velikost opakování obrazu (100 × 180 SVG jednotek) je soustředěna v `MaterialDefs.tsx`; lze ji později rozšířit na nastavení každého dekoru. Náhled v paletě je záměrně samostatný, protože výrobce může dodat jiný výřez. Pro vlastní soubory není nutná žádná další služba ani databáze. Používejte stabilní ID, aby uložené konfigurace zůstaly platné.

## Jak přidat dům

Pro další fotorealistický dům přidejte vlastní snímek do `public/houses/` a model s `renderer: 'photographic'`. Vlastnost `photo` obsahuje cestu k obrázku, jeho přesnou šířku/výšku a seznam `surfaces`. Každý povrch má stabilní `id`, přiřazení `material`, SVG polygon `path` a kalibraci `referenceLight`. Všechny souřadnice jsou v pixelech původního snímku. Uzavřené vnitřní podcesty představují výřezy (pravidlo evenodd); musí chránit skla, kování, parapety i další nepřebarvované prvky. `horizontalGrain` volitelně vymezuje vodorovné profily. Místa a počty otvorů jsou určeny podkladem a jeho maskami — změna pole `frontOpenings` fotografii nepřestaví. Masky připravte ke každému novému snímku a upravte všechny tři pohledy. Referencí je `data/linaPhoto.ts`.

Pro jinou sestavu stejné stavební hmoty přidejte záznam do `houses` v `data/houses.ts` s novým ID, názvem a popisem. `HouseSelector` vykreslí další kartu automaticky. Zadejte `availableElements` a pole `frontOpenings` a `sideOpenings` — každý otvor má vlastní ID, `kind`, souřadnice, šířku, výšku a počet křídel (`leaves`). Frontální souřadnice patří do lokálního systému přední stěny a boční do systému boční stěny; perspektivu řeší jejich rodičovská SVG transformace. Umístění nových otvorů musí zůstat v rozměrech stěn.

Pro dům s jinou hmotou, jinou střechou nebo perspektivou vytvořte nový renderer vedle `ModernHouse.tsx`, rozšiřte typ `HouseModel.renderer` a registr `renderers` v `HouseVisualizer/index.tsx`. Renderer dostává model, unikátní SVG prefix a výplně všech materiálů. Znovu může použít `Opening` a `MaterialDefs`. Nová geometrie nevyžaduje zásahy do hooku nebo palet.

`previewImage` se zobrazuje na kartě domu; bez něj karta použije společnou SVG ikonu. `availableElements` řídí viditelnost sekcí ovládání. Geometrický renderer čte seznam otvorů, fotografický renderer čte masky přiřazené k podkladu.

## Nastavení tří pohledů

Fasádní masky používají samostatné pole `cutouts`: odečítá se sjednocení výřezů rámů, parapetů a přesného obrysu svodu. Na rozdíl od kombinace překrývajících se otvorů v jedné evenodd cestě tak při překryvu nevznikne znovu obarvená plocha. Špalety jsou součástí fasády; výřezy oken sledují rámy, nikoli celé stavební otvory. Při přidávání domu prověřte tmavou fasádu zejména ve špaletách a kolem svodu.

Všechny cílové souřadnice jsou pouze v `data/houses.ts`, v `house.views`:

```ts
views: {
  full: { label: 'Celý dům', viewBox: [0, 0, 1448, 1086] },
  medium: { label: 'Přiblížení', viewBox: [484, 418, 884, 663] },
  'window-detail': { label: 'Detail okna', viewBox: [445, 565, 348, 261] },
}
```

Hodnoty jsou `[x, y, šířka, výška]` v souřadnicích celého SVG. Menší šířka a výška znamenají větší přiblížení; `x` a `y` určují polohu výřezu. Animace interpoluje stejné SVG během 480 ms a při rychlém přepínání pokračuje z právě dosaženého stavu. Respektuje `prefers-reduced-motion`.

## Přístupnost a ověření

Ovládání používá nativní tlačítka, `aria-pressed`, textové názvy, viditelný focus a značku zaškrtnutí. Tab přesouvá focus, Enter a mezerník aktivují volbu. SVG má titulek a popis aktuálních materiálů. Souhrn je `aria-live`. Mobilní dlaždice mají vzorek vysoký 51 px a další prostor pro popisek.

Automatické testy ověřují změny oken i portálu bez přebarvení skel, změny dveří, fasády a střechy, všechny tři pohledy na stejném SVG, reset, načtení a opětovné načtení localStorage, neplatná data, nedostupné ukládání, klávesnici a hydrataci serverového HTML.

Budoucí export obrázků/PDF, poptávky, vnitřní a vnější strana, varianty křídel a dveří zatím nejsou implementované. Materiálové katalogy, oddělené rendererové vrstvy a centrální konfigurace jsou rozšiřovací body pro tyto funkce.

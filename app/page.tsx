'use client';
import { HouseVisualizer } from '@/components/HouseVisualizer';
import { HouseSelector } from '@/components/HouseSelector';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { ConfigurationSummary } from '@/components/ConfigurationSummary';
import { useHouseConfiguration } from '@/hooks/useHouseConfiguration';
import { houses } from '@/data/houses';
export default function Home() {
  const {configuration,ready,storageAvailable,setMaterial,setView,setHouse,reset} = useHouseConfiguration();
  const house = houses.find(h=>h.id===configuration.houseId)!;
  return <>
    <header className="topbar"><div className="brand"><svg aria-hidden="true" width="29" height="29" viewBox="0 0 28 28" fill="none"><path d="M3 12 14 3l11 9v13H3Z" stroke="currentColor" strokeWidth="1.8"/><path d="M10 25V12h8v13M14 12v13" stroke="currentColor" strokeWidth="1.5"/></svg><span>DEKOR<span className="brand-light">STUDIO</span></span></div><span className="topbar-label">Váš dům. Váš styl.</span><span className="prototype">INTERAKTIVNÍ VZORNÍK</span></header>
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-7 lg:px-10">
      <div className="page-heading"><div><p className="eyebrow">MALÁ ZMĚNA. NOVÝ DOMOV.</p><h1>Konfigurátor dekorů</h1><p className="intro">Vyzkoušejte si různé kombinace dekorů oken, dveří, fasády a střechy.</p></div><button type="button" className="reset-button" onClick={reset} disabled={!ready}><span aria-hidden="true">↺</span> Obnovit výchozí nastavení</button></div>
      <div className="workspace">
        <section className="visual-column" aria-label="Vizualizace domu">
          <div className="visual-card">
            <div className="visual-toolbar"><HouseSelector houses={houses} selectedId={house.id} onChange={setHouse}/><span className="model-number">MODEL / 01</span></div>
            <HouseVisualizer house={house} configuration={configuration}/>
            <div className="view-controls"><ViewSwitcher house={house} value={configuration.activeView} onChange={setView}/><span className="view-hint">Prozkoumejte každý detail</span></div>
            <ConfigurationSummary configuration={configuration}/>
          </div>
          <div className="below-visual"><p><span aria-hidden="true">ⓘ</span> Odstíny na obrazovce jsou orientační. Pro přesnou volbu použijte fyzický vzorník.</p><span role="status">{!ready?'Načítání konfigurace…':storageAvailable?'✓ Automaticky uloženo v prohlížeči':'Ukládání není dostupné; změny platí do zavření stránky.'}</span></div>
        </section>
        <ConfigurationPanel configuration={configuration} house={house} onChange={setMaterial}/>
      </div>
      <footer><span>DEKORSTUDIO <span className="footer-divider">/</span> Prostor pro vaše představy</span><span>Jeden dům. Spousta možností.</span></footer>
    </main>
  </>;
}

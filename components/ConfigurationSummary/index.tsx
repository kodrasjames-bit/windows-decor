import { swatchStyle } from '@/components/MaterialPalette';
import { windowMaterials } from '@/data/windowMaterials';
import { doorMaterials } from '@/data/doorMaterials';
import { facadeColors } from '@/data/facadeColors';
import { roofColors } from '@/data/roofColors';
import type { HouseConfiguration } from '@/types/configurator';
export function ConfigurationSummary({ configuration }: { configuration:HouseConfiguration }) {
  const items = [
    {label:'Okna a portál', material:windowMaterials.find(m=>m.id===configuration.windowMaterialId)!},
    {label:'Dveře', material:doorMaterials.find(m=>m.id===configuration.doorMaterialId)!},
    {label:'Fasáda', material:facadeColors.find(m=>m.id===configuration.facadeColorId)!},
    {label:'Střecha', material:roofColors.find(m=>m.id===configuration.roofColorId)!},
  ];
  return <div className="summary" aria-live="polite" aria-atomic="true" aria-label="Souhrn konfigurace">{items.map(({label,material})=><div className="summary-item" key={label}><span className="summary-swatch" style={swatchStyle(material)} aria-hidden="true"/><div><span>{label}</span><strong>{material.name}</strong></div></div>)}</div>;
}

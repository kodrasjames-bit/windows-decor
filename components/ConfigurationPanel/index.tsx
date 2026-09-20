import { MaterialPalette } from '@/components/MaterialPalette';
import { windowMaterials } from '@/data/windowMaterials';
import { doorMaterials } from '@/data/doorMaterials';
import { facadeColors } from '@/data/facadeColors';
import { roofColors } from '@/data/roofColors';
import type { HouseConfiguration, HouseModel, MaterialField } from '@/types/configurator';
const sections = [
  { title:'Okna a posuvný portál', field:'windowMaterialId', materials:windowMaterials, element:'windows' },
  { title:'Vchodové dveře', field:'doorMaterialId', materials:doorMaterials, element:'entranceDoor' },
  { title:'Fasáda', field:'facadeColorId', materials:facadeColors, element:'facade' },
  { title:'Střecha', field:'roofColorId', materials:roofColors, element:'roof' },
] as const;
export function ConfigurationPanel({ configuration, house, onChange }: { configuration:HouseConfiguration; house:HouseModel; onChange:(field:MaterialField,id:string)=>void }) {
  const visibleSections = sections.filter(section => section.field === 'windowMaterialId'
    ? house.availableElements.windows || house.availableElements.slidingPortal
    : house.availableElements[section.element]);
  return <aside className="configuration-panel" aria-label="Materiály domu">
    <div className="panel-heading"><div><p className="eyebrow">VAŠE KOMBINACE</p><h2>Materiály a barvy</h2></div><span className="step-count">{String(visibleSections.length).padStart(2,'0')} prvky</span></div>
    {visibleSections.map((section,index)=><section className="material-section" key={section.field}>
      <div className="section-heading"><h3><span>{String(index+1).padStart(2,'0')}</span>{section.title}</h3><span className="chosen-name">{section.materials.find(m=>m.id===configuration[section.field])?.name}</span></div>
      <MaterialPalette label={section.title} materials={[...section.materials]} selectedId={configuration[section.field]} onChange={id=>onChange(section.field,id)}/>
      {index===0 && <p className="linked-note"><span aria-hidden="true">↔</span> Okna a portál používají stejný dekor.</p>}
    </section>)}
  </aside>;
}

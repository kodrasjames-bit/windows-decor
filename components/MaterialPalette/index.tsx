import type { CSSProperties } from 'react';
import type { MaterialOption } from '@/types/configurator';
import { assetPath } from '@/lib/assetPath';
export function swatchStyle(material: MaterialOption): CSSProperties {
  return {
    backgroundColor: material.value,
    backgroundImage: material.thumbnail || material.textureUrl
      ? `url("${assetPath((material.thumbnail || material.textureUrl)!)}")`
      : material.type === 'texture'
        ? `repeating-linear-gradient(92deg, transparent 0px, ${material.grainColor}66 1px, transparent 2px, transparent 5px, ${material.grainColor}55 6px, transparent 8px), repeating-linear-gradient(87deg, transparent 0px, #ffffff22 3px, transparent 5px, transparent 13px)`
        : undefined,
    backgroundSize: material.thumbnail || material.textureUrl ? 'cover' : undefined,
    backgroundBlendMode: material.textureMode==='tint' && !material.thumbnail ? 'multiply' : undefined,
  };
}
export function MaterialPalette({ label, materials, selectedId, onChange }: { label: string; materials: MaterialOption[]; selectedId: string; onChange: (id:string)=>void }) {
  return <div className="palette" role="group" aria-label={label}>
    {materials.map(material => <button key={material.id} type="button" className={`material ${selectedId===material.id?'selected':''}`} aria-pressed={selectedId===material.id} onClick={()=>onChange(material.id)}>
      <span className="swatch" style={swatchStyle(material)}>{selectedId===material.id && <span className="check" aria-hidden="true">✓</span>}</span>
      <span className="material-name">{material.name}</span>
    </button>)}
  </div>;
}

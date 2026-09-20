import type { HouseModel } from '@/types/configurator';
import Image from 'next/image';
import { assetPath } from '@/lib/assetPath';
export function HouseSelector({ houses, selectedId, onChange }: { houses: HouseModel[]; selectedId:string; onChange:(id:string)=>void }) {
  return <div className="house-selector" role="group" aria-label="Typ domu">{houses.map(house=><button key={house.id} type="button" aria-pressed={selectedId===house.id} onClick={()=>onChange(house.id)} className="house-card">
    <span className="house-icon" aria-hidden="true">{house.previewImage?<Image src={assetPath(house.previewImage)} width={64} height={48} alt=""/>:<svg width="39" height="34" viewBox="0 0 48 40" fill="none"><path d="M4 19 19 6l25 9-12 13Z" fill="#556967"/><path d="M5 20v13l26 6V28Z" fill="#ddd8c9"/><path d="m31 28 13-12v15l-13 8Z" fill="#afbaae"/><path d="M11 24v8l9 2v-8Z" fill="#7c9395"/><path d="M24 27v10l5 1V28Z" fill="#526764"/></svg>}</span>
    <span><strong>{house.name}</strong><small>{house.description}</small></span><span className="house-selected" aria-hidden="true">{selectedId===house.id?'✓':'+'}</span>
  </button>)}</div>;
}

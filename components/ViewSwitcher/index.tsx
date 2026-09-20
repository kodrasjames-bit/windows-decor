import type { HouseModel, ViewId } from '@/types/configurator';
export function ViewSwitcher({ house, value, onChange }: { house: HouseModel; value: ViewId; onChange:(id:ViewId)=>void }) {
  return <div className="view-switcher" role="group" aria-label="Pohled na dům">{(Object.keys(house.views) as ViewId[]).map((id,i)=><button type="button" key={id} aria-pressed={value===id} onClick={()=>onChange(id)}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{i===0?<><path d="m3 11 9-8 9 8M5 9v12h14V9M10 21v-7h4v7"/></>:i===1?<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6M10 7v6"/></>:<><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 15h16"/></>}</svg>
    {house.views[id].label}
  </button>)}</div>;
}

'use client';
import { useEffect, useId, useRef } from 'react';
import type { HouseConfiguration, HouseModel } from '@/types/configurator';
import { windowMaterials } from '@/data/windowMaterials';
import { doorMaterials } from '@/data/doorMaterials';
import { facadeColors } from '@/data/facadeColors';
import { roofColors } from '@/data/roofColors';
import { MaterialDefs, materialFill } from './MaterialDefs';
import { ModernHouse } from './ModernHouse';
import { PhotographicHouse } from './PhotographicHouse';
const renderers = { 'modern-gable': ModernHouse, photographic:PhotographicHouse };
export function HouseVisualizer({ house, configuration }: { house: HouseModel; configuration: HouseConfiguration }) {
  const prefix = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const currentBox = useRef(house.views[configuration.activeView].viewBox);
  const target = house.views[configuration.activeView].viewBox;
  useEffect(() => {
    const from = [...currentBox.current];
    const start = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const animate = (now: number) => {
      const t = reduced ? 1 : Math.min((now-start)/480, 1);
      const ease = 1-Math.pow(1-t, 3);
      const box = target.map((value,i) => from[i]+(value-from[i])*ease) as typeof target;
      currentBox.current = box;
      svg.current?.setAttribute('viewBox', box.join(' '));
      if (t<1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  const windows = windowMaterials.find(m=>m.id===configuration.windowMaterialId)!;
  const portal = windowMaterials.find(m=>m.id===configuration.portalMaterialId)!;
  const door = doorMaterials.find(m=>m.id===configuration.doorMaterialId)!;
  const facade = facadeColors.find(m=>m.id===configuration.facadeColorId)!;
  const roof = roofColors.find(m=>m.id===configuration.roofColorId)!;
  const Renderer = renderers[house.renderer];
  return <div className={`scene ${house.renderer==='photographic'?'scene-photo':''}`} data-view={configuration.activeView}>
    <svg ref={svg} viewBox={house.views.full.viewBox.join(' ')} role="img" aria-labelledby={`${prefix}-title ${prefix}-description`} preserveAspectRatio="xMidYMid meet">
      <title id={`${prefix}-title`}>{`${house.name} – ${house.views[configuration.activeView].label}`}</title>
      <desc id={`${prefix}-description`}>{`Okna a portál: ${windows.name}. Dveře: ${door.name}. Fasáda: ${facade.name}. Střecha: ${roof.name}.`}</desc>
      <MaterialDefs prefix={prefix} materials={{ windows, portal, door }} detail={configuration.activeView==='window-detail'}/>
      <Renderer house={house} prefix={prefix} fills={{ windows: materialFill(windows,'windows',prefix), portal: materialFill(portal,'portal',prefix), door: materialFill(door,'door',prefix), facade: facade.value, roof: roof.value }}/>
    </svg>
    <div className="scene-caption"><span className="small-cross">+</span> {house.views[configuration.activeView].label}<span>EXTERIÉR</span></div>
  </div>;
}

import type { MaterialOption } from '@/types/configurator';
import { Fragment } from 'react';
import { assetPath } from '@/lib/assetPath';
export function materialFill(material: MaterialOption, slot: string, prefix: string) {
  return material.type === 'texture' ? `url(#${prefix}-${slot})` : material.value;
}
export function MaterialDefs({ materials, prefix, detail }: { materials: Record<string, MaterialOption>; prefix: string; detail: boolean }) {
  return <defs>{Object.entries(materials).map(([slot, material]) => {
    if (material.type !== 'texture') return null;
    const texture = (detail && material.detailTextureUrl) || material.textureUrl;
    const source = texture ? assetPath(texture) : undefined;
    const tint=source && material.textureMode==='tint';
    const rgb=[1,3,5].map(start=>parseInt(material.value.slice(start,start+2),16)/255);
    return <Fragment key={slot}>
      {tint && <filter id={`${prefix}-${slot}-tint`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={`${rgb[0]} 0 0 0 0 0 ${rgb[1]} 0 0 0 0 0 ${rgb[2]} 0 0 0 0 0 1 0`}/></filter>}
      <pattern id={`${prefix}-${slot}`} width={source ? 100 : 26} height={source ? 180 : 160} patternUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill={material.value} />
      {source ? <image href={source} width="100" height="180" preserveAspectRatio="xMidYMid slice" filter={tint?`url(#${prefix}-${slot}-tint)`:undefined} /> : <g fill="none" stroke={material.grainColor || '#50301b'}>
        <path d="M2 -10 Q8 35 3 78 T4 170 M9 -10 Q4 38 10 75 T9 170 M18 -10 Q25 50 19 99 T20 170" strokeWidth=".8" opacity=".47" />
        <path d="M12 -10 Q18 42 13 80 T14 170 M23 -10 Q18 30 24 75 T24 170" strokeWidth=".45" opacity=".65" />
        <path d="M4 37 Q14 69 5 97 Q-1 63 4 37 M4 51 Q9 68 5 81" strokeWidth=".6" opacity=".45" />
        <path d="M1 0 V160 M16 0 V160" stroke="#fff" opacity=".17" strokeWidth="1.2" />
      </g>}
    </pattern><pattern id={`${prefix}-${slot}-horizontal`} href={`#${prefix}-${slot}`} patternTransform="rotate(90)"/></Fragment>;
  })}</defs>;
}

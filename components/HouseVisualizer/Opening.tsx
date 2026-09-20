import type { Opening as OpeningModel } from '@/types/configurator';
export function Opening({ opening, fill, prefix }: { opening: OpeningModel; fill: string; prefix: string }) {
  const { id, x, y, width: w, height: h, leaves, kind } = opening;
  const border = kind === 'door' ? 6 : 8;
  return <g id={id} transform={`translate(${x} ${y})`}>
    <rect x="-7" y="-7" width={w + 14} height={h + 14} fill="#514e46" opacity=".35" />
    <path d={`M-7 -7 H${w + 7} L${w} 0 H0 V${h} L-7 ${h+7}Z`} fill="#33342f" opacity=".28" />
    <rect data-testid={`${id}-frame`} width={w} height={h} fill={fill} stroke="#242720" strokeWidth="1" />
    {kind === 'door' ? <>
      <rect x="7" y="7" width={w-14} height={h-14} fill={fill} stroke="#000" strokeOpacity=".32" />
      {[54,101,148,195].map(v => <path key={v} d={`M9 ${v} H${w-9}`} stroke="#080e13" opacity=".3" strokeWidth="1.2" />)}
      <rect x={w-23} y="68" width="4" height="84" rx="2" fill={`url(#${prefix}-metal)`} />
      <circle cx={w-21} cy="165" r="2" fill="#c4cccc" />
    </> : <>
      {Array.from({length: leaves}, (_, i) => {
        const panel = (w - border * 2) / leaves;
        const left = border + i * panel;
        return <g key={i}>
          <rect x={left} y={border} width={panel} height={h-border*2} fill={fill} stroke="#000" strokeOpacity=".42" strokeWidth=".8" />
          <rect x={left+5} y={border+5} width={panel-10} height={h-border*2-10} fill={`url(#${prefix}-glass)`} stroke="#182c32" strokeWidth="2" />
          <path d={`M${left+6} ${h*.64} Q${left+panel*.5} ${h*.53} ${left+panel-6} ${h*.65} V${h-border-6} H${left+6}Z`} fill="#4c655d" opacity=".22" />
          <path d={`M${left+7} ${border+7} H${left+panel-7} L${left+7} ${h*.76}Z`} fill="#fff" opacity=".17" />
          <path d={`M${left+panel*.68} ${border+6} V${h-border-6}`} stroke="#e6f4f2" opacity=".18" strokeWidth={panel*.12} />
          <path d={`M${left+1} ${h-border-1} V${border+1} H${left+panel-1}`} fill="none" stroke="#fff" opacity=".3" strokeWidth="1" />
        </g>;
      })}
      <rect x={leaves > 1 ? w/2-4 : w-12} y={h*.48} width="3" height={kind==='portal'?26:15} rx="1.5" fill={`url(#${prefix}-metal)`} stroke="#343f43" strokeWidth=".5" />
      <path d={`M-8 ${h+4} H${w+8} L${w+13} ${h+9} H-5Z`} fill="#b0afa6" />
      <path d={`M-5 ${h+9} H${w+13}`} stroke="#5a5e56" strokeWidth="2" opacity=".45" />
    </>}
    <path d={`M1 ${h-1} V1 H${w-1}`} fill="none" stroke="#fff" strokeOpacity=".35" />
  </g>;
}

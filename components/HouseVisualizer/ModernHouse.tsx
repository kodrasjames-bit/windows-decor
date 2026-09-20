import type { HouseModel } from '@/types/configurator';
import { Opening } from './Opening';
type Props = { house: HouseModel; prefix: string; fills: { windows: string; portal: string; door: string; facade: string; roof: string } };
export function ModernHouse({ house, prefix: p, fills }: Props) {
  return <>
    <defs>
      <linearGradient id={`${p}-sky`} x2="0" y2="1"><stop stopColor="#e3edf0"/><stop offset=".7" stopColor="#f5f6ef"/><stop offset="1" stopColor="#dce1d3"/></linearGradient>
      <linearGradient id={`${p}-lawn`} x2="0" y2="1"><stop stopColor="#c3cdb5"/><stop offset="1" stopColor="#8c9e78"/></linearGradient>
      <linearGradient id={`${p}-glass`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#7799a7"/><stop offset=".42" stopColor="#b4cbd0"/><stop offset=".43" stopColor="#8ba5a4"/><stop offset="1" stopColor="#344c48"/></linearGradient>
      <linearGradient id={`${p}-metal`}><stop stopColor="#646d70"/><stop offset=".5" stopColor="#e4e7e5"/><stop offset="1" stopColor="#7b8487"/></linearGradient>
      <linearGradient id={`${p}-roof-light`} x2="0" y2="1"><stop stopColor="#fff" stopOpacity=".2"/><stop offset="1" stopColor="#000" stopOpacity=".26"/></linearGradient>
      <linearGradient id={`${p}-wall-light`} x2="0" y2="1"><stop stopColor="#514637" stopOpacity=".2"/><stop offset=".15" stopColor="#fff" stopOpacity=".11"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
      <radialGradient id={`${p}-bush`} cx=".3" cy=".2"><stop stopColor="#9ba77b"/><stop offset=".5" stopColor="#637455"/><stop offset="1" stopColor="#394b3c"/></radialGradient>
      <filter id={`${p}-blur`}><feGaussianBlur stdDeviation="13"/></filter>
      <filter id={`${p}-grain`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".065"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
      <pattern id={`${p}-roof-seams`} width="36" height="250" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .12 -.95 .7 0 0)"><path d="M1 0 V250" stroke="#000" strokeOpacity=".25" strokeWidth="1.8"/><path d="M3 0 V250" stroke="#fff" strokeOpacity=".13"/></pattern>
    </defs>
    <rect x="-1000" y="-1000" width="3200" height="2500" fill={`url(#${p}-sky)`}/>
    <path d="M-100 473 Q150 390 390 450 T920 425 T1350 450 V1000 H-100Z" fill="#c4cdb9" opacity=".48"/>
    <g opacity=".4" fill="#a2b296"><ellipse cx="68" cy="412" rx="100" ry="75"/><ellipse cx="1150" cy="385" rx="108" ry="110"/></g>
    <path d="M-100 524 Q480 455 1300 480 V1100 H-100Z" fill={`url(#${p}-lawn)`}/>
    <path d="M40 710 L965 755 1200 605 546 487Z" fill="#3c4436" opacity=".22" filter={`url(#${p}-blur)`}/>
    <path d="M101 654 L832 755 1141 591 445 513Z" fill="#b0ada2"/>
    <path d="M101 645 L832 740 1141 578 445 503Z" fill="#dedbd0"/>
    <g stroke="#a5a79e" strokeWidth=".8" opacity=".55"><path d="M134 666 L847 758 M176 642 L904 717 M288 583 L1014 650 M418 514 L1136 593 M268 665 L559 516 M448 690 L724 546 M630 714 L908 563 M818 738 L1100 591"/></g>
    <g transform="matrix(1 .12 0 1 140 350)">
      <path data-testid="facade-front" d="M0 0 H680 V290 H0Z" fill={fills.facade}/>
      <path d="M0 0 H680 V290 H0Z" fill={`url(#${p}-wall-light)`} filter={`url(#${p}-grain)`}/>
      <path d="M0 279 H680 V290 H0Z" fill="#7c7c71" opacity=".5"/>
      <path d="M0 0 H680 V17 H0Z" fill="#212821" opacity=".23"/>
      {house.frontOpenings.map(opening => <Opening key={opening.id} opening={opening} prefix={p} fill={opening.kind==='portal'?fills.portal:opening.kind==='door'?fills.door:fills.windows}/>)}
      <rect x="650" y="105" width="7" height="23" rx="1" fill="#414847"/>
      <path d="M646 138 L661 138 675 189 635 189Z" fill="#fff6c4" opacity=".09"/>
    </g>
    <g transform="matrix(.86 -.4 0 1 820 431.6)">
      <path data-testid="facade-side" d="M0 0 H300 V290 H0Z" fill={fills.facade}/>
      <path d="M0 0 H300 V290 H0Z" fill="#354244" opacity=".19" filter={`url(#${p}-grain)`}/>
      <path d="M0 279 H300 V290 H0Z" fill="#555f58" opacity=".4"/>
      {house.sideOpenings.map(opening => <Opening key={opening.id} opening={opening} prefix={p} fill={fills.windows}/>)}
    </g>
    <path d="M820 432 L1003 247 1078 312Z" fill={fills.facade}/>
    <path d="M820 432 L1003 247 1078 312Z" fill="#354244" opacity=".2"/>
    <path d="M119 340 L348 166 1004 244 840 427Z" fill={fills.roof} data-testid="roof"/>
    <path d="M119 340 L348 166 1004 244 840 427Z" fill={`url(#${p}-roof-light)`}/>
    <path d="M119 340 L348 166 1004 244 840 427Z" fill={`url(#${p}-roof-seams)`}/>
    <path d="M119 340 L840 427 840 439 119 351Z" fill={fills.roof}/>
    <path d="M119 349 L839 436" fill="none" stroke="#182024" strokeWidth="5"/>
    <path d="M840 430 L1004 244 1093 306" fill="none" stroke={fills.roof} strokeWidth="13" strokeLinejoin="round"/>
    <path d="M841 428 L1004 240 1095 303 M347 165 L1004 243" fill="none" stroke="#ccd4d6" strokeOpacity=".38" strokeWidth="2"/>
    <path d="M824 438 V712" stroke="#263235" strokeWidth="7"/><path d="M822 440 V711" stroke="#b2b8b6" strokeOpacity=".4" strokeWidth="2"/>
    <path d="M776 716 L741 737 800 745 834 727Z" fill="#c2bfb4"/>
    <g>
      <ellipse cx="1114" cy="603" rx="62" ry="12" fill="#354a35" opacity=".18"/>
      <path d="M1109 598 Q1115 440 1107 366" fill="none" stroke="#7c7961" strokeWidth="8"/>
      <path d="M1113 480 L1073 427 M1112 453 L1150 398" fill="none" stroke="#7c7961" strokeWidth="4"/>
      {[ [1080,390,51],[1147,367,53],[1109,330,61],[1098,411,45],[1160,415,40] ].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill={`url(#${p}-bush)`}/>)}
    </g>
    <g fill={`url(#${p}-bush)`}>
      <ellipse cx="122" cy="625" rx="46" ry="33"/><ellipse cx="157" cy="644" rx="35" ry="27"/><ellipse cx="99" cy="642" rx="33" ry="25"/>
      <ellipse cx="986" cy="655" rx="42" ry="30"/><ellipse cx="1024" cy="635" rx="33" ry="23"/>
    </g>
    <g stroke="#78825d" strokeWidth="2" fill="none" opacity=".8"><path d="M69 668 Q44 617 43 604 M70 668 Q64 607 78 585 M72 668 Q82 623 100 611 M1080 630 Q1060 579 1066 561 M1080 630 Q1080 574 1091 552 M1080 630 Q1100 589 1108 587"/></g>
  </>;
}

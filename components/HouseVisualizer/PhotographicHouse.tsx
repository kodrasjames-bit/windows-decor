import type { HouseModel, PhotoSurface } from '@/types/configurator';
import { assetPath } from '@/lib/assetPath';

type Props = {
  house:HouseModel;
  prefix:string;
  fills:Record<PhotoSurface['material'],string>;
};

/** Original pixels supply lighting and fine surface relief, separately inside each mask. */
export function PhotographicHouse({house,prefix,fills}:Props) {
  const scene=house.photo;
  if (!scene) throw new Error(`Chybí fotografická scéna domu ${house.id}.`);
  const source = assetPath(scene.source);
  return <g data-testid="photographic-house" style={{isolation:'isolate'}}>
    <defs>
      {scene.surfaces.map(surface=>{
        const exponent=surface.material==='facade'?1:.7;
        const amplitude=Math.pow(surface.referenceLight,-exponent);
        return <g key={surface.id}>
          <clipPath id={`${prefix}-${surface.id}-mask`} clipPathUnits="userSpaceOnUse">
            <path d={surface.path} clipRule="evenodd"/>
          </clipPath>
          {surface.cutouts && <mask id={`${prefix}-${surface.id}-cutouts`} maskUnits="userSpaceOnUse" x="0" y="0" width={scene.width} height={scene.height} style={{maskType:'luminance'}}>
            <rect width={scene.width} height={scene.height} fill="white"/>
            {surface.cutouts.map((path,index)=><path key={index} d={path} fill="black"/>)}
          </mask>}
          <filter id={`${prefix}-${surface.id}-light`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncR type="gamma" amplitude={amplitude} exponent={exponent} offset="0"/>
              <feFuncG type="gamma" amplitude={amplitude} exponent={exponent} offset="0"/>
              <feFuncB type="gamma" amplitude={amplitude} exponent={exponent} offset="0"/>
            </feComponentTransfer>
          </filter>
          <filter id={`${prefix}-${surface.id}-shine`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.4" intercept={-surface.referenceLight*1.4}/>
              <feFuncG type="linear" slope="1.4" intercept={-surface.referenceLight*1.4}/>
              <feFuncB type="linear" slope="1.4" intercept={-surface.referenceLight*1.4}/>
            </feComponentTransfer>
          </filter>
        </g>;
      })}
    </defs>
    <image data-testid="house-photo" href={source} width={scene.width} height={scene.height}/>
    {scene.surfaces.map(surface=><g key={surface.id} clipPath={`url(#${prefix}-${surface.id}-mask)`} mask={surface.cutouts?`url(#${prefix}-${surface.id}-cutouts)`:undefined} style={{isolation:'isolate'}}>
      <path data-testid={surface.id} d={surface.path} fillRule="evenodd" fill={fills[surface.material]}/>
      {surface.horizontalGrain && fills[surface.material].startsWith('url(') && <path d={surface.horizontalGrain} fill={`url(#${prefix}-${surface.material}-horizontal)`}/>}
      <image href={source} width={scene.width} height={scene.height} filter={`url(#${prefix}-${surface.id}-light)`} style={{mixBlendMode:'multiply'}}/>
      <image href={source} width={scene.width} height={scene.height} filter={`url(#${prefix}-${surface.id}-shine)`} opacity={surface.material==='facade'?.12:.4} style={{mixBlendMode:'screen'}}/>
    </g>)}
  </g>;
}

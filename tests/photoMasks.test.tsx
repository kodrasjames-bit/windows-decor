import { describe, expect, it } from 'vitest';
import type { PhotoSurface } from '@/types/configurator';
import { linaPhoto } from '@/data/linaPhoto';

// Independent hit test for the M/L/Z polygon masks. Check photographic landmarks,
// not a duplicate of the renderer: these points must never receive material tint.
function covers(path:string,x:number,y:number) {
  let inside=false;
  for(const part of path.split(/Z/i)) {
    const numbers=part.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
    const points=Array.from({length:numbers.length/2},(_,i)=>[numbers[i*2],numbers[i*2+1]]);
    for(let i=0,j=points.length-1;i<points.length;j=i++) {
      const [xi,yi]=points[i], [xj,yj]=points[j];
      if((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) inside=!inside;
    }
  }
  return inside;
}
function surfaceCovers(surface:PhotoSurface,x:number,y:number) { return covers(surface.path,x,y) && !surface.cutouts?.some(path=>covers(path,x,y)); }
describe('Fotografické masky',()=>{
  it.each([
    ['levé sklo hlavního okna',570,690], ['pravé sklo hlavního okna',650,690],
    ['sklo těsně pod levou horní lištou',570,623], ['sklo těsně pod pravou horní lištou',648,626],
    ['levý okraj hlavního skla',542,700],
    ['levé sklo portálu',1100,750], ['pravé sklo portálu',1220,750],
    ['sklo při levé hraně portálu bez svislého rámu',1063,750],
    ['sklo těsně pod horním levým profilem portálu',1100,649],
    ['sklo těsně pod horním pravým profilem portálu',1200,653],
    ['levá hrana pravého skla portálu',1171,750],
    ['malé boční okno',155,700], ['horní boční okno',198,430],
    ['sklo dveří',864,750], ['madlo dveří',906,754],
    ['svod',422,750], ['okap',800,517], ['obloha',650,100], ['zahrada',700,1020],
    ['koleno svodu',437,518], ['parapet malého okna',145,760], ['parapet horního okna',190,507],
    ['levá část hlavního parapetu',550,790], ['pravá část hlavního parapetu',690,787],
    ['kamenný práh portálu',1200,873],
    ['spodní okraj mimo dekor portálu',1100,874],
  ])('chrání oblast: %s',(_,x,y)=>{
    expect(linaPhoto.surfaces.filter(surface=>surfaceCovers(surface,Number(x),Number(y))).map(s=>s.id)).toEqual([]);
  });
  it.each([
    ['facade-front',800,700], ['facade-side',250,700], ['roof',700,360],
    ['living-window-frame',610,680], ['sliding-portal-frame',1160,700], ['entrance-frame',883,750],
    ['living-window-frame',540,608], ['living-window-frame',610,610], ['living-window-frame',680,613],
    ['living-window-frame',689,700], ['living-window-frame',536,700], ['living-window-frame',610,785],
  ])('obsahuje požadovaný povrch: %s',(id,x,y)=>{
    expect(covers(linaPhoto.surfaces.find(surface=>surface.id===id)!.path,Number(x),Number(y))).toBe(true);
  });
  it('přenechává horní a vnější profil pouze dekoru oken, nikoli fasádě',()=>{
    for(const [x,y] of [[540,608],[610,610],[680,613],[689,700],[536,700],[610,785]]) {
      expect(linaPhoto.surfaces.filter(surface=>surfaceCovers(surface,x,y)).map(surface=>surface.id)).toEqual(['living-window-frame']);
    }
  });
  it.each([
    ['špaleta spodního bočního okna',130,700,'facade-side'],
    ['špaleta horního bočního okna',180,430,'facade-side'],
    ['vnitřní okraj levé špalety horního okna',189,430,'facade-side'],
    ['špaleta u spodního levého rohu horního rámu',187,499,'facade-side'],
    ['špaleta u horního levého rohu horního rámu',188,377,'facade-side'],
    ['levý profil horního rámu',193,430,'upper-window-frame'],
    ['středový sloupek portálu bez šedého obdélníku',1160,765,'sliding-portal-frame'],
    ['spodní levý roh rámu portálu',1061.5,872,'sliding-portal-frame'],
    ['ostění za pravým vnějším profilem portálu',1279,750,'facade-front'],
    ['horní vnější rám dveří',860,635,'entrance-frame'],
    ['pravý vnější rám dveří',921,750,'entrance-frame'],
    ['dveře vlevo od madla',899,750,'entrance-frame'],
    ['dveře vpravo od madla',912,760,'entrance-frame'],
    ['dveře pod madlem',906,795,'entrance-frame'],
    ['špaleta vpravo od dveřního rámu',927,750,'facade-front'],
    ['horní špaleta bočního okna',190,363,'facade-side'],
    ['omítka vlevo od svodu',416,750,'facade-front'],
    ['omítka vpravo od svodu',432,750,'facade-front'],
    ['omítka u kolena svodu',418,526,'facade-front'],
    ['roh domu',399,750,'facade-side'],
    ['omítka při šikmé hraně štítu',390,495,'facade-side'],
    ['stín pod hlavním parapetem',600,796,'facade-front'],
    ['omítka vlevo od hlavního parapetu',529,791,'facade-front'],
    ['omítka u pravého konce hlavního parapetu',702,794,'facade-front'],
    ['stín pod malým parapetem',145,763,'facade-side'],
    ['omítka vedle malého parapetu',173,759,'facade-side'],
    ['stín pod horním parapetem',190,510,'facade-side'],
    ['omítka vedle horního parapetu',213,500,'facade-side'],
    ['omítka pod prahem portálu',1100,880,'facade-front'],
    ['omítka nad levým výstupkem prahu portálu',1058,876,'facade-front'],
    ['omítka vedle levého výstupku prahu portálu',1057.5,878,'facade-front'],
    ['omítka těsně pod šikmou hranou štítu',299,340,'facade-side'],
    ['omítka u dolního konce hrany štítu',393,493,'facade-side'],
    ['hřeben střechy',600,211,'roof'],
    ['pravý krajový profil štítu',300,325,'roof'],
    ['levý krajový profil štítu',130,355,'roof'],
    ['dolní zakončení krajového profilu',405,499,'roof'],
  ])('přebarvuje dříve vynechané místo: %s',(_,x,y,expected)=>{
    expect(linaPhoto.surfaces.filter(surface=>surfaceCovers(surface,Number(x),Number(y))).map(surface=>surface.id)).toEqual([expected]);
  });
});


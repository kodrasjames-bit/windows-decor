import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { STORAGE_KEY, useHouseConfiguration } from '@/hooks/useHouseConfiguration';
import { defaultConfiguration, houses } from '@/data/houses';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
describe('Konfigurátor',()=>{
  beforeEach(()=>localStorage.clear());
  it('hydratuje serverové HTML bez ztráty SVG titulku nebo chyb',async()=>{
    const container=document.createElement('div');
    container.innerHTML=renderToString(<Home/>);document.body.append(container);
    const onRecoverableError=vi.fn();
    let root:ReturnType<typeof hydrateRoot>;
    await act(async()=>{root=hydrateRoot(container,<Home/>,{onRecoverableError});});
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(within(container).getByRole('img',{name:/Dům Lina – Celý dům/})).toHaveAccessibleName('Dům Lina – Celý dům Okna a portál: Zlatý dub. Dveře: Antracit. Fasáda: Krémová. Střecha: Antracitová.');
    await act(async()=>root.unmount());container.remove();
  });
  it('mění všechna okna i portál, ale nepřebarví sklo ani dveře',async()=>{
    render(<Home/>); const user=userEvent.setup();
    const photo=screen.getByTestId('house-photo');
    const source=photo.getAttribute('href');
    const frameMask=screen.getByTestId('living-window-frame').getAttribute('d');
    const doorFill=screen.getByTestId('entrance-frame').getAttribute('fill');
    await user.click(within(screen.getByRole('group',{name:'Okna a posuvný portál'})).getByRole('button',{name:'Černá'}));
    for(const id of ['living-window','small-window','upper-window','sliding-portal']) expect(screen.getByTestId(`${id}-frame`)).toHaveAttribute('fill','#1d2123');
    expect(photo).toHaveAttribute('href',source);
    expect(photo).not.toHaveAttribute('filter');
    expect(screen.getByTestId('living-window-frame')).toHaveAttribute('d',frameMask);
    expect(screen.getByTestId('entrance-frame')).toHaveAttribute('fill',doorFill);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toMatchObject({windowMaterialId:'black',portalMaterialId:'black'});
  });
  it('mění obě viditelné části fasády',async()=>{
    render(<Home/>);
    await userEvent.click(within(screen.getByRole('group',{name:'Fasáda'})).getByRole('button',{name:'Béžová'}));
    expect(screen.getByTestId('facade-front')).toHaveAttribute('fill','#cbbca5');
    expect(screen.getByTestId('facade-side')).toHaveAttribute('fill','#cbbca5');
  });
  it('mění střechu',async()=>{
    render(<Home/>);
    await userEvent.click(within(screen.getByRole('group',{name:'Střecha'})).getByRole('button',{name:'Cihlově červená'}));
    expect(screen.getByTestId('roof')).toHaveAttribute('fill','#a35841');
  });
  it('mění dveře nezávisle na rámech',async()=>{
    render(<Home/>);const before=screen.getByTestId('living-window-frame').getAttribute('fill');
    await userEvent.click(within(screen.getByRole('group',{name:'Vchodové dveře'})).getByRole('button',{name:'Červená'}));
    expect(screen.getByTestId('entrance-frame')).toHaveAttribute('fill','#8d3736');
    expect(screen.getByTestId('living-window-frame')).toHaveAttribute('fill',before);
  });
  it('přepíná všechny pohledy na stejném SVG a zachovává dekor',async()=>{
    render(<Home/>); const user=userEvent.setup();
    const svg=screen.getByRole('img',{name:/Dům Lina/}); const frame=screen.getByTestId('living-window-frame');
    const fill=frame.getAttribute('fill');
    for(const [id,label] of [['medium','Přiblížení'],['window-detail','Detail okna'],['full','Celý dům']] as const){
      await user.click(screen.getByRole('button',{name:label}));
      expect(screen.getByRole('button',{name:label})).toHaveAttribute('aria-pressed','true');
      await waitFor(()=>expect(svg).toHaveAttribute('viewBox',houses[0].views[id].viewBox.join(' ')));
      expect(screen.getByRole('img',{name:/Dům Lina/})).toBe(svg);expect(frame).toHaveAttribute('fill',fill);
    }
  });
  it('obnoví výchozí konfiguraci včetně localStorage',async()=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify({...defaultConfiguration,windowMaterialId:'black',facadeColorId:'beige',roofColorId:'brick',activeView:'window-detail'}));
    render(<Home/>);
    await userEvent.click(screen.getByRole('button',{name:'Obnovit výchozí nastavení'}));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(defaultConfiguration);
    expect(screen.getByRole('button',{name:'Celý dům'})).toHaveAttribute('aria-pressed','true');
  });
  it('načte uloženou konfiguraci po opětovném otevření',()=>{
    const saved={...defaultConfiguration,windowMaterialId:'walnut',portalMaterialId:'walnut',facadeColorId:'white',activeView:'medium'};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
    const {result,unmount}=renderHook(()=>useHouseConfiguration());
    expect(result.current.configuration).toEqual(saved);
    act(()=>result.current.setMaterial('roofColorId','brick'));unmount();
    const second=renderHook(()=>useHouseConfiguration());expect(second.result.current.configuration).toEqual({...saved,roofColorId:'brick'});
  });
  it('opraví poškozená data a neexistující ID',()=>{
    localStorage.setItem(STORAGE_KEY,'{invalid');
    const first=renderHook(()=>useHouseConfiguration());expect(first.result.current.configuration).toEqual(defaultConfiguration);first.unmount();
    localStorage.setItem(STORAGE_KEY,JSON.stringify({houseId:'missing',windowMaterialId:'missing',activeView:'invalid',facadeColorId:'beige'}));
    const second=renderHook(()=>useHouseConfiguration());expect(second.result.current.configuration).toEqual({...defaultConfiguration,facadeColorId:'beige'});
  });
  it('funguje i při zakázaném ukládání',()=>{
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('Storage blocked');});
    const {result}=renderHook(()=>useHouseConfiguration());
    act(()=>result.current.setMaterial('windowMaterialId','black'));
    expect(result.current.configuration.windowMaterialId).toBe('black');expect(result.current.storageAvailable).toBe(false);
  });
  it('vzorky lze aktivovat klávesnicí',async()=>{
    render(<Home/>);const button=within(screen.getByRole('group',{name:'Fasáda'})).getByRole('button',{name:'Písková'});
    button.focus();await userEvent.keyboard('{Enter}');expect(button).toHaveAttribute('aria-pressed','true');
  });
});


import type { HouseConfiguration, HouseModel } from '@/types/configurator';
import { linaPhoto } from './linaPhoto';
export const houses: HouseModel[] = [{
  id: 'lina', name: 'Dům Lina', description: 'Rodinný dům · sedlová střecha', renderer: 'photographic',
  photo:linaPhoto, previewImage:linaPhoto.source,
  availableElements: { windows: true, entranceDoor: true, slidingPortal: true, facade: true, roof: true },
  views: {
    full: { label: 'Celý dům', viewBox: [0, 0, 1448, 1086] },
    medium: { label: 'Přiblížení', viewBox: [484, 418, 884, 663] },
    'window-detail': { label: 'Detail okna', viewBox: [445, 565, 348, 261] },
  },
  frontOpenings: [
    { id: 'living-window', kind: 'window', x: 52, y: 38, width: 174, height: 145, leaves: 2 },
    { id: 'sliding-portal', kind: 'portal', x: 262, y: 38, width: 244, height: 239, leaves: 2 },
    { id: 'entrance', kind: 'door', x: 550, y: 38, width: 82, height: 239, leaves: 1 },
  ],
  sideOpenings: [{ id: 'small-window', kind: 'window', x: 90, y: 53, width: 110, height: 112, leaves: 1 }],
}];
export const defaultConfiguration: HouseConfiguration = {
  houseId: 'lina', windowMaterialId: 'golden-oak', portalMaterialId: 'golden-oak',
  doorMaterialId: 'anthracite', facadeColorId: 'cream', roofColorId: 'anthracite', activeView: 'full',
};

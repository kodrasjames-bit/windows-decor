import type { MaterialOption } from '@/types/configurator';
import { windowMaterials } from './windowMaterials';
export const doorMaterials: MaterialOption[] = [
  ...windowMaterials.filter(m => ['white', 'anthracite', 'black', 'golden-oak', 'walnut'].includes(m.id)),
  { id: 'red', name: 'Červená', type: 'color', value: '#8d3736' },
  { id: 'blue-grey', name: 'Modrošedá', type: 'color', value: '#5b717b' },
];

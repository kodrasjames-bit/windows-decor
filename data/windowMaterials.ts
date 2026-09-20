import type { MaterialOption } from '@/types/configurator';
export const windowMaterials: MaterialOption[] = [
  { id: 'white', name: 'Bílá', type: 'color', value: '#f4f3ee' },
  { id: 'anthracite', name: 'Antracit', type: 'color', value: '#353c3e' },
  { id: 'black', name: 'Černá', type: 'color', value: '#1d2123' },
  { id: 'golden-oak', name: 'Zlatý dub', type: 'texture', value: '#ad743c', grainColor: '#643817', textureUrl:'/textures/oak-grain.png', textureMode:'tint' },
  { id: 'walnut', name: 'Ořech', type: 'texture', value: '#684633', grainColor: '#301e15', textureUrl:'/textures/oak-grain.png', textureMode:'tint' },
  { id: 'natural-oak', name: 'Přírodní dub', type: 'texture', value: '#c2a078', grainColor: '#82603d', textureUrl:'/textures/oak-grain.png', textureMode:'tint' },
  { id: 'dark-brown', name: 'Tmavě hnědá', type: 'color', value: '#49382f' },
];

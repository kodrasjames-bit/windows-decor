export type ViewId = 'full' | 'medium' | 'window-detail';
export type MaterialOption = {
  id: string;
  name: string;
  type: 'color' | 'texture';
  value: string;
  thumbnail?: string;
  textureUrl?: string;
  detailTextureUrl?: string;
  textureMode?: 'original' | 'tint';
  grainColor?: string;
};
export type HouseConfiguration = {
  houseId: string;
  windowMaterialId: string;
  portalMaterialId: string;
  doorMaterialId: string;
  facadeColorId: string;
  roofColorId: string;
  activeView: ViewId;
};
export type ViewConfiguration = { label: string; viewBox: [number, number, number, number] };
export type Opening = {
  id: string;
  kind: 'window' | 'portal' | 'door';
  x: number; y: number; width: number; height: number;
  leaves: number;
};
export type PhotoSurface = {
  id: string;
  material: 'windows' | 'portal' | 'door' | 'facade' | 'roof';
  /** Outer silhouette followed by holes; SVG uses the evenodd rule. */
  path: string;
  /** Subtracted as a union; overlapping cutouts cannot accidentally reveal tinted pixels. */
  cutouts?: string[];
  /** Source-image luminance representing an unshaded material surface. */
  referenceLight: number;
  horizontalGrain?: string;
};
export type PhotoScene = {
  source: string;
  width: number;
  height: number;
  surfaces: PhotoSurface[];
};
export type HouseModel = {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  renderer: 'modern-gable' | 'photographic';
  photo?: PhotoScene;
  availableElements: { windows: boolean; entranceDoor: boolean; slidingPortal: boolean; facade: boolean; roof: boolean };
  views: Record<ViewId, ViewConfiguration>;
  frontOpenings: Opening[];
  sideOpenings: Opening[];
};
export type MaterialField = Exclude<keyof HouseConfiguration, 'houseId' | 'activeView'>;

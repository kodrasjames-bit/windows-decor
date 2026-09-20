'use client';
import { useEffect, useState } from 'react';
import { defaultConfiguration, houses } from '@/data/houses';
import { windowMaterials } from '@/data/windowMaterials';
import { doorMaterials } from '@/data/doorMaterials';
import { facadeColors } from '@/data/facadeColors';
import { roofColors } from '@/data/roofColors';
import type { HouseConfiguration, MaterialField, ViewId } from '@/types/configurator';
export const STORAGE_KEY = 'decor-configurator:v1';
export function validateConfiguration(value: unknown): HouseConfiguration {
  const result = { ...defaultConfiguration };
  if (!value || typeof value !== 'object') return result;
  const data = value as Record<string, unknown>;
  const catalogs = { windowMaterialId: windowMaterials, portalMaterialId: windowMaterials, doorMaterialId: doorMaterials, facadeColorId: facadeColors, roofColorId: roofColors };
  for (const field of Object.keys(catalogs) as MaterialField[]) {
    if (catalogs[field].some(m => m.id === data[field])) result[field] = data[field] as string;
  }
  if (houses.some(h => h.id === data.houseId)) result.houseId = data.houseId as string;
  if (['full', 'medium', 'window-detail'].includes(data.activeView as string)) result.activeView = data.activeView as ViewId;
  // The prototype intentionally links both fields; keep separate IDs for future independent controls.
  result.portalMaterialId = result.windowMaterialId;
  return result;
}
export function useHouseConfiguration() {
  const [configuration, setConfiguration] = useState<HouseConfiguration>(defaultConfiguration);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // A one-time client hydration reads an external store after SSR, avoiding hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setConfiguration(validateConfiguration(JSON.parse(saved)));
    } catch { /* Invalid or unavailable storage never prevents configuring the house. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    // Reflect the result of external storage I/O in the visible save status.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(configuration)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }, [configuration, ready]);
  const setMaterial = (field: MaterialField, id: string) => setConfiguration(previous => validateConfiguration({
    ...previous, [field]: id, ...(field === 'windowMaterialId' ? { portalMaterialId: id } : {}),
  }));
  return {
    configuration, ready, storageAvailable, setMaterial,
    setView: (activeView: ViewId) => setConfiguration(previous => ({ ...previous, activeView })),
    setHouse: (houseId: string) => setConfiguration(previous => validateConfiguration({ ...previous, houseId })),
    reset: () => setConfiguration({ ...defaultConfiguration }),
  };
}

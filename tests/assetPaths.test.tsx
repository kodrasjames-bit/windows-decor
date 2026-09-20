import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from '@/app/page';
import { MaterialDefs } from '@/components/HouseVisualizer/MaterialDefs';
import { swatchStyle } from '@/components/MaterialPalette';
import { assetPath } from '@/lib/assetPath';

afterEach(() => vi.unstubAllEnvs());

describe('Public assets on GitHub Pages', () => {
  it('prefixes every house, texture and thumbnail reference in the rendered page', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/windows-decor');
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain('/windows-decor/houses/lina-photo.png');
    expect(html).toContain('/windows-decor/textures/oak-grain.png');
    expect(html).not.toMatch(/(?:href|src)="\/(?:houses|textures)\//);
    expect(html).not.toContain('url(&quot;/textures/');
  });

  it('supports independent thumbnails and detail textures added later', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/windows-decor');
    const material = { id: 'oak', name: 'Dub', type: 'texture' as const, value: '#aa7744',
      thumbnail: '/textures/thumb.webp', textureUrl: '/textures/oak.webp', detailTextureUrl: '/textures/detail.webp' };
    expect(swatchStyle(material).backgroundImage).toBe('url("/windows-decor/textures/thumb.webp")');
    const html = renderToStaticMarkup(<svg><MaterialDefs materials={{ windows: material }} prefix="test" detail /></svg>);
    expect(html).toContain('href="/windows-decor/textures/detail.webp"');
    expect(html).toContain('href="#test-windows"');
  });

  it('preserves local root paths and external URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    expect(assetPath('/houses/lina-photo.png')).toBe('/houses/lina-photo.png');
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/windows-decor');
    for (const source of ['https://example.com/oak.png', '//example.com/oak.png', 'data:image/png;base64,AA', '#pattern', '/windows-decor/houses/lina-photo.png']) {
      expect(assetPath(source)).toBe(source);
    }
  });
});

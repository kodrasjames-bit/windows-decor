/** Public files need the same build-time prefix as Next's generated scripts. */
export function assetPath(source: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!basePath || !source.startsWith('/') || source.startsWith('//')) return source;
  if (source === basePath || source.startsWith(`${basePath}/`)) return source;
  return `${basePath}${source}`;
}

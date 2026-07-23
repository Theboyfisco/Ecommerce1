export function generateSku(productSlug: string, size: string, color: string): string {
  const clean = (s: string) => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${clean(productSlug).slice(0, 12)}-${clean(size)}-${clean(color).slice(0, 4)}-${suffix}`;
}

export const DEFAULT_SITE_URL = 'https://aurelia-maison.com';

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function isDemoCatalogEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_CATALOG === 'true' || process.env.NODE_ENV !== 'production';
}

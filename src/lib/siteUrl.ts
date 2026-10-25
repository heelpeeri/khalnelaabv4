export function getSiteOrigin(requestOrigin: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;

  return configured ? configured.replace(/\/$/, "") : requestOrigin;
}

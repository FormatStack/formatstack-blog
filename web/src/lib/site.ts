export const siteName = "FormatStack Blog";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://blog.formatstack.com",
);

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function brandedTitle(title: string) {
  const branded = `${title} | ${siteName}`;
  return branded.length <= 60 ? branded : title;
}

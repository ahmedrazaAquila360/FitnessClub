import { getThemeSettings } from "@/lib/data/settings";
import { HEADING_FONT_MAP, BODY_FONT_MAP } from "@/lib/fonts";

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const RADIUS_RE = /^[0-9.]+(rem|px)$/;

function safeHex(value: string, fallback: string) {
  return HEX_RE.test(value) ? value : fallback;
}

export default async function ThemeStyleInjector() {
  const theme = await getThemeSettings();

  const primary = safeHex(theme.primaryColor, "#d4ff3f");
  const secondary = safeHex(theme.secondaryColor, "#1a1a1a");
  const accent = safeHex(theme.accentColor, "#39ff8f");
  const background = safeHex(theme.backgroundColor, "#0a0a0a");
  const foreground = safeHex(theme.foregroundColor, "#f5f5f0");
  const muted = safeHex(theme.mutedColor, "#8a8a8a");
  const radius = RADIUS_RE.test(theme.borderRadius) ? theme.borderRadius : "0.75rem";
  const headingFont = HEADING_FONT_MAP[theme.fontHeading] ?? HEADING_FONT_MAP.Anton;
  const bodyFont = BODY_FONT_MAP[theme.fontBody] ?? BODY_FONT_MAP.Inter;
  const buttonRadius =
    theme.buttonStyle === "PILL" ? "9999px" : theme.buttonStyle === "SQUARE" ? "0.25rem" : radius;

  const css = `:root{--brand-primary:${primary};--brand-secondary:${secondary};--brand-accent:${accent};--background:${background};--foreground:${foreground};--brand-muted:${muted};--radius:${radius};--radius-button:${buttonRadius};--font-heading:${headingFont};--font-body:${bodyFont};}`;

  return <style id="theme-vars" dangerouslySetInnerHTML={{ __html: css }} />;
}

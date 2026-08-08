import { Anton, Bebas_Neue, Oswald, Poppins, Inter, Manrope } from "next/font/google";

export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const FONT_VARIABLES = [
  anton.variable,
  bebasNeue.variable,
  oswald.variable,
  poppins.variable,
  inter.variable,
  manrope.variable,
].join(" ");

export const HEADING_FONT_MAP: Record<string, string> = {
  Anton: "var(--font-anton)",
  "Bebas Neue": "var(--font-bebas-neue)",
  Oswald: "var(--font-oswald)",
  Poppins: "var(--font-poppins)",
};

export const BODY_FONT_MAP: Record<string, string> = {
  Inter: "var(--font-inter)",
  Manrope: "var(--font-manrope)",
  Poppins: "var(--font-poppins)",
};

export const HEADING_FONT_OPTIONS = Object.keys(HEADING_FONT_MAP);
export const BODY_FONT_OPTIONS = Object.keys(BODY_FONT_MAP);

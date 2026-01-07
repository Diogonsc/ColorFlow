// Tipos para cores
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface ColorScaleItem {
  hex: string;
  hsl: string;
  rgb: string;
  contrast: {
    white: string;
    black: string;
    passAA: boolean;
    passAAA: boolean;
    textColor: string;
  };
}

export type ColorScale = Record<number, ColorScaleItem>;

// Funções de conversão de cores
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function calculateContrast(rgb: RGB): {
  white: string;
  black: string;
  passAA: boolean;
  passAAA: boolean;
  textColor: string;
} {
  const luminance =
    0.2126 * (rgb.r / 255) + 0.7152 * (rgb.g / 255) + 0.0722 * (rgb.b / 255);
  const contrastWhite = (1 + 0.05) / (luminance + 0.05);
  const contrastBlack = (luminance + 0.05) / (0 + 0.05);

  return {
    white: contrastWhite.toFixed(2),
    black: contrastBlack.toFixed(2),
    passAA: contrastWhite >= 4.5 || contrastBlack >= 4.5,
    passAAA: contrastWhite >= 7 || contrastBlack >= 7,
    textColor: contrastWhite > contrastBlack ? "#FFFFFF" : "#000000",
  };
}

export function generateColorScale(h: number, s: number, l: number): ColorScale {
  const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const newColorScale: ColorScale = {};

  scales.forEach((scale) => {
    let lightness: number;
    if (scale <= 500) {
      lightness = 95 - (scale / 500) * (95 - l);
    } else {
      lightness = l - ((scale - 500) / 450) * (l - 5);
    }

    const saturationCurve = scale === 500 ? 1 : scale < 500 ? 0.85 : 0.92;
    const saturation = s * saturationCurve;

    const newRgb = hslToRgb(h, saturation, lightness);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const contrast = calculateContrast(newRgb);

    newColorScale[scale] = {
      hex,
      hsl: `hsl(${Math.round(h)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`,
      rgb: `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`,
      contrast,
    };
  });

  return newColorScale;
}

export function parseColorString(text: string): string | null {
  const hexRegex = /#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/;
  const rgbRegex = /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i;
  const hslRegex = /hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)/i;

  if (hexRegex.test(text)) {
    const match = text.match(hexRegex);
    if (!match) return null;
    let color = match[0].startsWith("#") ? match[0] : `#${match[0]}`;
    if (color.length === 4) {
      color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    return color;
  } else if (rgbRegex.test(text)) {
    const match = text.match(rgbRegex);
    if (!match) return null;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return rgbToHex(r, g, b);
  } else if (hslRegex.test(text)) {
    const match = text.match(hslRegex);
    if (!match) return null;
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  return null;
}

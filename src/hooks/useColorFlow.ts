import { useState, useEffect, useCallback } from "react";
import {
  hexToRgb,
  rgbToHsl,
  rgbToHex,
  hslToRgb,
  generateColorScale,
  parseColorString,
  calculateContrast,
  type HSL,
  type ColorScale,
  type ColorHarmony,
} from "@/lib/colorUtils";

export interface SavedPalette {
  id: string;
  name: string;
  baseColor: string;
  hsl: HSL;
  colorScale: ColorScale;
  harmony: ColorHarmony;
  createdAt: string;
}

interface UseColorFlowReturn {
  baseColor: string;
  colorName: string;
  hsl: HSL;
  colorScale: ColorScale;
  harmony: ColorHarmony;
  selectedColor: string | null;
  savedPalettes: SavedPalette[];
  favorites: string[];
  showPalettes: boolean;
  message: { text: string; type: "success" | "error" | "" };
  updateBaseColor: (hex: string) => void;
  updateHSL: (type: keyof HSL, value: number) => void;
  updateColorName: (name: string) => void;
  updateHarmony: (harmony: ColorHarmony) => void;
  updateColorInScale: (scale: number, hex: string) => void;
  selectColor: (hex: string) => void;
  savePalette: () => void;
  loadPalette: (palette: SavedPalette) => void;
  deletePalette: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleShowPalettes: () => void;
  randomColor: () => void;
  pasteColor: () => Promise<void>;
  setMessage: (text: string, type: "success" | "error" | "") => void;
}

const STORAGE_KEY_PALETTES = "colorflow-palettes";
const STORAGE_KEY_FAVORITES = "colorflow-favorites";

export function useColorFlow(): UseColorFlowReturn {
  const [baseColor, setBaseColor] = useState("#1E80F1");
  const [colorName, setColorName] = useState("primary");
  const [hsl, setHsl] = useState<HSL>({ h: 212, s: 88, l: 53 });
  const [harmony, setHarmony] = useState<ColorHarmony>("monochromatic");
  const [colorScale, setColorScale] = useState<ColorScale>(() =>
    generateColorScale(212, 88, 53, "monochromatic")
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPalettes, setShowPalettes] = useState(false);
  const [message, setMessageState] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });

  // Carregar paletas salvas do localStorage
  useEffect(() => {
    const loadPalettes = () => {
      try {
        const palettesJson = localStorage.getItem(STORAGE_KEY_PALETTES);
        const favoritesJson = localStorage.getItem(STORAGE_KEY_FAVORITES);
        if (palettesJson) {
          setSavedPalettes(JSON.parse(palettesJson));
        }
        if (favoritesJson) {
          setFavorites(JSON.parse(favoritesJson));
        }
      } catch (error) {
        console.error("Erro ao carregar paletas:", error);
      }
    };
    loadPalettes();
  }, []);

  // Atualizar baseColor e recalcular escala
  const updateBaseColor = useCallback((hex: string) => {
    setBaseColor(hex);
    const rgb = hexToRgb(hex);
    if (rgb) {
      const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHsl(newHsl);
      setColorScale(generateColorScale(newHsl.h, newHsl.s, newHsl.l, harmony));
    }
  }, [harmony]);

  // Atualizar HSL e recalcular baseColor e escala
  const updateHSL = useCallback((type: keyof HSL, value: number) => {
    setHsl((prev) => {
      const newHsl = { ...prev, [type]: value };
      const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setBaseColor(hex);
      setColorScale(generateColorScale(newHsl.h, newHsl.s, newHsl.l, harmony));
      return newHsl;
    });
  }, [harmony]);

  // Atualizar harmonia e recalcular escala
  const updateHarmony = useCallback((newHarmony: ColorHarmony) => {
    setHarmony(newHarmony);
    setColorScale(generateColorScale(hsl.h, hsl.s, hsl.l, newHarmony));
  }, [hsl]);

  // Atualizar cor individual na escala
  const updateColorInScale = useCallback((scale: number, hex: string) => {
    setColorScale((prev) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return prev;
      
      const contrast = calculateContrast(rgb);
      const hslValue = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      return {
        ...prev,
        [scale]: {
          hex,
          hsl: `hsl(${Math.round(hslValue.h)}, ${Math.round(hslValue.s)}%, ${Math.round(hslValue.l)}%)`,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          contrast,
        },
      };
    });
  }, []);

  // Salvar paleta
  const savePalette = useCallback(() => {
    const palette: SavedPalette = {
      id: `palette-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: colorName,
      baseColor,
      hsl,
      colorScale,
      harmony,
      createdAt: new Date().toISOString(),
    };

    const newPalettes = [...savedPalettes, palette];
    setSavedPalettes(newPalettes);
    localStorage.setItem(STORAGE_KEY_PALETTES, JSON.stringify(newPalettes));
    setMessage("Paleta salva!", "success");
  }, [baseColor, colorName, hsl, colorScale, harmony, savedPalettes]);

  // Carregar paleta
  const loadPalette = useCallback((palette: SavedPalette) => {
    setBaseColor(palette.baseColor);
    setColorName(palette.name);
    setHsl(palette.hsl);
    setHarmony(palette.harmony || "monochromatic");
    setColorScale(palette.colorScale);
    setShowPalettes(false);
  }, []);

  // Deletar paleta
  const deletePalette = useCallback(
    (id: string) => {
      const newPalettes = savedPalettes.filter((p) => p.id !== id);
      setSavedPalettes(newPalettes);
      localStorage.setItem(STORAGE_KEY_PALETTES, JSON.stringify(newPalettes));
    },
    [savedPalettes]
  );

  // Alternar favorito
  const toggleFavorite = useCallback(
    (id: string) => {
      const newFavorites = favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id];
      setFavorites(newFavorites);
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
    },
    [favorites]
  );

  // Cor aleatória
  const randomColor = useCallback(() => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    updateBaseColor(randomHex);
  }, [updateBaseColor]);

  // Colar cor da área de transferência
  const pasteColor = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const color = parseColorString(text);
      if (color) {
        updateBaseColor(color);
        setMessage("Cor colada!", "success");
      } else {
        setMessage("Formato inválido", "error");
      }
    } catch (err) {
      setMessage("Erro ao acessar clipboard", "error");
    }
  }, [updateBaseColor]);

  // Selecionar cor da escala
  const selectColor = useCallback((hex: string) => {
    setSelectedColor(hex);
  }, []);

  // Função auxiliar para mensagens
  const setMessage = useCallback(
    (text: string, type: "success" | "error" | "") => {
      setMessageState({ text, type });
      if (text) {
        setTimeout(() => setMessageState({ text: "", type: "" }), 2000);
      }
    },
    []
  );

  return {
    baseColor,
    colorName,
    hsl,
    colorScale,
    harmony,
    selectedColor,
    savedPalettes,
    favorites,
    showPalettes,
    message,
    updateBaseColor,
    updateHSL,
    updateColorName: setColorName,
    updateHarmony,
    updateColorInScale,
    selectColor,
    savePalette,
    loadPalette,
    deletePalette,
    toggleFavorite,
    toggleShowPalettes: () => setShowPalettes((prev) => !prev),
    randomColor,
    pasteColor,
    setMessage,
  };
}

import { createContext, useContext, ReactNode } from "react";
import { useColorFlow, type SavedPalette } from "@/hooks/useColorFlow";
import type { HSL, ColorScale } from "@/lib/colorUtils";

interface ColorFlowContextType {
  baseColor: string;
  colorName: string;
  hsl: HSL;
  colorScale: ColorScale;
  selectedColor: string | null;
  savedPalettes: SavedPalette[];
  favorites: string[];
  showPalettes: boolean;
  message: { text: string; type: "success" | "error" | "" };
  updateBaseColor: (hex: string) => void;
  updateHSL: (type: keyof HSL, value: number) => void;
  updateColorName: (name: string) => void;
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

const ColorFlowContext = createContext<ColorFlowContextType | undefined>(
  undefined
);

export function ColorFlowProvider({ children }: { children: ReactNode }) {
  const colorFlow = useColorFlow();

  return (
    <ColorFlowContext.Provider value={colorFlow}>
      {children}
    </ColorFlowContext.Provider>
  );
}

export function useColorFlowContext() {
  const context = useContext(ColorFlowContext);
  if (context === undefined) {
    throw new Error("useColorFlowContext must be used within a ColorFlowProvider");
  }
  return context;
}

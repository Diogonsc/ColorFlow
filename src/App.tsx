import { useEffect } from "react";
import { Palette, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorFlowProvider, useColorFlowContext } from "@/contexts/ColorFlowContext";
import { ColorPicker } from "@/components/ColorPicker";
import { ColorScaleVisual } from "@/components/ColorScaleVisual";
import { ColorScaleDetails } from "@/components/ColorScaleDetails";
import { ExportSection } from "@/components/ExportSection";
import { SavedPalettes } from "@/components/SavedPalettes";
import { UIPreview } from "@/components/UIPreview";

function AppContent() {
  const {
    savedPalettes,
    favorites,
    showPalettes,
    toggleShowPalettes,
    loadPalette,
    deletePalette,
    toggleFavorite,
    pasteColor,
  } = useColorFlowContext();

  // Atalho de teclado para colar cor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== "INPUT" &&
          activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          pasteColor();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pasteColor]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="text-blue-400">
              <Palette className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold">ColorFlow</h1>
          </div>
          <Button
            variant="secondary"
            onClick={toggleShowPalettes}
            className="flex items-center gap-2"
          >
            <Folder className="w-4 h-4" />
            <span>Paletas ({savedPalettes.length})</span>
          </Button>
        </div>

        {showPalettes && (
          <div className="mb-6">
            <SavedPalettes
              palettes={savedPalettes}
              favorites={favorites}
              onLoadPalette={loadPalette}
              onDeletePalette={deletePalette}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        <div className="space-y-6">
          <ColorPicker />

          <ColorScaleVisual />

          <ColorScaleDetails />

          <UIPreview />

          <ExportSection />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ColorFlowProvider>
      <AppContent />
    </ColorFlowProvider>
  );
}

export default App;

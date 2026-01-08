import { useEffect } from "react";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorFlowProvider, useColorFlowContext } from "@/contexts/ColorFlowContext";
import { ColorPicker } from "@/components/ColorPicker";
import { ColorScaleVisual } from "@/components/ColorScaleVisual";
import { ColorScaleDetails } from "@/components/ColorScaleDetails";
import { ExportSection } from "@/components/ExportSection";
import { SavedPalettes } from "@/components/SavedPalettes";
import { AdSense } from "@/components/AdSense";
import { ADSENSE_CONFIG } from "@/config/adsense";
// import { UIPreview } from "@/components/UIPreview";
import logo from "@/assets/logo-eleven.png";

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
      {/* Layout com anúncios laterais */}
      <div className="flex gap-4 max-w-7xl mx-auto px-4 py-6 items-start">
        {/* Anúncio lateral esquerda - oculto em mobile */}
        <aside className="hidden lg:block w-48 xl:w-64 flex-shrink-0 sticky top-6 self-start" aria-label="Publicidade lateral esquerda">
          <AdSense
            adSlot="1234567890"
            format="vertical"
            width={ADSENSE_CONFIG.sizes.vertical.width}
            height={ADSENSE_CONFIG.sizes.vertical.height}
          />
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto px-4 lg:px-0">
          <header className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ElevenTones" className="w-40 h-auto" />
            </div>
            <Button
              variant="secondary"
              onClick={toggleShowPalettes}
              className="flex items-center gap-2"
              aria-label={`${showPalettes ? 'Ocultar' : 'Mostrar'} paletas salvas`}
            >
              <Folder className="w-4 h-4" />
              <span>Paletas Salvas ({savedPalettes.length})</span>
            </Button>
          </header>

          {/* Anúncio abaixo do header - apenas em mobile */}
          <aside className="mb-6 lg:hidden" aria-label="Publicidade">
            <AdSense
              adSlot="1234567890"
              format="horizontal"
              className="my-6"
            />
          </aside>

          {showPalettes && (
            <section className="mb-6" aria-label="Paletas salvas">
              <SavedPalettes
                palettes={savedPalettes}
                favorites={favorites}
                onLoadPalette={loadPalette}
                onDeletePalette={deletePalette}
                onToggleFavorite={toggleFavorite}
              />
            </section>
          )}

          <div className="space-y-6">
            <section aria-label="Seletor de cor">
              <ColorPicker />
            </section>

            <section aria-label="Visualização da escala de cores">
              <ColorScaleVisual />
            </section>

            <section aria-label="Detalhes da escala de cores">
              <ColorScaleDetails />
            </section>

            {/* <UIPreview /> */}

            <section aria-label="Exportação de cores">
              <ExportSection />
            </section>
          </div>

          {/* Anúncio no final da página */}
          <aside className="mt-8" aria-label="Publicidade">
            <AdSense
              adSlot="1234567890"
              format="horizontal"
              className="my-6"
            />
          </aside>
        </main>

        {/* Anúncio lateral direita - oculto em mobile */}
        <aside className="hidden lg:block w-48 xl:w-64 flex-shrink-0 sticky top-6 self-start" aria-label="Publicidade lateral direita">
          <div className="flex justify-end">
            <AdSense
              adSlot="1234567890"
              format="vertical"
              width={ADSENSE_CONFIG.sizes.vertical.width}
              height={ADSENSE_CONFIG.sizes.vertical.height}
            />
          </div>
        </aside>
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

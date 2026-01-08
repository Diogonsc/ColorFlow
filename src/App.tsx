import { useEffect } from "react";
import { Folder } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ColorFlowProvider, useColorFlowContext } from "@/contexts/ColorFlowContext";
import { ColorPicker } from "@/components/ColorPicker";
import { ColorScaleVisual } from "@/components/ColorScaleVisual";
import { ColorScaleDetails } from "@/components/ColorScaleDetails";
import { ExportSection } from "@/components/ExportSection";
import { SavedPalettes } from "@/components/SavedPalettes";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AdSense } from "@/components/AdSense";
import { ADSENSE_CONFIG } from "@/config/adsense";
// import { UIPreview } from "@/components/UIPreview";
import logo from "@/assets/logo-eleven.png";

function AppContent() {
  const { t } = useTranslation();
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
        {ADSENSE_CONFIG.enabled && (
          <aside className="hidden lg:block w-48 xl:w-64 flex-shrink-0 sticky top-6 self-start" aria-label={t("aria.adLeft")}>
            <AdSense
              adSlot={ADSENSE_CONFIG.adSlots.sidebarLeft}
              format="vertical"
              width={ADSENSE_CONFIG.sizes.vertical.width}
              height={ADSENSE_CONFIG.sizes.vertical.height}
            />
          </aside>
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto lg:px-0">
          <header className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ElevenTones" className="w-40 h-auto" />
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Button
                variant="secondary"
                onClick={toggleShowPalettes}
                className="flex items-center gap-2"
                aria-label={showPalettes ? t("app.palettes.hidePalettes") : t("app.palettes.showPalettes")}
              >
                <Folder className="w-4 h-4" />
                <span>{t("app.palettes.savedCount", { count: savedPalettes.length })}</span>
              </Button>
            </div>
          </header>

          {/* Anúncio abaixo do header - apenas em mobile */}
          {ADSENSE_CONFIG.enabled && (
            <aside className="mb-6 lg:hidden" aria-label={t("aria.ad")}>
              <AdSense
                adSlot={ADSENSE_CONFIG.adSlots.mobileHeader}
                format="horizontal"
                className="my-6"
              />
            </aside>
          )}

          {showPalettes && (
            <section className="mb-6" aria-label={t("aria.savedPalettes")}>
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
            <section aria-label={t("aria.colorSelector")}>
              <ColorPicker />
            </section>

            <section aria-label={t("aria.colorScale")}>
              <ColorScaleVisual />
            </section>

            <section aria-label={t("aria.colorScaleDetails")}>
              <ColorScaleDetails />
            </section>

            {/* <UIPreview /> */}

            <section aria-label={t("aria.export")}>
              <ExportSection />
            </section>
          </div>

          {/* Anúncio no final da página */}
          {ADSENSE_CONFIG.enabled && (
            <aside className="mt-8" aria-label={t("aria.ad")}>
              <AdSense
                adSlot={ADSENSE_CONFIG.adSlots.pageFooter}
                format="horizontal"
                className="my-6"
              />
            </aside>
          )}
        </main>

        {/* Anúncio lateral direita - oculto em mobile */}
        {ADSENSE_CONFIG.enabled && (
          <aside className="hidden lg:block w-48 xl:w-64 flex-shrink-0 sticky top-6 self-start" aria-label={t("aria.adRight")}>
            <div className="flex justify-end">
              <AdSense
                adSlot={ADSENSE_CONFIG.adSlots.sidebarRight}
                format="vertical"
                width={ADSENSE_CONFIG.sizes.vertical.width}
                height={ADSENSE_CONFIG.sizes.vertical.height}
              />
            </div>
          </aside>
        )}
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

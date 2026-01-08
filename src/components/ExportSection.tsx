import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Copy, X, Check } from "lucide-react";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { hexToRgb } from "@/lib/colorUtils";
import { trackEvent } from "@/lib/gtag";

export function ExportSection() {
  const { t } = useTranslation();
  const { colorScale, colorName, setMessage } = useColorFlowContext();
  const [showModal, setShowModal] = useState(false);
  const [exportContent, setExportContent] = useState("");
  const [exportTitle, setExportTitle] = useState("");
  const [copied, setCopied] = useState(false);

  // Ordenar as escalas numericamente
  const sortedScales = Object.keys(colorScale)
    .map(Number)
    .sort((a, b) => a - b);

  const copyToClipboard = async (text: string, format?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setMessage(t("messages.copied"), "success");
      setTimeout(() => setCopied(false), 2000);
      
      // Rastreia a cópia do conteúdo exportado
      trackEvent('copy_export', 'engagement', format || exportTitle, undefined);
    } catch (err) {
      console.error("Erro ao copiar:", err);
      setMessage(t("messages.copyError"), "error");
    }
  };

  const showExportModal = (content: string, title: string) => {
    setExportContent(content);
    setExportTitle(title);
    setShowModal(true);
    
    // Rastreia a exportação
    trackEvent('export_palette', 'engagement', title, undefined);
    
    // Copiar automaticamente
    copyToClipboard(content, title);
  };

  const exportAsCSS = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage(t("messages.noColorScale"), "error");
      return;
    }

    let css = `/* ${colorName.toUpperCase()} Color Scale */\n`;
    css += `:root {\n`;
    sortedScales.forEach((scale) => {
      const color = colorScale[scale];
      if (color) {
        css += `  --${colorName}-${scale}: ${color.hex};\n`;
      }
    });
    css += `}\n`;
    css += `\n/* Usage: var(--${colorName}-500) */\n`;

    showExportModal(css, t("export.cssVariables"));
  };

  const exportAsTailwind = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage(t("messages.noColorScale"), "error");
      return;
    }

    // Formato para tailwind.config.js
    let tw = `module.exports = {\n`;
    tw += `  theme: {\n`;
    tw += `    extend: {\n`;
    tw += `      colors: {\n`;
    tw += `        ${colorName}: {\n`;
    sortedScales.forEach((scale) => {
      const color = colorScale[scale];
      if (color) {
        tw += `          ${scale}: '${color.hex}',\n`;
      }
    });
    tw += `        },\n`;
    tw += `      },\n`;
    tw += `    },\n`;
    tw += `  },\n`;
    tw += `}\n`;

    showExportModal(tw, t("export.tailwind"));
  };

  const exportAsJSON = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage(t("messages.noColorScale"), "error");
      return;
    }

    // Criar objeto completo com todas as informações
    const colorsData: Record<string, {
      hex: string;
      rgb: string;
      hsl: string;
    }> = {};
    
    sortedScales.forEach((scale) => {
      const color = colorScale[scale];
      if (color) {
        colorsData[`${colorName}-${scale}`] = {
          hex: color.hex,
          rgb: color.rgb,
          hsl: color.hsl,
        };
      }
    });

    const json = JSON.stringify(
      {
        name: colorName,
        colors: colorsData,
      },
      null,
      2
    );

    showExportModal(json, t("export.json"));
  };

  const exportAsFigma = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage(t("messages.noColorScale"), "error");
      return;
    }

    let figma = `// Figma Plugin Script\n`;
    figma += `// Instruções:\n`;
    figma += `// 1. No Figma, vá em Menu > Plugins > Development > New Plugin...\n`;
    figma += `// 2. Selecione "Run" e cole este código no console\n`;
    figma += `// 3. Execute o script\n\n`;
    figma += `const colors = [\n`;
    sortedScales.forEach((scale) => {
      const color = colorScale[scale];
      if (color) {
        const rgb = hexToRgb(color.hex);
        if (rgb) {
          figma += `  {\n`;
          figma += `    name: "${colorName}/${scale}",\n`;
          figma += `    r: ${(rgb.r / 255).toFixed(3)},\n`;
          figma += `    g: ${(rgb.g / 255).toFixed(3)},\n`;
          figma += `    b: ${(rgb.b / 255).toFixed(3)}\n`;
          figma += `  },\n`;
        }
      }
    });
    figma += `];\n\n`;
    figma += `async function createColorStyles() {\n`;
    figma += `  for (const color of colors) {\n`;
    figma += `    const style = figma.createPaintStyle();\n`;
    figma += `    style.name = color.name;\n`;
    figma += `    style.paints = [{\n`;
    figma += `      type: 'SOLID',\n`;
    figma += `      color: { r: color.r, g: color.g, b: color.b }\n`;
    figma += `    }];\n`;
    figma += `  }\n`;
    figma += `  figma.notify(\`${t("messages.figmaCreated", { count: sortedScales.length })}\`);\n`;
    figma += `  figma.closePlugin();\n`;
    figma += `}\n\n`;
    figma += `createColorStyles();\n`;

    // Rastreia a conversão de exportação Figma
    trackEvent('export_figma', 'conversion', 'Figma Plugin File');
    
    showExportModal(figma, t("export.figma"));
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">{t("export.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label={t("aria.exportOptions")}>
            <Button
              variant="default"
              onClick={exportAsCSS}
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600"
              aria-label={t("export.exportAsCSS")}
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              {t("export.cssVariables")}
            </Button>
            <Button
              variant="default"
              onClick={exportAsTailwind}
              className="flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-600"
              aria-label={t("export.exportAsTailwind")}
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              {t("export.tailwind")}
            </Button>
            <Button
              variant="default"
              onClick={exportAsJSON}
              className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600"
              aria-label={t("export.exportAsJSON")}
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              {t("export.json")}
            </Button>
            <Button
              variant="default"
              onClick={exportAsFigma}
              className="flex items-center justify-center gap-2 bg-pink-700 hover:bg-pink-600"
              aria-label={t("export.exportAsFigma")}
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              {t("export.figma")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Exportação */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <Card className="bg-card border-border w-full max-w-2xl min-h-[80vh] flex flex-col">
            <CardHeader className="flex items-center justify-between pb-4">
              <CardTitle id="export-modal-title" className="text-lg font-semibold">{exportTitle}</CardTitle>
              <div className="flex items-center gap-2">
                {copied && (
                  <span className="text-sm text-green-400 flex items-center gap-1" role="status" aria-live="polite">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    {t("export.modal.copied")}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowModal(false)}
                  aria-label={t("export.modal.close")}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="relative flex-1 overflow-hidden">
                <label htmlFor="export-content" className="sr-only">{t("export.modal.exportedContent")}</label>
                <Textarea
                  id="export-content"
                  readOnly
                  value={exportContent}
                  className="w-full h-full min-h-[600px] font-mono resize-none bg-muted"
                  onClick={(e) => {
                    (e.target as HTMLTextAreaElement).select();
                    copyToClipboard(exportContent, exportTitle);
                  }}
                  aria-label={t("export.modal.exportedContent")}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  {t("export.modal.clickToSelect")}
                </p>
                <Button
                  variant="default"
                  onClick={() => copyToClipboard(exportContent, exportTitle)}
                  className="flex items-center gap-2"
                  aria-label={t("export.modal.copy")}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      {t("export.modal.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      {t("export.modal.copy")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

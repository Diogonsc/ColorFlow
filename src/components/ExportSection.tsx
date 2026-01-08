import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Copy, X, Check } from "lucide-react";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { hexToRgb } from "@/lib/colorUtils";

export function ExportSection() {
  const { colorScale, colorName, setMessage } = useColorFlowContext();
  const [showModal, setShowModal] = useState(false);
  const [exportContent, setExportContent] = useState("");
  const [exportTitle, setExportTitle] = useState("");
  const [copied, setCopied] = useState(false);

  // Ordenar as escalas numericamente
  const sortedScales = Object.keys(colorScale)
    .map(Number)
    .sort((a, b) => a - b);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setMessage("Copiado para área de transferência!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
      setMessage("Erro ao copiar. Use Ctrl+C para copiar manualmente.", "error");
    }
  };

  const showExportModal = (content: string, title: string) => {
    setExportContent(content);
    setExportTitle(title);
    setShowModal(true);
    // Copiar automaticamente
    copyToClipboard(content);
  };

  const exportAsCSS = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage("Nenhuma escala de cores disponível", "error");
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

    showExportModal(css, "CSS Variables");
  };

  const exportAsTailwind = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage("Nenhuma escala de cores disponível", "error");
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

    showExportModal(tw, "Tailwind Config");
  };

  const exportAsJSON = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage("Nenhuma escala de cores disponível", "error");
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

    showExportModal(json, "JSON");
  };

  const exportAsFigma = () => {
    if (!colorScale || Object.keys(colorScale).length === 0) {
      setMessage("Nenhuma escala de cores disponível", "error");
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
    figma += `  figma.notify(\`${sortedScales.length} estilos de cor criados!\`);\n`;
    figma += `  figma.closePlugin();\n`;
    figma += `}\n\n`;
    figma += `createColorStyles();\n`;

    showExportModal(figma, "Figma Plugin Script");
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Exportar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              onClick={exportAsCSS}
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600"
            >
              <Upload className="w-4 h-4" />
              CSS Variables
            </Button>
            <Button
              variant="default"
              onClick={exportAsTailwind}
              className="flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-600"
            >
              <Upload className="w-4 h-4" />
              Tailwind
            </Button>
            <Button
              variant="default"
              onClick={exportAsJSON}
              className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600"
            >
              <Upload className="w-4 h-4" />
              JSON
            </Button>
            <Button
              variant="default"
              onClick={exportAsFigma}
              className="flex items-center justify-center gap-2 bg-pink-700 hover:bg-pink-600"
            >
              <Upload className="w-4 h-4" />
              Figma
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Exportação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="bg-card border-border w-full max-w-2xl min-h-[80vh] flex flex-col">
            <CardHeader className="flex items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">{exportTitle}</CardTitle>
              <div className="flex items-center gap-2">
                {copied && (
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Copiado!
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="relative flex-1 overflow-hidden">
                <Textarea
                  readOnly
                  value={exportContent}
                  className="w-full h-full min-h-[600px] font-mono resize-none bg-muted"
                  onClick={(e) => {
                    (e.target as HTMLTextAreaElement).select();
                    copyToClipboard(exportContent);
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Clique no código para selecionar e copiar, ou use o botão abaixo
                </p>
                <Button
                  variant="default"
                  onClick={() => copyToClipboard(exportContent)}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
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

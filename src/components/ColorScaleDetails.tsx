import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { useState } from "react";
import { trackEvent } from "@/lib/gtag";

export function ColorScaleDetails() {
  const { t } = useTranslation();
  const { colorScale, colorName, selectColor, selectedColor } = useColorFlowContext();
  const [copiedScale, setCopiedScale] = useState<number | null>(null);
  const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const copyToClipboard = async (hex: string, scale: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedScale(scale);
      setTimeout(() => setCopiedScale(null), 2000);
      
      // Rastreia a cópia da cor
      trackEvent('copy_color', 'engagement', `${colorName}-${scale}`, undefined);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const handleColorClick = (hex: string) => {
    selectColor(hex);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{t("colorScale.details")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3" role="list" aria-label={t("colorScale.details")}>
          {scales.map((scale) => {
            const color = colorScale[scale];
            if (!color) return null;
            const isCopied = copiedScale === scale;
            const isSelected = selectedColor === color.hex;
            return (
              <li
                key={scale}
                className={`bg-muted p-3 rounded flex items-center gap-3 cursor-pointer transition-all hover:bg-muted/80 ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleColorClick(color.hex)}
                title={t("colorScale.selectColor", { hex: color.hex })}
                role="listitem"
              >
                <div
                  className={`w-12 h-12 rounded border-2 flex-shrink-0 ${
                    isSelected ? "border-blue-500" : "border-border"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Amostra da cor ${colorName}-${scale}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">
                    {colorName}-{scale}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {color.hex}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(color.hex, scale);
                  }}
                  title={t("colorScale.copyHex", { hex: color.hex })}
                  className="flex-shrink-0"
                  aria-label={t("colorScale.copyHex", { hex: color.hex })}
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

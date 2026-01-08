import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Pencil, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { useState } from "react";
import { trackEvent } from "@/lib/gtag";

export function ColorScaleDetails() {
  const { t } = useTranslation();
  const { colorScale, colorName, selectColor, selectedColor, updateColorInScale } = useColorFlowContext();
  const [copiedScale, setCopiedScale] = useState<number | null>(null);
  const [editingScale, setEditingScale] = useState<number | null>(null);
  const [editHexValue, setEditHexValue] = useState("");
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

  const handleColorClick = (hex: string, scale: number) => {
    if (editingScale === scale) {
      return;
    }
    selectColor(hex);
  };

  const handleEditClick = (e: React.MouseEvent, scale: number, hex: string) => {
    e.stopPropagation();
    setEditingScale(scale);
    setEditHexValue(hex);
  };

  const handleEditSubmit = (scale: number) => {
    const hexRegex = /^#?[0-9A-Fa-f]{6}$/;
    const trimmedValue = editHexValue.trim();
    if (hexRegex.test(trimmedValue)) {
      const hex = trimmedValue.startsWith("#") ? trimmedValue : `#${trimmedValue}`;
      updateColorInScale(scale, hex);
      setEditingScale(null);
      setEditHexValue("");
    }
  };

  const handleEditCancel = () => {
    setEditingScale(null);
    setEditHexValue("");
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
            const isBaseColor = scale === 500;
            const isEditing = editingScale === scale;
            
            return (
              <li
                key={scale}
                className={`bg-muted p-3 rounded flex items-center gap-3 transition-all hover:bg-muted/80 ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                } ${isBaseColor ? "ring-1 ring-yellow-400" : ""} ${isEditing ? "" : "cursor-pointer"}`}
                onClick={() => !isEditing && handleColorClick(color.hex, scale)}
                title={t("colorScale.selectColor", { hex: color.hex })}
                role="listitem"
              >
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded border-2 ${
                      isSelected ? "border-blue-500" : isBaseColor ? "border-yellow-400" : "border-border"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Amostra da cor ${colorName}-${scale}`}
                  />
                  {isBaseColor && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[8px] font-bold px-1 rounded text-center whitespace-nowrap" title={t("colorScale.baseColorIndicator")}>
                      {t("colorScale.baseColor")}
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <Input
                      type="text"
                      value={editHexValue}
                      onChange={(e) => setEditHexValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSubmit(scale);
                        if (e.key === "Escape") handleEditCancel();
                      }}
                      className="flex-1 font-mono text-sm"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSubmit(scale);
                      }}
                      className="flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCancel();
                      }}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {colorName}-{scale}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {color.hex}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => handleEditClick(e, scale, color.hex)}
                        title={t("colorScale.editColor")}
                        className="flex-shrink-0"
                        aria-label={t("colorScale.editColor", { scale })}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
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
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

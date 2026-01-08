import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { Pencil } from "lucide-react";

export function ColorScaleVisual() {
  const { t } = useTranslation();
  const { colorScale, selectColor, selectedColor, updateColorInScale } = useColorFlowContext();
  const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const [editingScale, setEditingScale] = useState<number | null>(null);
  const [editHexValue, setEditHexValue] = useState("");

  const handleColorClick = (hex: string, scale: number) => {
    if (editingScale === scale) {
      // Se já está editando, apenas seleciona
      selectColor(hex);
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
    }
  };

  const handleEditCancel = () => {
    setEditingScale(null);
    setEditHexValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, scale: number) => {
    if (e.key === "Enter") {
      handleEditSubmit(scale);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{t("colorScale.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-11 gap-1 mb-4" role="group" aria-label={t("colorScale.visualAriaLabel")}>
          {scales.map((scale) => {
            const color = colorScale[scale];
            if (!color) return null;
            const isSelected = selectedColor === color.hex;
            const isBaseColor = scale === 500;
            const isEditing = editingScale === scale;
            
            return (
              <div key={scale} className="group relative">
                <button
                  type="button"
                  className={`h-20 w-full rounded cursor-pointer transition-all hover:scale-105 relative ${
                    isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
                  } ${isBaseColor ? "ring-2 ring-yellow-400 ring-offset-1" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  data-scale={scale}
                  onClick={() => handleColorClick(color.hex, scale)}
                  title={t("colorScale.selectColor", { hex: color.hex })}
                  aria-label={t("colorScale.colorLabel", { 
                    scale, 
                    hex: color.hex, 
                    selected: isSelected ? t("colorScale.selected") : "",
                    base: isBaseColor ? t("colorScale.base") : ""
                  })}
                  aria-pressed={isSelected}
                >
                  {isBaseColor && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-bold px-1 rounded text-center whitespace-nowrap" title={t("colorScale.baseColorIndicator")}>
                      {t("colorScale.baseColor")}
                    </div>
                  )}
                </button>
                {isEditing ? (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded z-10 p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editHexValue}
                      onChange={(e) => setEditHexValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, scale)}
                      onBlur={() => handleEditSubmit(scale)}
                      className="w-full text-xs font-mono bg-background border border-border rounded px-2 py-1 text-center"
                      style={{ color: color.contrast.textColor }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSubmit(scale);
                        }}
                        className="text-xs px-2 py-0.5 bg-green-600 text-white rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCancel();
                        }}
                        className="text-xs px-2 py-0.5 bg-red-600 text-white rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded pointer-events-none"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    aria-hidden="true"
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: color.contrast.textColor }}
                    >
                      {scale}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: color.contrast.textColor }}
                    >
                      {color.hex}
                    </span>
                  </div>
                )}
                {!isEditing && (
                  <button
                    type="button"
                    onClick={(e) => handleEditClick(e, scale, color.hex)}
                    className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 rounded p-1"
                    title={t("colorScale.editColor")}
                    aria-label={t("colorScale.editColor", { scale })}
                  >
                    <Pencil className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-11 gap-1 text-xs text-center" role="list" aria-label={t("colorScale.scaleValues")}>
          {scales.map((scale) => (
            <div key={scale} className="text-muted-foreground font-mono" role="listitem">
              {scale}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

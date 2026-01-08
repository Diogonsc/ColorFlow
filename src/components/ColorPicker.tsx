import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RotateCcw,
  Pipette,
  Clipboard,
  Lightbulb,
  Save,
  Palette,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { useEyeDropper } from "@/hooks/useEyeDropper";
import { HSLSliders } from "./HSLSliders";
import type { ColorHarmony } from "@/lib/colorUtils";

export function ColorPicker() {
  const { t } = useTranslation();
  const {
    baseColor,
    colorName,
    harmony,
    updateBaseColor,
    updateColorName,
    updateHarmony,
    randomColor,
    pasteColor,
    savePalette,
    message,
  } = useColorFlowContext();
  const { isSupported: eyeDropperSupported, pickColor } = useEyeDropper();
  const [hexInputValue, setHexInputValue] = useState(baseColor);

  // Sincroniza o input quando baseColor muda externamente
  useEffect(() => {
    setHexInputValue(baseColor);
  }, [baseColor]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite digitar livremente
    setHexInputValue(value);
    
    // Remove espaços e valida
    const trimmedValue = value.trim();
    const hexRegex = /^#?[0-9A-Fa-f]{6}$|^#?[0-9A-Fa-f]{3}$/;
    
    // Se for válido, atualiza a cor base
    if (hexRegex.test(trimmedValue)) {
      updateBaseColor(trimmedValue.startsWith("#") ? trimmedValue : `#${trimmedValue}`);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBaseColor(e.target.value);
  };

  const handleEyeDropper = async () => {
    if (eyeDropperSupported) {
      const color = await pickColor();
      if (color) {
        updateBaseColor(color);
      }
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <header className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">{t("colorPicker.baseColor")}</Label>
          {message.text && (
            <span
              className={`text-sm ${
                message.type === "error" ? "text-red-400" : "text-green-400"
              }`}
              role="status"
              aria-live="polite"
            >
              {message.text}
            </span>
          )}
        </header>

        <div className="flex gap-3 items-center mb-4" role="group" aria-label={t("aria.colorControls")}>
          <div className="relative">
            <label htmlFor="color-picker" className="sr-only">{t("colorPicker.colorSelector")}</label>
            <input
              id="color-picker"
              type="color"
              value={baseColor}
              onChange={handleColorInputChange}
              className="w-16 h-16 rounded cursor-pointer border-2 border-border"
              aria-label={t("colorPicker.colorSelector")}
            />
          </div>
          <label htmlFor="hex-input" className="sr-only">{t("colorPicker.hexInput")}</label>
          <Input
            id="hex-input"
            type="text"
            value={hexInputValue}
            onChange={handleHexChange}
            className="flex-1 font-mono text-lg"
            placeholder={t("colorPicker.hexPlaceholder")}
            aria-label={t("colorPicker.hexInput")}
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={randomColor}
            title={t("colorPicker.randomColor")}
            aria-label={t("colorPicker.randomColor")}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          {eyeDropperSupported && (
            <Button
              variant="secondary"
              size="icon"
              onClick={handleEyeDropper}
              title={t("colorPicker.eyeDropper")}
              className="bg-purple-600 hover:bg-purple-700"
              aria-label={t("colorPicker.eyeDropper")}
            >
              <Pipette className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="secondary"
            size="icon"
            onClick={pasteColor}
            title={t("colorPicker.pasteColorShortcut")}
            className="bg-green-600 hover:bg-green-700"
            aria-label={t("colorPicker.pasteColor")}
          >
            <Clipboard className="w-5 h-5" />
          </Button>
        </div>

        <aside className="bg-muted p-3 rounded mb-4 text-sm text-muted-foreground" role="note" aria-label={t("aria.usageTip")}>
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong>{t("colorPicker.tip")}:</strong>{" "}
              <span dangerouslySetInnerHTML={{
                __html: t("colorPicker.tipText")
                  .replace(/<kbd>/g, '<kbd class="px-2 py-1 bg-background border border-border rounded text-xs">')
                  .replace(/<\/kbd>/g, '</kbd>')
              }} />
            </div>
          </div>
        </aside>

        <div className="mb-4">
          <Label htmlFor="harmony-select" className="block text-sm font-medium mb-2">
            {t("colorPicker.colorHarmony")}
          </Label>
          <Select
            value={harmony}
            onValueChange={(value) => updateHarmony(value as ColorHarmony)}
          >
            <SelectTrigger id="harmony-select" className="w-full" aria-label={t("colorPicker.colorHarmony")}>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" aria-hidden="true" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monochromatic">{t("colorPicker.harmony.monochromatic")}</SelectItem>
              <SelectItem value="complementary">{t("colorPicker.harmony.complementary")}</SelectItem>
              <SelectItem value="analogous">{t("colorPicker.harmony.analogous")}</SelectItem>
              <SelectItem value="triadic">{t("colorPicker.harmony.triadic")}</SelectItem>
              <SelectItem value="tetradic">{t("colorPicker.harmony.tetradic")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <HSLSliders />

        <div className="mt-4 flex gap-3">
          <div className="flex-1">
            <Label htmlFor="color-name-input" className="block text-sm font-medium mb-2">{t("colorPicker.variableName")}</Label>
            <Input
              id="color-name-input"
              type="text"
              value={colorName}
              onChange={(e) => updateColorName(e.target.value)}
              placeholder={t("colorPicker.variableNamePlaceholder")}
              className="w-full"
              aria-label={t("colorPicker.variableName")}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={savePalette}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              aria-label={t("colorPicker.savePalette")}
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {t("colorPicker.savePalette")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

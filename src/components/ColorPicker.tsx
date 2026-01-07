import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  RotateCcw,
  Pipette,
  Clipboard,
  Lightbulb,
  Save,
} from "lucide-react";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { useEyeDropper } from "@/hooks/useEyeDropper";
import { HSLSliders } from "./HSLSliders";

export function ColorPicker() {
  const {
    baseColor,
    colorName,
    updateBaseColor,
    updateColorName,
    randomColor,
    pasteColor,
    savePalette,
    message,
  } = useColorFlowContext();
  const { isSupported: eyeDropperSupported, pickColor } = useEyeDropper();

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const hexRegex = /^#?[0-9A-Fa-f]{6}$|^#?[0-9A-Fa-f]{3}$/;
    if (hexRegex.test(value)) {
      updateBaseColor(value.startsWith("#") ? value : `#${value}`);
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
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Cor Base</Label>
          {message.text && (
            <span
              className={`text-sm ${
                message.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {message.text}
            </span>
          )}
        </div>

        <div className="flex gap-3 items-center mb-4">
          <div className="relative">
            <input
              type="color"
              value={baseColor}
              onChange={handleColorInputChange}
              className="w-16 h-16 rounded cursor-pointer border-2 border-border"
            />
          </div>
          <Input
            type="text"
            value={baseColor}
            onChange={handleHexChange}
            className="flex-1 font-mono text-lg"
            placeholder="#1E80F1"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={randomColor}
            title="Cor aleatória"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          {eyeDropperSupported && (
            <Button
              variant="secondary"
              size="icon"
              onClick={handleEyeDropper}
              title="Capturar cor da tela"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Pipette className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="secondary"
            size="icon"
            onClick={pasteColor}
            title="Colar cor (Ctrl/Cmd + V)"
            className="bg-green-600 hover:bg-green-700"
          >
            <Clipboard className="w-5 h-5" />
          </Button>
        </div>

        <div className="bg-muted p-3 rounded mb-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Dica:</strong> Pressione <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">Ctrl+V</kbd> ou{" "}
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">⌘+V</kbd> para colar cores copiadas (HEX, RGB, HSL)
            </div>
          </div>
        </div>

        <HSLSliders />

        <div className="mt-4 flex gap-3">
          <div className="flex-1">
            <Label className="block text-sm font-medium mb-2">Nome da Variável</Label>
            <Input
              type="text"
              value={colorName}
              onChange={(e) => updateColorName(e.target.value)}
              placeholder="primary"
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={savePalette}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Salvar Paleta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

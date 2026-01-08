import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";

export function HSLSliders() {
  const { hsl, updateHSL } = useColorFlowContext();

  const handleHSLChange = (type: "h" | "s" | "l", value: number[]) => {
    updateHSL(type, value[0]);
  };

  // Gradiente para o slider de matiz (hue)
  const hueGradient =
    "linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))";

  // Gradiente para saturação (de cinza à cor saturada)
  const satGradient = `linear-gradient(to right, hsl(${Math.round(hsl.h)}, 0%, ${Math.round(hsl.l)}%), hsl(${Math.round(hsl.h)}, 100%, ${Math.round(hsl.l)}%))`;

  // Gradiente para luminosidade (de escuro à claro)
  const lightGradient = `linear-gradient(to right, hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, 0%), hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, 100%))`;

  // Aplicar gradientes diretamente no track usando useEffect
  useEffect(() => {
    const hueTrack = document.querySelector('#hue-slider [data-slot="slider-track"]') as HTMLElement;
    const hueRange = document.querySelector('#hue-slider [data-slot="slider-range"]') as HTMLElement;
    const satTrack = document.querySelector('#saturation-slider [data-slot="slider-track"]') as HTMLElement;
    const satRange = document.querySelector('#saturation-slider [data-slot="slider-range"]') as HTMLElement;
    const lightTrack = document.querySelector('#lightness-slider [data-slot="slider-track"]') as HTMLElement;
    const lightRange = document.querySelector('#lightness-slider [data-slot="slider-range"]') as HTMLElement;

    if (hueTrack) {
      hueTrack.style.background = hueGradient;
    }
    if (hueRange) {
      hueRange.style.background = 'transparent';
    }
    if (satTrack) {
      satTrack.style.background = satGradient;
    }
    if (satRange) {
      satRange.style.background = 'transparent';
    }
    if (lightTrack) {
      lightTrack.style.background = lightGradient;
    }
    if (lightRange) {
      lightRange.style.background = 'transparent';
    }
  }, [hsl.h, hsl.s, hsl.l, hueGradient, satGradient, lightGradient]);

  return (
    <fieldset className="space-y-3" aria-label="Controles HSL (Matiz, Saturação, Luminosidade)">
      <legend className="sr-only">Ajustes HSL</legend>
      <div>
        <div className="flex justify-between mb-1">
          <Label htmlFor="hue-slider" className="text-sm">H (Matiz)</Label>
          <span className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
            {Math.round(hsl.h)}°
          </span>
        </div>
        <div className="relative">
          <Slider
            id="hue-slider"
            min={0}
            max={360}
            value={[hsl.h]}
            onValueChange={(value) => handleHSLChange("h", value)}
            step={1}
            className="w-full [&_[data-slot=slider-range]]:bg-transparent"
            aria-label="Matiz da cor"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <Label htmlFor="saturation-slider" className="text-sm">S (Saturação)</Label>
          <span className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
            {Math.round(hsl.s)}%
          </span>
        </div>
        <div className="relative">
          <Slider
            id="saturation-slider"
            min={0}
            max={100}
            value={[hsl.s]}
            onValueChange={(value) => handleHSLChange("s", value)}
            step={1}
            className="w-full [&_[data-slot=slider-range]]:bg-transparent"
            aria-label="Saturação da cor"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <Label htmlFor="lightness-slider" className="text-sm">L (Luminosidade)</Label>
          <span className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
            {Math.round(hsl.l)}%
          </span>
        </div>
        <div className="relative">
          <Slider
            id="lightness-slider"
            min={0}
            max={100}
            value={[hsl.l]}
            onValueChange={(value) => handleHSLChange("l", value)}
            step={1}
            className="w-full [&_[data-slot=slider-range]]:bg-transparent"
            aria-label="Luminosidade da cor"
          />
        </div>
      </div>
    </fieldset>
  );
}

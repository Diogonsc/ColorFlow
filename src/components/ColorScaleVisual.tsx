import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";

export function ColorScaleVisual() {
  const { colorScale, selectColor, selectedColor } = useColorFlowContext();
  const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const handleColorClick = (hex: string) => {
    selectColor(hex);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Escala de Cores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-11 gap-1 mb-4" role="group" aria-label="Escala de cores visual">
          {scales.map((scale) => {
            const color = colorScale[scale];
            if (!color) return null;
            const isSelected = selectedColor === color.hex;
            return (
              <div key={scale} className="group relative">
                <button
                  type="button"
                  className={`h-20 w-full rounded cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  data-scale={scale}
                  onClick={() => handleColorClick(color.hex)}
                  title={`Clique para selecionar ${color.hex}`}
                  aria-label={`Cor ${scale}: ${color.hex}${isSelected ? ', selecionada' : ''}`}
                  aria-pressed={isSelected}
                />
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
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-11 gap-1 text-xs text-center" role="list" aria-label="Valores da escala">
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

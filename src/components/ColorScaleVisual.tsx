import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";

export function ColorScaleVisual() {
  const { colorScale, colorName, selectColor, selectedColor } = useColorFlowContext();
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
        <div className="grid grid-cols-11 gap-1 mb-4">
          {scales.map((scale) => {
            const color = colorScale[scale];
            if (!color) return null;
            const isSelected = selectedColor === color.hex;
            return (
              <div key={scale} className="group relative">
                <div
                  className={`h-20 rounded cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? "ring-4 ring-blue-500 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  data-scale={scale}
                  onClick={() => handleColorClick(color.hex)}
                  title={`Clique para selecionar ${color.hex}`}
                />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
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
        <div className="grid grid-cols-11 gap-1 text-xs text-center">
          {scales.map((scale) => (
            <div key={scale} className="text-muted-foreground font-mono">
              {scale}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

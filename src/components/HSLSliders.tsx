import { Label } from "@/components/ui/label";
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

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between mb-1">
          <Label className="text-sm">H (Matiz)</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(hsl.h)}°
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={hsl.h}
          onChange={(e) => handleHSLChange("h", [parseFloat(e.target.value)])}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: hueGradient,
          }}
        />
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <Label className="text-sm">S (Saturação)</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(hsl.s)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={hsl.s}
          onChange={(e) => handleHSLChange("s", [parseFloat(e.target.value)])}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: satGradient,
          }}
        />
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <Label className="text-sm">L (Luminosidade)</Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(hsl.l)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={hsl.l}
          onChange={(e) => handleHSLChange("l", [parseFloat(e.target.value)])}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: lightGradient,
          }}
        />
      </div>
    </div>
  );
}

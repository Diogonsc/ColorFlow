import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Star, Trash2 } from "lucide-react";
import type { SavedPalette } from "@/hooks/useColorFlow";

interface SavedPalettesProps {
  palettes: SavedPalette[];
  favorites: string[];
  onLoadPalette: (palette: SavedPalette) => void;
  onDeletePalette: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function SavedPalettes({
  palettes,
  favorites,
  onLoadPalette,
  onDeletePalette,
  onToggleFavorite,
}: SavedPalettesProps) {
  const sortedPalettes = [...palettes].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (palettes.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <p className="text-muted-foreground text-center py-4">
            Nenhuma paleta salva ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Paletas Salvas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sortedPalettes.map((palette) => {
            const isFavorite = favorites.includes(palette.id);
            return (
              <div
                key={palette.id}
                className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded border-2 border-border flex-shrink-0"
                      style={{ backgroundColor: palette.baseColor }}
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {palette.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(palette.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onToggleFavorite(palette.id)}
                      className={isFavorite ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}
                      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Star
                        className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onLoadPalette(palette)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Carregar"
                    >
                      <Folder className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir esta paleta?")) {
                          onDeletePalette(palette.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {Object.values(palette.colorScale).map((color, index) => (
                    <div
                      key={index}
                      className="flex-1 h-6 rounded-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

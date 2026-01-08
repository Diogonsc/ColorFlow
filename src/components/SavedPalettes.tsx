import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowRightCircle, Star, Trash2 } from "lucide-react";
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
  const [paletteToDelete, setPaletteToDelete] = useState<SavedPalette | null>(null);

  const sortedPalettes = [...palettes].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleDeleteClick = (palette: SavedPalette) => {
    setPaletteToDelete(palette);
  };

  const handleConfirmDelete = () => {
    if (paletteToDelete) {
      onDeletePalette(paletteToDelete.id);
      setPaletteToDelete(null);
    }
  };

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
        <ul className="space-y-3 max-h-64 overflow-y-auto" role="list" aria-label="Lista de paletas salvas">
          {sortedPalettes.map((palette) => {
            const isFavorite = favorites.includes(palette.id);
            return (
              <li
                key={palette.id}
                className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors"
                role="listitem"
              >
                <article>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border-2 border-border flex-shrink-0"
                        style={{ backgroundColor: palette.baseColor }}
                        aria-label={`Cor base da paleta ${palette.name}`}
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {palette.name}
                        </h4>
                        <time className="text-xs text-muted-foreground" dateTime={palette.createdAt}>
                          {new Date(palette.createdAt).toLocaleDateString("pt-BR")}
                        </time>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center" role="group" aria-label={`Ações para paleta ${palette.name}`}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onToggleFavorite(palette.id)}
                        className={isFavorite ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}
                        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        aria-label={isFavorite ? `Remover ${palette.name} dos favoritos` : `Adicionar ${palette.name} aos favoritos`}
                        aria-pressed={isFavorite}
                      >
                        <Star
                          className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                          aria-hidden="true"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onLoadPalette(palette)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Aplicar"
                        aria-label={`Aplicar paleta ${palette.name}`}
                      >
                        <ArrowRightCircle className="w-4 h-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteClick(palette)}
                        className="text-red-400 hover:text-red-300"
                        title="Excluir"
                        aria-label={`Excluir paleta ${palette.name}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-1" role="img" aria-label={`Escala de cores da paleta ${palette.name}`}>
                    {Object.values(palette.colorScale).map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 h-6 rounded-sm"
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Cor ${index + 1}: ${color.hex}`}
                      />
                    ))}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </CardContent>

      <AlertDialog open={!!paletteToDelete} onOpenChange={(open) => !open && setPaletteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Paleta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a paleta <strong>{paletteToDelete?.name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

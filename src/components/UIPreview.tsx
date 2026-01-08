import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useColorFlowContext } from "@/contexts/ColorFlowContext";
import { useState } from "react";
import { Bold } from "lucide-react";

export function UIPreview() {
  const { selectedColor } = useColorFlowContext();
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [togglePressed, setTogglePressed] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  // Calcular cor de texto baseado no contraste
  const getTextColor = (bgColor: string) => {
    const rgb = bgColor.match(/\w\w/g)?.map((x) => parseInt(x, 16));
    if (!rgb) return "#ffffff";
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  // Aplicar cor selecionada como CSS variable
  const textColor = selectedColor ? getTextColor(selectedColor) : "#ffffff";
  const styleProps = selectedColor
    ? {
        style: {
          "--primary": selectedColor,
          "--primary-foreground": textColor,
          "--accent": selectedColor,
          "--accent-foreground": textColor,
        } as React.CSSProperties,
        className: "ui-preview-wrapper",
      }
    : { className: "ui-preview-wrapper" };

  // Aplicar estilos globais para o Select quando houver cor selecionada
  React.useEffect(() => {
    if (selectedColor) {
      const styleId = "ui-preview-select-styles";
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const textColor = getTextColor(selectedColor);
      styleElement.textContent = `
        /* Sobrescrever variáveis CSS para o Select */
        :root {
          --accent: ${selectedColor} !important;
          --accent-foreground: ${textColor} !important;
        }
        /* Select items highlighted - usando múltiplos seletores para garantir */
        [data-radix-select-content] [data-highlighted],
        [data-radix-select-content] button[data-highlighted],
        [data-radix-select-content] [data-radix-select-item][data-highlighted],
        [data-radix-select-content] button[data-radix-select-item][data-highlighted],
        [data-radix-select-content] [data-highlighted="true"],
        [data-radix-select-content] button[data-highlighted="true"],
        [data-radix-select-content] [data-radix-select-item][data-highlighted="true"],
        [data-radix-select-content] button[data-radix-select-item][data-highlighted="true"],
        /* Hover e focus também */
        [data-radix-select-content] [data-radix-select-item]:hover,
        [data-radix-select-content] button[data-radix-select-item]:hover,
        [data-radix-select-content] [data-radix-select-item]:focus,
        [data-radix-select-content] button[data-radix-select-item]:focus,
        /* Estilos com classes do Tailwind - sobrescrever bg-accent */
        [data-radix-select-content] [class*="bg-accent"],
        [data-radix-select-content] button[class*="bg-accent"],
        [data-radix-select-content] [class*="focus:bg-accent"]:focus,
        [data-radix-select-content] button[class*="focus:bg-accent"]:focus,
        [data-radix-select-content] [class*="data-[highlighted]:bg-accent"][data-highlighted],
        [data-radix-select-content] button[class*="data-[highlighted]:bg-accent"][data-highlighted] {
          background-color: ${selectedColor} !important;
          color: ${textColor} !important;
        }
        /* Calendar day selected */
        .rdp-day_selected,
        button.rdp-day_selected {
          background-color: ${selectedColor} !important;
          color: ${textColor} !important;
        }
        /* Calendar day range */
        .rdp-day_range_middle {
          background-color: ${selectedColor} !important;
          color: ${textColor} !important;
        }
      `;
    }

    return () => {
      const styleElement = document.getElementById("ui-preview-select-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [selectedColor]);

  return (
    <section {...styleProps} aria-label="Preview dos componentes de interface">
      <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Preview dos Componentes UI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="preview-input">Input</Label>
          <Input
            id="preview-input"
            placeholder="Digite algo..."
            defaultValue="Exemplo de input"
            aria-label="Campo de entrada de texto de exemplo"
          />
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <Label htmlFor="preview-textarea">Textarea</Label>
          <Textarea
            id="preview-textarea"
            placeholder="Digite sua mensagem..."
            defaultValue="Exemplo de textarea"
            aria-label="Área de texto de exemplo"
          />
        </div>

        {/* Select */}
        <div className="space-y-2">
          <Label htmlFor="preview-select">Select</Label>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger id="preview-select" aria-label="Seletor de opções de exemplo">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent className="ui-preview-select-content">
              <SelectItem value="opcao1">Opção 1</SelectItem>
              <SelectItem value="opcao2">Opção 2</SelectItem>
              <SelectItem value="opcao3">Opção 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="preview-checkbox"
            checked={checkboxChecked}
            onCheckedChange={(checked) =>
              setCheckboxChecked(checked === true)
            }
            aria-label="Checkbox de exemplo"
          />
          <Label
            htmlFor="preview-checkbox"
            className="cursor-pointer font-normal"
          >
            Checkbox
          </Label>
        </div>

        {/* Switch */}
        <div className="flex items-center space-x-2">
          <Switch
            id="preview-switch"
            checked={switchChecked}
            onCheckedChange={setSwitchChecked}
            aria-label="Switch de exemplo"
          />
          <Label htmlFor="preview-switch" className="cursor-pointer font-normal">
            Switch
          </Label>
        </div>

        {/* Toggle */}
        <div className="flex items-center space-x-2">
          <Toggle
            id="preview-toggle"
            pressed={togglePressed}
            onPressedChange={setTogglePressed}
            aria-label="Toggle bold"
          >
            <Bold className="h-4 w-4" aria-hidden="true" />
          </Toggle>
          <Label htmlFor="preview-toggle" className="cursor-pointer font-normal">
            Toggle
          </Label>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3" role="group" aria-label="Botões de exemplo">
          <Button aria-label="Botão padrão de exemplo">Button Default</Button>
          <Button variant="secondary" aria-label="Botão secundário de exemplo">Button Secondary</Button>
          <Button variant="outline" aria-label="Botão outline de exemplo">Button Outline</Button>
          <Button variant="ghost" aria-label="Botão ghost de exemplo">Button Ghost</Button>
          <Button variant="destructive" aria-label="Botão destrutivo de exemplo">Button Destructive</Button>
        </div>

        {/* Badge */}
        <div className="space-y-2">
          <Label>Badge</Label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Badges de exemplo">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        {/* DatePicker */}
        <div className="space-y-2">
          <Label htmlFor="preview-datepicker">DatePicker</Label>
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
            placeholder="Selecione uma data"
            aria-label="Seletor de data de exemplo"
          />
        </div>

        {/* Calendar */}
        <div className="space-y-2">
          <Label>Calendar</Label>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md border"
              aria-label="Calendário de exemplo"
            />
          </div>
        </div>

        {/* Pagination */}
        <nav className="space-y-2" aria-label="Paginação de exemplo">
          <Label>Pagination</Label>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" aria-label="Página anterior" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive aria-label="Página 1, página atual">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" aria-label="Página 2">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" aria-label="Página 3">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis aria-label="Mais páginas" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" aria-label="Próxima página" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </nav>

        {selectedColor && (
          <aside className="mt-4 p-3 bg-muted rounded text-sm" role="status" aria-label="Cor selecionada">
            <strong>Cor selecionada:</strong>{" "}
            <span className="font-mono">{selectedColor}</span>
            <div
              className="mt-2 h-8 rounded border-2 border-border"
              style={{ backgroundColor: selectedColor }}
              aria-label={`Amostra da cor ${selectedColor}`}
            />
          </aside>
        )}
      </CardContent>
    </Card>
    </section>
  );
}

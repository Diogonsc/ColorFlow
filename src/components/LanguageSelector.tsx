import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import braFlag from "@/assets/bra.png";
import usaFlag from "@/assets/usa.png";

const FLAGS = {
  'pt-BR': braFlag,
  'en-US': usaFlag,
} as const;

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    // Salvar preferência no localStorage
    localStorage.setItem('i18nextLng', value);
  };

  const currentFlag = FLAGS[i18n.language as keyof typeof FLAGS] || FLAGS['pt-BR'];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[60px] h-9 px-2" aria-label="Selecionar idioma">
        <SelectValue>
          <img 
            src={currentFlag} 
            alt="" 
            className="w-6 h-4 object-cover rounded-sm"
            aria-hidden="true"
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-auto min-w-[60px]">
        <SelectItem value="pt-BR" className="justify-center">
          <img 
            src={braFlag} 
            alt="Português (Brasil)" 
            className="w-6 h-4 object-cover rounded-sm"
          />
        </SelectItem>
        <SelectItem value="en-US" className="justify-center">
          <img 
            src={usaFlag} 
            alt="English (US)" 
            className="w-6 h-4 object-cover rounded-sm"
          />
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

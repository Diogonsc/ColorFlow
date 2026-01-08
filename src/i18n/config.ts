import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationPT from './locales/pt-BR/translation.json';
import translationEN from './locales/en-US/translation.json';

const resources = {
  'pt-BR': {
    translation: translationPT,
  },
  'en-US': {
    translation: translationEN,
  },
};

// Detectar idioma do localStorage ou navegador
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('i18nextLng');
  if (stored && (stored === 'pt-BR' || stored === 'en-US')) {
    return stored;
  }
  const browserLang = navigator.language || 'pt-BR';
  // Normalizar idioma do navegador
  if (browserLang.startsWith('pt')) {
    return 'pt-BR';
  }
  if (browserLang.startsWith('en')) {
    return 'en-US';
  }
  return 'pt-BR';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false, // React já faz escape por padrão
    },
  });

export default i18n;

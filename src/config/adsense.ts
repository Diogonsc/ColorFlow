/**
 * Configuração do Google AdSense
 * 
 * Para usar, substitua 'ca-pub-XXXXXXXXXXXXXXXX' pelo seu Publisher ID do AdSense
 * Você pode encontrar seu Publisher ID em: https://www.google.com/adsense/
 */

export const ADSENSE_CONFIG = {
  // Substitua pelo seu Publisher ID do Google AdSense
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  
  // Formato padrão dos anúncios
  defaultFormat: 'auto' as const,
  
  // Layout responsivo padrão
  defaultLayout: 'in-article' as const,
  
  // Tamanhos padrão de anúncios
  sizes: {
    // Tamanho padrão para anúncios verticais (Skyscraper)
    vertical: {
      width: 160,
      height: 600,
    },
    // Tamanho padrão para anúncios horizontais (Leaderboard)
    horizontal: {
      width: 728,
      height: 90,
    },
  },
  
  // Habilitar anúncios (desative durante desenvolvimento)
  enabled: process.env.NODE_ENV === 'production',
} as const;

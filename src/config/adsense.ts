/**
 * Configuração do Google AdSense
 * 
 * IMPORTANTE: Antes de usar em produção, você precisa:
 * 1. Criar unidades de anúncio no Google AdSense
 * 2. Substituir os valores abaixo pelos IDs reais das unidades criadas
 * 3. Acesse: https://www.google.com/adsense/ → Anúncios → Por unidade de anúncio
 */

export const ADSENSE_CONFIG = {
  // Publisher ID do Google AdSense
  publisherId: 'ca-pub-6634796899207409',
  
  // IDs das unidades de anúncio (substitua pelos IDs reais do AdSense)
  adSlots: {
    // Anúncio lateral esquerda (vertical - desktop)
    sidebarLeft: '1234567890', // TODO: Substituir pelo ID real
    
    // Anúncio lateral direita (vertical - desktop)
    sidebarRight: '1234567890', // TODO: Substituir pelo ID real
    
    // Anúncio abaixo do header (horizontal - mobile)
    mobileHeader: '1234567890', // TODO: Substituir pelo ID real
    
    // Anúncio no final da página (horizontal)
    pageFooter: '1234567890', // TODO: Substituir pelo ID real
  },
  
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
  enabled: import.meta.env.PROD,
} as const;

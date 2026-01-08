import { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG } from '@/config/adsense';

interface AdSenseProps {
  /**
   * ID único do slot de anúncio
   */
  adSlot: string;
  
  /**
   * Formato do anúncio (ex: 'auto', 'rectangle', 'horizontal')
   */
  format?: string;
  
  /**
   * Layout do anúncio (ex: 'in-article', 'display')
   */
  layout?: string;
  
  /**
   * Largura do anúncio (em pixels)
   */
  width?: number;
  
  /**
   * Altura do anúncio (em pixels)
   */
  height?: number;
  
  /**
   * Classe CSS adicional
   */
  className?: string;
  
  /**
   * Estilo inline adicional
   */
  style?: React.CSSProperties;
}

/**
 * Componente para exibir anúncios do Google AdSense
 * 
 * @example
 * ```tsx
 * <AdSense 
 *   adSlot="1234567890" 
 *   format="auto"
 *   className="my-4"
 * />
 * ```
 */
export function AdSense({
  adSlot,
  format = ADSENSE_CONFIG.defaultFormat,
  layout = ADSENSE_CONFIG.defaultLayout,
  width,
  height,
  className = '',
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // Não inicializar em desenvolvimento ou se já foi inicializado
    if (!ADSENSE_CONFIG.enabled || adInitialized.current || !adRef.current) {
      return;
    }

    try {
      // Verifica se o script do AdSense está carregado
      if (typeof window.adsbygoogle === 'undefined') {
        console.warn('Google AdSense script não foi carregado');
        return;
      }

      // Inicializa o anúncio
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adInitialized.current = true;
    } catch (error) {
      console.error('Erro ao inicializar AdSense:', error);
    }
  }, [adSlot]);

  // Não renderizar se AdSense estiver desabilitado
  if (!ADSENSE_CONFIG.enabled) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded p-4 text-center text-sm text-gray-500 dark:text-gray-400 ${className}`}
        style={{
          ...style,
          ...(width && height ? { width: `${width}px`, height: `${height}px`, minHeight: `${height}px` } : {}),
        }}
      >
        <p>Anúncio (AdSense desabilitado em desenvolvimento)</p>
        <p className="text-xs mt-1">Slot: {adSlot}</p>
        {width && height && (
          <p className="text-xs mt-1">Tamanho: {width}x{height}px</p>
        )}
      </div>
    );
  }

  // Se width e height são fornecidos, não usar full-width-responsive
  const useFullWidth = !(width && height);

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className}`}
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(width && height ? { width: `${width}px`, height: `${height}px` } : {}),
        }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        {...(useFullWidth ? { 'data-full-width-responsive': 'true' } : {})}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
}

/**
 * Componente pré-configurado para anúncios automáticos (Auto Ads)
 * Este componente é útil para anúncios que o Google AdSense gerencia automaticamente
 */
export function AdSenseAuto() {
  // Para Auto Ads, o script no index.html já é suficiente
  // Este componente serve apenas como placeholder/documentação
  return null;
}

import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CONFIG } from '@/config/adsense';

export interface AdSenseProps {
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
  const insRef = useRef<HTMLModElement>(null);
  const adInitialized = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    // Não inicializar em desenvolvimento ou se já foi inicializado
    if (!ADSENSE_CONFIG.enabled || adInitialized.current || !adRef.current) {
      if (!ADSENSE_CONFIG.enabled) {
        setShouldHide(true);
      }
      return;
    }

    try {
      // Verifica se o script do AdSense está carregado
      if (typeof window.adsbygoogle === 'undefined') {
        console.warn('Google AdSense script não foi carregado');
        setShouldHide(true);
        return;
      }

      // Inicializa o anúncio
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adInitialized.current = true;
    } catch (error) {
      console.error('Erro ao inicializar AdSense:', error);
      setShouldHide(true);
    }
  }, [adSlot]);

  // Observa se o anúncio foi carregado
  useEffect(() => {
    if (!ADSENSE_CONFIG.enabled || !insRef.current || adInitialized.current === false) {
      return;
    }

    // Timeout para verificar se o anúncio carregou
    const checkTimeout = setTimeout(() => {
      if (!insRef.current || !adRef.current) return;

      // Verifica se há conteúdo no elemento ins
      const hasContent = insRef.current.children.length > 0 || 
                        insRef.current.offsetHeight > 0 ||
                        insRef.current.innerHTML.trim().length > 0;

      // Verifica se há iframes vazios
      const iframes = adRef.current.querySelectorAll('iframe');
      let hasValidIframe = false;
      iframes.forEach((iframe) => {
        // Verifica se o iframe tem conteúdo ou se não está vazio
        if (iframe.contentDocument && iframe.contentDocument.body) {
          const bodyContent = iframe.contentDocument.body.innerHTML.trim();
          if (bodyContent.length > 0) {
            hasValidIframe = true;
          }
        }
        // Se o iframe tem altura/largura significativa, considera válido
        if (iframe.offsetWidth > 10 && iframe.offsetHeight > 10) {
          // Verifica se não é apenas um iframe vazio do AdSense
          const iframeId = iframe.id || '';
          let iframeBodyContent = '';
          try {
            if (iframe.contentDocument && iframe.contentDocument.body) {
              iframeBodyContent = iframe.contentDocument.body.innerHTML.trim();
            }
          } catch (e) {
            // Cross-origin
          }
          if (!iframeId.includes('aswift') || iframeBodyContent.length > 0) {
            hasValidIframe = true;
          }
        }
      });

      if (hasContent || hasValidIframe) {
        setAdLoaded(true);
      } else {
        // Se após 3 segundos não houver conteúdo, oculta o espaço
        setShouldHide(true);
      }
    }, 3000);

    // Observer para detectar quando o anúncio é carregado
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0 || mutation.type === 'childList') {
          if (!insRef.current || !adRef.current) return;
          
          const hasContent = insRef.current.children.length > 0 ||
            insRef.current.offsetHeight > 0 ||
            insRef.current.innerHTML.trim().length > 0;

          // Verifica iframes
          const iframes = adRef.current.querySelectorAll('iframe');
          let hasValidIframe = false;
          iframes.forEach((iframe) => {
            if (iframe.contentDocument && iframe.contentDocument.body) {
              const bodyContent = iframe.contentDocument.body.innerHTML.trim();
              if (bodyContent.length > 0) {
                hasValidIframe = true;
              }
            }
            if (iframe.offsetWidth > 10 && iframe.offsetHeight > 10) {
              const iframeId = iframe.id || '';
              if (!iframeId.includes('aswift') || (iframe.contentDocument && iframe.contentDocument.body.innerHTML.trim().length > 0)) {
                hasValidIframe = true;
              }
            }
          });
          
          if (hasContent || hasValidIframe) {
            setAdLoaded(true);
            observer.disconnect();
            clearTimeout(checkTimeout);
          }
        }
      });
    });

    if (insRef.current) {
      observer.observe(insRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    return () => {
      observer.disconnect();
      clearTimeout(checkTimeout);
    };
  }, [adSlot, adInitialized.current]);

  // Não renderizar se AdSense estiver desabilitado ou se não houver anúncio
  if (!ADSENSE_CONFIG.enabled || shouldHide) {
    return null;
  }

  // Se width e height são fornecidos, não usar full-width-responsive
  const useFullWidth = !(width && height);

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        ...style,
        // Só mostra espaço mínimo se o anúncio ainda não carregou
        minHeight: adLoaded ? undefined : (height ? `${height}px` : '90px'),
        display: shouldHide ? 'none' : 'block',
      }}
    >
      <ins
        ref={insRef}
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

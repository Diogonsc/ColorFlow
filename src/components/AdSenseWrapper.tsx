import { useState, useEffect, useRef } from 'react';
import { AdSense } from './AdSense';
import type { AdSenseProps } from './AdSense';

interface AdSenseWrapperProps extends AdSenseProps {
  /**
   * Classe CSS para o elemento aside/container
   */
  containerClassName?: string;
  /**
   * Se deve renderizar como aside ou div
   */
  asAside?: boolean;
  /**
   * aria-label para o aside
   */
  ariaLabel?: string;
}

/**
 * Wrapper para AdSense que só renderiza o container quando o anúncio carregar
 */
export function AdSenseWrapper({
  containerClassName = '',
  asAside = true,
  ariaLabel,
  ...adSenseProps
}: AdSenseWrapperProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    // Verifica periodicamente se há conteúdo no container
    const checkForContent = () => {
      if (!containerRef.current) return;

      // Verifica se há elementos ins com conteúdo
      const insElements = containerRef.current.querySelectorAll('ins.adsbygoogle');
      let hasContent = false;

      insElements.forEach((ins) => {
        const htmlIns = ins as HTMLElement;
        if (htmlIns.children.length > 0 || htmlIns.offsetHeight > 0) {
          hasContent = true;
        }
      });

      // Verifica iframes
      const iframes = containerRef.current.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        // Ignora iframes vazios do AdSense (aswift_*)
        const iframeId = iframe.id || '';
        if (iframeId.includes('aswift_')) {
          // Verifica se o iframe tem conteúdo real
          try {
            if (iframe.contentDocument && iframe.contentDocument.body) {
              const bodyContent = iframe.contentDocument.body.innerHTML.trim();
              if (bodyContent.length > 50) { // Conteúdo significativo
                hasContent = true;
              }
            }
          } catch (e) {
            // Cross-origin, verifica por tamanho
            if (iframe.offsetWidth > 50 && iframe.offsetHeight > 50) {
              hasContent = true;
            }
          }
        } else {
          // Iframe não é do AdSense, considera válido se tiver tamanho
          if (iframe.offsetWidth > 10 && iframe.offsetHeight > 10) {
            hasContent = true;
          }
        }
      });

      if (!hasContent) {
        // Aguarda mais um pouco antes de ocultar
        if (checkTimeoutRef.current) {
          clearTimeout(checkTimeoutRef.current);
        }
        checkTimeoutRef.current = setTimeout(() => {
          setShouldRender(false);
        }, 2000);
      } else {
        if (checkTimeoutRef.current) {
          clearTimeout(checkTimeoutRef.current);
        }
      }
    };

    // Verifica após um delay inicial
    const initialTimeout = setTimeout(() => {
      checkForContent();
      // Continua verificando periodicamente
      intervalId = setInterval(checkForContent, 1000);
    }, 3000);

    return () => {
      clearTimeout(initialTimeout);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  if (asAside) {
    return (
      <aside 
        ref={containerRef as React.RefObject<HTMLElement>}
        className={containerClassName} 
        aria-label={ariaLabel}
      >
        <AdSense {...adSenseProps} />
      </aside>
    );
  }

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className={containerClassName}>
      <AdSense {...adSenseProps} />
    </div>
  );
}

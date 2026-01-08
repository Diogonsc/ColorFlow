/**
 * Tipos globais para Google AdSense e Google Analytics
 */

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export {};

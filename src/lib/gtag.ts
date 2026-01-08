// src/lib/gtag.ts

export const GA_TRACKING_ID = 'G-XXXXXX'; // Seu ID do Google Analytics/Ads

// Dispara um evento customizado
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
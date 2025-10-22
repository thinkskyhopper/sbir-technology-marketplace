import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * GoogleAnalyticsTracker component
 * Tracks route changes in the React SPA and sends pageview events to Google Analytics
 */
const GoogleAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag is available (loaded from index.html)
    if (typeof window.gtag !== 'undefined') {
      // Send pageview event to Google Analytics
      window.gtag('config', 'G-HC5JDLBN5T', {
        page_path: location.pathname + location.search,
      });

      console.log('GA Pageview tracked:', location.pathname + location.search);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default GoogleAnalyticsTracker;

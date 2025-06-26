
import { useEffect } from 'react';

interface MetaTagData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useMetaTags = (metaData: MetaTagData) => {
  useEffect(() => {
    // Update document title
    if (metaData.title) {
      document.title = metaData.title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      // Check for both name and property attributes to cover all meta tag types
      let element = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        // Create new meta tag
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update Open Graph and Twitter meta tags
    if (metaData.title) {
      updateMetaTag('og:title', metaData.title);
      updateMetaTag('twitter:title', metaData.title);
    }

    if (metaData.description) {
      updateMetaTag('description', metaData.description);
      updateMetaTag('og:description', metaData.description);
      updateMetaTag('twitter:description', metaData.description);
    }

    if (metaData.keywords) {
      updateMetaTag('keywords', metaData.keywords);
    }

    if (metaData.image) {
      updateMetaTag('og:image', metaData.image);
      updateMetaTag('twitter:image', metaData.image);
    }

    if (metaData.url) {
      updateMetaTag('og:url', metaData.url);
    }

    if (metaData.type) {
      updateMetaTag('og:type', metaData.type);
    }

    // Cleanup function to restore original meta tags when component unmounts
    return () => {
      // Restore original site meta tags
      updateMetaTag('og:title', 'The SBIR Tech Marketplace');
      updateMetaTag('twitter:title', 'The SBIR Tech Marketplace');
      updateMetaTag('description', 'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.');
      updateMetaTag('og:description', 'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.');
      updateMetaTag('twitter:description', 'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.');
      updateMetaTag('keywords', '');
      updateMetaTag('og:image', '/lovable-uploads/f964523f-f4e2-493f-94a1-a80c35e6a6f4.png');
      updateMetaTag('twitter:image', '/lovable-uploads/f964523f-f4e2-493f-94a1-a80c35e6a6f4.png');
      updateMetaTag('og:type', 'website');
      document.title = 'The SBIR Tech Marketplace';
    };
  }, [metaData]);
};

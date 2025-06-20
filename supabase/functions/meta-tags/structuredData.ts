
import type { MetaData } from './types.ts';

export const generateStructuredData = (metaData: MetaData, longDescription: string, appDomain: string): string => {
  return `<!-- Structured Data for better SEO and social sharing -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "${metaData.title.replace(/"/g, '\\"')}",
      "description": "${longDescription.replace(/"/g, '\\"')}",
      "image": {
        "@type": "ImageObject",
        "url": "${metaData.image}",
        "width": 1200,
        "height": 630,
        "caption": "${metaData.title.replace(/"/g, '\\"')}"
      },
      "url": "${metaData.url}",
      "datePublished": "${new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}",
      "author": {
        "@type": "Organization",
        "name": "SBIR Tech Marketplace",
        "url": "${appDomain}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SBIR Tech Marketplace",
        "url": "${appDomain}",
        "logo": {
          "@type": "ImageObject",
          "url": "${metaData.image}",
          "width": 1200,
          "height": 630
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${metaData.url}"
      }
    }
    </script>`;
};

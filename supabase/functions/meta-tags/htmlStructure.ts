
import type { MetaData } from './types.ts';

export const generateHtmlStructure = (
  metaData: MetaData, 
  metaTagsHtml: string, 
  structuredDataScript: string,
  longDescription: string
): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    ${metaTagsHtml}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}">
    
    <!-- Favicon and icons -->
    <link rel="icon" type="image/x-icon" href="${metaData.url.split('/listing/')[0]}/favicon.ico">
    <link rel="shortcut icon" href="${metaData.url.split('/listing/')[0]}/favicon.ico">
    <link rel="apple-touch-icon" href="${metaData.image}">
    
    ${structuredDataScript}
</head>
<body>
    <!-- Enhanced content for crawlers and humans -->
    <main role="main" itemscope itemtype="https://schema.org/TechArticle">
        <article>
            <header>
                <h1 itemprop="headline">${metaData.title}</h1>
                <p itemprop="description">${longDescription}</p>
                <meta itemprop="datePublished" content="${new Date().toISOString()}">
                <meta itemprop="dateModified" content="${new Date().toISOString()}">
                <div itemprop="author" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="SBIR Tech Marketplace">
                    <meta itemprop="url" content="${metaData.url.split('/listing/')[0]}">
                </div>
            </header>
            
            <div>
                <img itemprop="image" src="${metaData.image}" alt="${metaData.title}" width="1200" height="630">
            </div>
            
            <footer>
                <a href="${metaData.url}" rel="canonical">View Full Listing →</a>
            </footer>
        </article>
    </main>
    
    <script>
        // Enhanced crawler detection with better platform recognition
        const userAgent = navigator.userAgent.toLowerCase();
        
        const crawlerPatterns = [
            'bot', 'crawler', 'spider', 'preview', 'teams', 'msteams', 'skype', 'outlook', 
            'office', 'facebookexternalhit', 'twitterbot', 'linkedinbot', 'microsoftpreview',
            'validator', 'fetcher', 'embed', 'parser', 'card'
        ];
        
        const isCrawlerClient = crawlerPatterns.some(pattern => userAgent.includes(pattern));
        
        console.log('Enhanced User Agent Check:', navigator.userAgent);
        console.log('Is Crawler (Enhanced):', isCrawlerClient);
        console.log('Document Title:', document.title);
        console.log('Meta Description:', document.querySelector('meta[name="description"]')?.getAttribute('content'));
        console.log('OG Title:', document.querySelector('meta[property="og:title"]')?.getAttribute('content'));
        console.log('OG Description:', document.querySelector('meta[property="og:description"]')?.getAttribute('content'));
        console.log('OG Image:', document.querySelector('meta[property="og:image"]')?.getAttribute('content'));
        
        // Only redirect human users after a longer delay to ensure crawlers have time to read
        if (!isCrawlerClient) {
            console.log('Human user detected, redirecting after delay to:', '${metaData.url}');
            setTimeout(() => {
                window.location.href = '${metaData.url}';
            }, 1000); // Increased delay for better crawler support
        } else {
            console.log('Crawler detected, serving static preview page');
            // For crawlers, ensure the page is fully rendered
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM fully loaded for crawler');
            });
        }
    </script>
</body>
</html>`;
};

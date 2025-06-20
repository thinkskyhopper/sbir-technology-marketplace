
import type { MetaData } from './types.ts';

export const generateHtmlStructure = (
  metaData: MetaData, 
  metaTagsHtml: string, 
  structuredDataScript: string,
  longDescription: string
): string => {
  return `<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    ${metaTagsHtml}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}">
    
    <!-- Favicon and icons -->
    <link rel="icon" type="image/x-icon" href="${metaData.url.split('/listing/')[0]}/favicon.ico">
    <link rel="shortcut icon" href="${metaData.url.split('/listing/')[0]}/favicon.ico">
    <link rel="apple-touch-icon" href="${metaData.image}">
    
    <!-- Additional head tags for better compatibility -->
    <meta name="referrer" content="unsafe-url">
    <meta name="format-detection" content="telephone=no">
    <meta name="mobile-web-app-capable" content="yes">
    
    ${structuredDataScript}
</head>
<body>
    <!-- Enhanced content for crawlers and humans -->
    <main role="main" itemscope itemtype="https://schema.org/TechArticle">
        <article class="listing-preview">
            <header>
                <h1 itemprop="headline">${metaData.title}</h1>
                <p class="description" itemprop="description">${longDescription}</p>
                <meta itemprop="datePublished" content="${new Date().toISOString()}">
                <meta itemprop="dateModified" content="${new Date().toISOString()}">
                <div itemprop="author" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="SBIR Tech Marketplace">
                    <meta itemprop="url" content="${metaData.url.split('/listing/')[0]}">
                </div>
            </header>
            
            <div class="image-container">
                <img itemprop="image" src="${metaData.image}" alt="${metaData.title}" width="1200" height="630" loading="eager">
            </div>
            
            <div class="content">
                <p>View this technology listing on the SBIR Tech Marketplace.</p>
            </div>
            
            <footer>
                <a href="${metaData.url}" rel="canonical" class="view-listing-btn">View Full Listing →</a>
            </footer>
        </article>
    </main>
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .listing-preview {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            margin: 0 0 15px 0;
            color: #1a202c;
            font-size: 1.8rem;
            font-weight: 600;
        }
        .description {
            margin: 0 0 20px 0;
            color: #4a5568;
            font-size: 1.1rem;
        }
        .image-container img {
            width: 100%;
            height: auto;
            border-radius: 6px;
            margin: 20px 0;
        }
        .content {
            margin: 20px 0;
        }
        .view-listing-btn {
            display: inline-block;
            background: #3182ce;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            margin-top: 20px;
        }
        .view-listing-btn:hover {
            background: #2c5aa0;
        }
    </style>
    
    <script>
        // Enhanced crawler detection with better platform recognition
        const userAgent = navigator.userAgent.toLowerCase();
        
        const crawlerPatterns = [
            'bot', 'crawler', 'spider', 'preview', 'teams', 'msteams', 'skype', 'outlook', 
            'office', 'facebookexternalhit', 'twitterbot', 'linkedinbot', 'microsoftpreview',
            'validator', 'fetcher', 'embed', 'parser', 'card', 'babylonia', 'linkedinsharevalidator'
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
            }, 1500); // Increased delay for better crawler support
        } else {
            console.log('Crawler detected, serving static preview page');
            // For crawlers, ensure the page is fully rendered and add meta refresh as fallback
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM fully loaded for crawler');
                // Add a meta refresh as an additional fallback for some crawlers
                const metaRefresh = document.createElement('meta');
                metaRefresh.setAttribute('http-equiv', 'refresh');
                metaRefresh.setAttribute('content', '30;url=${metaData.url}');
                document.head.appendChild(metaRefresh);
            });
        }
    </script>
</body>
</html>`;
};

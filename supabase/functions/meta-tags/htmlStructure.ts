
import type { MetaData } from './types.ts';

export const generateHtmlStructure = (
  metaData: MetaData, 
  metaTagsHtml: string, 
  structuredDataScript: string,
  longDescription: string
): string => {
  return `<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns# article: http://ogp.me/ns/article#">
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
    <meta name="referrer" content="origin-when-cross-origin">
    <meta name="format-detection" content="telephone=no">
    <meta name="mobile-web-app-capable" content="yes">
    
    ${structuredDataScript}
</head>
<body>
    <!-- Content optimized for social media crawlers -->
    <main role="main" itemscope itemtype="https://schema.org/Article">
        <article class="listing-preview" itemscope itemtype="https://schema.org/TechArticle">
            <header>
                <h1 itemprop="headline name">${metaData.title}</h1>
                <div class="meta-info">
                    <time itemprop="datePublished" datetime="${new Date().toISOString()}">${new Date().toLocaleDateString()}</time>
                    <span itemprop="author" itemscope itemtype="https://schema.org/Organization">
                        <span itemprop="name">SBIR Tech Marketplace</span>
                    </span>
                </div>
            </header>
            
            <div class="image-container" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
                <img src="${metaData.image}" alt="${metaData.title}" width="1200" height="630" loading="eager" itemprop="url">
                <meta itemprop="width" content="1200">
                <meta itemprop="height" content="630">
            </div>
            
            <div class="content">
                <p itemprop="description">${longDescription}</p>
                <p><strong>View this technology listing on the SBIR Tech Marketplace for complete details, contact information, and partnership opportunities.</strong></p>
            </div>
            
            <footer>
                <a href="${metaData.url}" rel="canonical" class="view-listing-btn" itemprop="url">View Full Listing →</a>
            </footer>
        </article>
    </main>
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
        }
        .listing-preview {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #e1e5e9;
        }
        h1 {
            margin: 0 0 15px 0;
            color: #1a202c;
            font-size: 2rem;
            font-weight: 700;
            line-height: 1.2;
        }
        .meta-info {
            margin: 0 0 20px 0;
            color: #6b7280;
            font-size: 0.9rem;
        }
        .image-container {
            margin: 20px 0;
            text-align: center;
        }
        .image-container img {
            width: 100%;
            max-width: 600px;
            height: auto;
            border-radius: 6px;
            border: 1px solid #e1e5e9;
        }
        .content {
            margin: 20px 0;
            font-size: 1.1rem;
            line-height: 1.7;
        }
        .content p {
            margin: 0 0 15px 0;
        }
        .view-listing-btn {
            display: inline-block;
            background: #0066cc;
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 1.1rem;
            margin-top: 20px;
            transition: background-color 0.2s;
        }
        .view-listing-btn:hover {
            background: #0052a3;
        }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .listing-preview { padding: 20px; }
            h1 { font-size: 1.5rem; }
        }
    </style>
    
    <script>
        // Enhanced crawler detection for better platform support
        const userAgent = navigator.userAgent.toLowerCase();
        
        const crawlerPatterns = [
            'linkedinbot', 'linkedin', 'babylonia', 'linkedinsharevalidator',
            'msteams', 'teams', 'microsoftpreview', 'skype', 'outlook', 'office',
            'facebookexternalhit', 'twitterbot', 'slackbot', 'whatsapp',
            'discordbot', 'telegrambot', 'bot', 'crawler', 'spider', 'preview'
        ];
        
        const isCrawlerClient = crawlerPatterns.some(pattern => userAgent.includes(pattern));
        
        // Detailed logging for debugging
        console.log('=== SOCIAL PREVIEW DEBUG ===');
        console.log('User Agent:', navigator.userAgent);
        console.log('Is Crawler:', isCrawlerClient);
        console.log('Page Title:', document.title);
        console.log('Canonical URL:', document.querySelector('link[rel="canonical"]')?.href);
        
        // Log all meta tags for debugging
        const metaTags = document.querySelectorAll('meta');
        metaTags.forEach(tag => {
            const name = tag.getAttribute('name') || tag.getAttribute('property');
            const content = tag.getAttribute('content');
            if (name && content) {
                console.log(\`Meta \${name}:\`, content);
            }
        });
        
        // For human users, redirect after ensuring crawlers have enough time
        if (!isCrawlerClient) {
            console.log('Human user detected, will redirect to:', '${metaData.url}');
            // Give more time for any potential crawler that might not be detected
            setTimeout(() => {
                console.log('Redirecting now...');
                window.location.replace('${metaData.url}');
            }, 2000);
        } else {
            console.log('Crawler detected, serving static content');
            // Ensure the page stays loaded for crawlers
            document.addEventListener('DOMContentLoaded', () => {
                console.log('Page fully loaded for crawler');
            });
        }
    </script>
</body>
</html>`;
};

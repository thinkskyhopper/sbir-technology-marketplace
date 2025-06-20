
import type { MetaData } from './types.ts';

export const generateMetaTags = (metaData: MetaData, shortDescription: string, longDescription: string, appDomain: string): string => {
  return `<!-- Primary Meta Tags -->
    <title>${metaData.title}</title>
    <meta name="title" content="${metaData.title}">
    <meta name="description" content="${shortDescription}">
    <meta name="author" content="SBIR Tech Marketplace">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <!-- Essential Open Graph Tags (LinkedIn Priority) -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="SBIR Tech Marketplace">
    <meta property="og:title" content="${metaData.title}">
    <meta property="og:description" content="${longDescription}">
    <meta property="og:url" content="${metaData.url}">
    <meta property="og:image" content="${metaData.image}">
    <meta property="og:image:secure_url" content="${metaData.image}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${metaData.title}">
    <meta property="og:locale" content="en_US">
    
    <!-- LinkedIn Specific -->
    <meta property="article:author" content="SBIR Tech Marketplace">
    <meta property="article:publisher" content="${appDomain}">
    <meta property="article:published_time" content="${new Date().toISOString()}">
    <meta property="article:modified_time" content="${new Date().toISOString()}">
    <meta property="article:section" content="Technology">
    <meta property="article:tag" content="SBIR">
    <meta property="article:tag" content="Technology Transfer">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@sbirtech">
    <meta name="twitter:title" content="${metaData.title}">
    <meta name="twitter:description" content="${shortDescription}">
    <meta name="twitter:image" content="${metaData.image}">
    <meta name="twitter:image:alt" content="${metaData.title}">
    
    <!-- Microsoft Teams / Office Integration -->
    <meta name="ms.teams.image" content="${metaData.image}">
    <meta name="ms.teams.title" content="${metaData.title}">
    <meta name="ms.teams.description" content="${longDescription}">
    <meta name="msteams:title" content="${metaData.title}">
    <meta name="msteams:description" content="${longDescription}">
    <meta name="msteams:image" content="${metaData.image}">
    <meta name="office:title" content="${metaData.title}">
    <meta name="office:description" content="${longDescription}">
    <meta name="office:image" content="${metaData.image}">
    
    <!-- Additional Compatibility -->
    <meta name="msapplication-TileImage" content="${metaData.image}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    <meta name="application-name" content="SBIR Tech Marketplace">`;
};

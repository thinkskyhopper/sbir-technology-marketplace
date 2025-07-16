
// Utility to get CSS variable values and convert HSL to hex
const getHSLValue = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  const hslValue = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return hslValue;
};

const hslToHex = (hsl: string): string => {
  if (!hsl) return '#000000';
  
  // Parse HSL values (e.g., "220 20% 14%")
  const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) return '#000000';
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export interface ColorSwatch {
  name: string;
  cssVariable: string;
  usage: string;
  category: string;
  getHex: () => string;
}

export const colorSwatches: ColorSwatch[] = [
  // Base Colors
  {
    name: 'Background',
    cssVariable: '--background',
    usage: 'Main page background, body background',
    category: 'Base Colors',
    getHex: () => hslToHex(getHSLValue('--background'))
  },
  {
    name: 'Foreground', 
    cssVariable: '--foreground',
    usage: 'Primary text color, main content text',
    category: 'Base Colors',
    getHex: () => hslToHex(getHSLValue('--foreground'))
  },

  // Card Colors
  {
    name: 'Card Background',
    cssVariable: '--card',
    usage: 'Card backgrounds, containers, panels',
    category: 'Card Colors',
    getHex: () => hslToHex(getHSLValue('--card'))
  },
  {
    name: 'Card Foreground',
    cssVariable: '--card-foreground', 
    usage: 'Text inside cards and containers',
    category: 'Card Colors',
    getHex: () => hslToHex(getHSLValue('--card-foreground'))
  },

  // Interactive Colors
  {
    name: 'Primary',
    cssVariable: '--primary',
    usage: 'Primary buttons, links, active states, brand color',
    category: 'Interactive Colors',
    getHex: () => hslToHex(getHSLValue('--primary'))
  },
  {
    name: 'Primary Foreground',
    cssVariable: '--primary-foreground',
    usage: 'Text on primary colored backgrounds',
    category: 'Interactive Colors', 
    getHex: () => hslToHex(getHSLValue('--primary-foreground'))
  },
  {
    name: 'Secondary',
    cssVariable: '--secondary',
    usage: 'Secondary buttons, alternative actions',
    category: 'Interactive Colors',
    getHex: () => hslToHex(getHSLValue('--secondary'))
  },
  {
    name: 'Secondary Foreground',
    cssVariable: '--secondary-foreground',
    usage: 'Text on secondary colored backgrounds',
    category: 'Interactive Colors',
    getHex: () => hslToHex(getHSLValue('--secondary-foreground'))
  },

  // Muted Colors
  {
    name: 'Muted',
    cssVariable: '--muted',
    usage: 'Subtle backgrounds, disabled states, less prominent areas',
    category: 'Muted Colors',
    getHex: () => hslToHex(getHSLValue('--muted'))
  },
  {
    name: 'Muted Foreground',
    cssVariable: '--muted-foreground',
    usage: 'Secondary text, descriptions, metadata',
    category: 'Muted Colors',
    getHex: () => hslToHex(getHSLValue('--muted-foreground'))
  },

  // Accent Colors
  {
    name: 'Accent',
    cssVariable: '--accent',
    usage: 'Hover states, focus highlights, emphasis',
    category: 'Accent Colors',
    getHex: () => hslToHex(getHSLValue('--accent'))
  },
  {
    name: 'Accent Foreground',
    cssVariable: '--accent-foreground',
    usage: 'Text on accent colored backgrounds',
    category: 'Accent Colors',
    getHex: () => hslToHex(getHSLValue('--accent-foreground'))
  },

  // Status Colors
  {
    name: 'Destructive',
    cssVariable: '--destructive',
    usage: 'Error states, delete buttons, warnings',
    category: 'Status Colors',
    getHex: () => hslToHex(getHSLValue('--destructive'))
  },
  {
    name: 'Destructive Foreground',
    cssVariable: '--destructive-foreground',
    usage: 'Text on destructive colored backgrounds',
    category: 'Status Colors',
    getHex: () => hslToHex(getHSLValue('--destructive-foreground'))
  },

  // Form Colors
  {
    name: 'Border',
    cssVariable: '--border',
    usage: 'Element borders, dividers, separators',
    category: 'Form Colors',
    getHex: () => hslToHex(getHSLValue('--border'))
  },
  {
    name: 'Input',
    cssVariable: '--input',
    usage: 'Form input backgrounds and borders',
    category: 'Form Colors',
    getHex: () => hslToHex(getHSLValue('--input'))
  },
  {
    name: 'Ring',
    cssVariable: '--ring',
    usage: 'Focus rings, outline indicators',
    category: 'Form Colors',
    getHex: () => hslToHex(getHSLValue('--ring'))
  },

  // Popover Colors
  {
    name: 'Popover Background',
    cssVariable: '--popover',
    usage: 'Dropdown backgrounds, tooltip backgrounds',
    category: 'Popover Colors',
    getHex: () => hslToHex(getHSLValue('--popover'))
  },
  {
    name: 'Popover Foreground',
    cssVariable: '--popover-foreground',
    usage: 'Text inside popovers and tooltips',
    category: 'Popover Colors',
    getHex: () => hslToHex(getHSLValue('--popover-foreground'))
  }
];

// Component-specific colors that aren't CSS variables
export const componentColors = [
  {
    name: 'Phase Badge',
    hex: '#2563eb',
    usage: 'Phase badges in listings (bg-blue-600)',
    category: 'Badge Colors'
  },
  {
    name: 'Phase Badge Hover',
    hex: '#1d4ed8', 
    usage: 'Phase badge hover state (hover:bg-blue-700)',
    category: 'Badge Colors'
  },
  {
    name: 'Sold Badge',
    hex: '#f59e0b',
    usage: 'Sold status badges (bg-amber-500)',
    category: 'Badge Colors'
  },
  {
    name: 'Sold Badge Hover',
    hex: '#d97706',
    usage: 'Sold badge hover state (hover:bg-amber-600)',
    category: 'Badge Colors'
  },
  {
    name: 'Bookmark Active',
    hex: '#dbeafe',
    usage: 'Active bookmark button background (bg-blue-50)',
    category: 'Interactive Colors'
  },
  {
    name: 'Bookmark Active Text',
    hex: '#2563eb',
    usage: 'Active bookmark button text (text-blue-600)',
    category: 'Interactive Colors'
  },
  {
    name: 'Bookmark Active Border',
    hex: '#bfdbfe',
    usage: 'Active bookmark button border (border-blue-200)',
    category: 'Interactive Colors'
  },
  {
    name: 'Text Gradient Start',
    hex: '#5b9bd5',
    usage: 'Text gradient start color - used in "Expert Guidance", "expert team" etc (hsl(var(--primary)))',
    category: 'Text Gradient'
  },
  {
    name: 'Text Gradient End',
    hex: '#87ceeb',
    usage: 'Text gradient end color - lighter blue for gradient text (hsl(217 91% 80%))',
    category: 'Text Gradient'
  },
  {
    name: 'Hero Gradient Start',
    hex: '#1e293b',
    usage: 'Hero section gradient start color (hsl(220 20% 16%))',
    category: 'Hero Gradient'
  },
  {
    name: 'Hero Gradient Middle',
    hex: '#334155',
    usage: 'Hero section gradient middle color (hsl(220 20% 22%))',
    category: 'Hero Gradient'
  },
  {
    name: 'Hero Gradient End',
    hex: '#262e3d',
    usage: 'Hero section gradient end color (hsl(220 20% 18%))',
    category: 'Hero Gradient'
  }
];

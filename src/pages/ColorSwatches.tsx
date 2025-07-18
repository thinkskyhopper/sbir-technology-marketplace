import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { colorSwatches, componentColors, type ColorSwatch } from '@/utils/colorSwatches';
import EmbedCodeSection from '@/components/EmbedCodeSection';

const ColorSwatchCard = ({ swatch }: { swatch: ColorSwatch }) => {
  const [hex, setHex] = useState('#000000');

  useEffect(() => {
    // Update hex value when component mounts or theme changes
    const updateHex = () => {
      setHex(swatch.getHex());
    };
    
    updateHex();
    
    // Listen for theme changes or CSS updates
    const observer = new MutationObserver(updateHex);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    return () => observer.disconnect();
  }, [swatch]);

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{swatch.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {hex.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="w-full h-16 rounded-md border mb-3"
          style={{ backgroundColor: hex }}
        />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            CSS Variable: <code className="bg-muted px-1 rounded">{swatch.cssVariable}</code>
          </p>
          <p className="text-xs text-muted-foreground">
            {swatch.usage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ComponentColorCard = ({ color }: { color: typeof componentColors[0] }) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{color.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {color.hex.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="w-full h-16 rounded-md border mb-3"
          style={{ backgroundColor: color.hex }}
        />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {color.usage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ColorSwatches = () => {
  // Group swatches by category
  const groupedSwatches = colorSwatches.reduce((acc, swatch) => {
    if (!acc[swatch.category]) {
      acc[swatch.category] = [];
    }
    acc[swatch.category].push(swatch);
    return acc;
  }, {} as Record<string, ColorSwatch[]>);

  // Group component colors by category
  const groupedComponentColors = componentColors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, typeof componentColors>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Color System Reference
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete reference of all colors used throughout the application, including CSS variables and component-specific colors.
            </p>
          </div>

          {/* CSS Variable Colors */}
          <div className="space-y-8">
            {Object.entries(groupedSwatches).map(([category, swatches]) => (
              <section key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {swatches.map((swatch) => (
                    <ColorSwatchCard key={swatch.cssVariable} swatch={swatch} />
                  ))}
                </div>
              </section>
            ))}

            {/* Component-Specific Colors */}
            {Object.entries(groupedComponentColors).map(([category, colors]) => (
              <section key={`component-${category}`} className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                  {category} (Component Specific)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {colors.map((color) => (
                    <ComponentColorCard key={color.name} color={color} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Usage Guidelines */}
          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
              Usage Guidelines
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">CSS Variables</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use <code className="bg-muted px-1 rounded">hsl(var(--variable-name))</code> in CSS</li>
                      <li>• Use semantic Tailwind classes when available</li>
                      <li>• Variables automatically adapt to theme changes</li>
                      <li>• Support high contrast and reduced motion preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Component Colors</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Fixed hex values for specific UI components</li>
                      <li>• Used in badges, status indicators, and special states</li>
                      <li>• Consider replacing with CSS variables for better theming</li>
                      <li>• Ensure sufficient contrast ratios for accessibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Technical Notes */}
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
              Technical Implementation
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong>Color System:</strong> Based on HSL values defined as CSS custom properties in <code className="bg-muted px-1 rounded">src/index.css</code>
                  </p>
                  <p>
                    <strong>Accessibility:</strong> Includes high contrast mode support and maintains WCAG 2.1 AA compliance
                  </p>
                  <p>
                    <strong>Theming:</strong> Colors automatically adapt based on user preferences and system settings
                  </p>
                  <p>
                    <strong>Updates:</strong> This page dynamically reflects any changes made to the color system
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Embed Widget Section */}
          <div className="mt-12">
            <EmbedCodeSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSwatches;

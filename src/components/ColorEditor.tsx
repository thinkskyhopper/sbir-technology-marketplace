import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Palette, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ColorEditorProps {
  name: string;
  cssVariable: string;
  currentHex: string;
  usage: string;
  onColorChange: (variable: string, hslValue: string) => void;
}

const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const ColorEditor = ({ name, cssVariable, currentHex, usage, onColorChange }: ColorEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hsl, setHsl] = useState<[number, number, number]>([0, 0, 0]);
  const [originalHsl, setOriginalHsl] = useState<[number, number, number]>([0, 0, 0]);
  const [hexInput, setHexInput] = useState(currentHex);

  useEffect(() => {
    const hslValues = hexToHsl(currentHex);
    setHsl(hslValues);
    setOriginalHsl(hslValues);
    setHexInput(currentHex);
  }, [currentHex]);

  const handleHslChange = (index: number, value: number[]) => {
    const newHsl = [...hsl] as [number, number, number];
    newHsl[index] = value[0];
    setHsl(newHsl);
    
    const newHex = hslToHex(...newHsl);
    setHexInput(newHex);
    
    // Apply change immediately for live preview
    const hslString = `${newHsl[0]} ${newHsl[1]}% ${newHsl[2]}%`;
    onColorChange(cssVariable, hslString);
  };

  const handleHexInputChange = (hex: string) => {
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const hslValues = hexToHsl(hex);
      setHsl(hslValues);
      const hslString = `${hslValues[0]} ${hslValues[1]}% ${hslValues[2]}%`;
      onColorChange(cssVariable, hslString);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setOriginalHsl(hsl);
    toast.success(`Saved changes to ${name}`);
  };

  const handleReset = () => {
    setHsl(originalHsl);
    const newHex = hslToHex(...originalHsl);
    setHexInput(newHex);
    const hslString = `${originalHsl[0]} ${originalHsl[1]}% ${originalHsl[2]}%`;
    onColorChange(cssVariable, hslString);
    setIsEditing(false);
  };

  const currentDisplayHex = hslToHex(...hsl);

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {currentDisplayHex.toUpperCase()}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Palette className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="w-full h-16 rounded-md border mb-3 transition-colors duration-200"
          style={{ backgroundColor: currentDisplayHex }}
        />
        
        {isEditing && (
          <div className="space-y-4 mb-4 p-3 bg-muted/50 rounded-md">
            <div className="space-y-2">
              <label className="text-xs font-medium">Hex Value</label>
              <Input
                value={hexInput}
                onChange={(e) => handleHexInputChange(e.target.value)}
                placeholder="#000000"
                className="h-8 text-xs"
              />
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium">Hue: {hsl[0]}°</label>
                <Slider
                  value={[hsl[0]]}
                  max={360}
                  step={1}
                  onValueChange={(value) => handleHslChange(0, value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Saturation: {hsl[1]}%</label>
                <Slider
                  value={[hsl[1]]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleHslChange(1, value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Lightness: {hsl[2]}%</label>
                <Slider
                  value={[hsl[2]]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleHslChange(2, value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            CSS Variable: <code className="bg-muted px-1 rounded">{cssVariable}</code>
          </p>
          <p className="text-xs text-muted-foreground">
            HSL: {hsl[0]} {hsl[1]}% {hsl[2]}%
          </p>
          <p className="text-xs text-muted-foreground">
            {usage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
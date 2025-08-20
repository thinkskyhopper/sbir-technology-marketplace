
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

const EmbedCodeSection = () => {
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="https://sbir-technology-marketplace.lovable.app/embed.html" width="100%" frameborder="0" scrolling="auto" style="border: 1px solid #ddd; border-radius: 8px; max-width: 600px;"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
        Embed Widget
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Website Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use this embed code to display a compact preview of the SBIR Tech Marketplace on your website. 
            The widget includes the latest opportunities and maintains the same styling as the main site.
          </p>
          
          <div className="space-y-2">
            <label htmlFor="embed-code" className="text-sm font-medium text-foreground">
              Embed Code:
            </label>
            <div className="relative">
              <textarea
                id="embed-code"
                value={embedCode}
                readOnly
                className="w-full p-3 text-sm bg-muted border border-border rounded-md font-mono resize-none h-24"
                aria-label="Embed code for SBIR Tech Marketplace widget"
              />
              <Button
                onClick={handleCopy}
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                aria-label={copied ? "Code copied" : "Copy embed code"}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-2">Widget Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Displays SBIR Tech Marketplace branding</li>
              <li>• Shows 3 newest marketplace opportunities</li>
              <li>• Mobile-responsive design</li>
              <li>• ADA compliant with proper accessibility features</li>
              <li>• Links open in the same tab for seamless integration</li>
              <li>• Dynamic height based on content (600px max width)</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-2 text-blue-800">Integration Notes:</h4>
            <p className="text-sm text-blue-700">
              The widget is self-contained and will automatically fetch the latest opportunities. 
              You can adjust the width attribute as needed for your layout. Height will automatically adjust based on content.
              The widget should now load correctly from the updated URL.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default EmbedCodeSection;

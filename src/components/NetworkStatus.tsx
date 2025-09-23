import { useState, useEffect } from 'react';
import { AlertTriangle, Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { networkDiagnostics, type NetworkDiagnostics } from '@/utils/networkDiagnostics';
import { cn } from '@/lib/utils';

interface NetworkStatusProps {
  onRetry?: () => void;
  error?: any;
  showFullDiagnostics?: boolean;
  className?: string;
}

export const NetworkStatus = ({ 
  onRetry, 
  error, 
  showFullDiagnostics = false,
  className 
}: NetworkStatusProps) => {
  const [diagnostics, setDiagnostics] = useState<NetworkDiagnostics | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null);

  useEffect(() => {
    // Run quick connectivity test on mount
    const quickTest = async () => {
      const isConnected = await networkDiagnostics.quickConnectivityTest();
      setConnectionOk(isConnected);
    };
    quickTest();
  }, []);

  const runFullDiagnostics = async () => {
    setIsRunningTest(true);
    try {
      const results = await networkDiagnostics.runDiagnostics();
      setDiagnostics(results);
      setConnectionOk(results.canReachSupabase);
    } catch (err) {
      console.error('Failed to run diagnostics:', err);
    } finally {
      setIsRunningTest(false);
    }
  };

  const getStatusIcon = () => {
    if (connectionOk === null) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (connectionOk) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusText = () => {
    if (connectionOk === null) return 'Checking connection...';
    if (connectionOk) return 'Connected';
    return 'Connection issues detected';
  };

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'poor': return 'bg-yellow-100 text-yellow-800';
      case 'very-poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isNetworkError = error?.isNetworkError || error?.isVpnRelated;
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Connection Status Bar */}
      <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
          {diagnostics?.connectionQuality && (
            <Badge className={getQualityColor(diagnostics.connectionQuality)}>
              {diagnostics.connectionQuality}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isRunningTest && (
            <Button
              variant="outline"
              size="sm"
              onClick={runFullDiagnostics}
              disabled={isRunningTest}
            >
              <Wifi className="h-4 w-4 mr-1" />
              Test Connection
            </Button>
          )}
          
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRunningTest}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>

      {/* Network Error Alert */}
      {isNetworkError && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-medium">
              {error?.isVpnRelated ? 'VPN-Related Connection Issue' : 'Network Connection Problem'}
            </p>
            <p className="text-sm text-muted-foreground">
              {error?.isVpnRelated ? (
                'Your VPN may be interfering with the connection. Try the troubleshooting steps below.'
              ) : (
                'Unable to connect to the server. Please check your internet connection.'
              )}
            </p>
            
            {error?.isVpnRelated && (
              <div className="mt-3 p-3 bg-white rounded border-l-4 border-amber-400">
                <p className="text-sm font-medium mb-2">VPN Troubleshooting Steps:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Try disabling your VPN temporarily</li>
                  <li>Switch to a different VPN server/location</li>
                  <li>Use a different network (mobile hotspot)</li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Check your firewall settings</li>
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Full Diagnostics Results */}
      {(showFullDiagnostics || isNetworkError) && diagnostics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Connection Diagnostics
            </CardTitle>
            <CardDescription>
              Detailed analysis of your network connection
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Connection Quality</p>
                <Badge className={getQualityColor(diagnostics.connectionQuality)}>
                  {diagnostics.connectionQuality}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium">Latency</p>
                <p className="text-sm text-muted-foreground">
                  {diagnostics.latency.toFixed(0)}ms
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">VPN Detected</p>
                <p className="text-sm text-muted-foreground">
                  {diagnostics.isVpnDetected ? 'Yes' : 'No'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Recommended Timeout</p>
                <p className="text-sm text-muted-foreground">
                  {(diagnostics.recommendedTimeout / 1000).toFixed(0)}s
                </p>
              </div>
            </div>

            {diagnostics.errors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Issues Detected:</p>
                <div className="space-y-1">
                  {diagnostics.errors.map((error, index) => (
                    <Alert key={index} className="py-2">
                      <AlertDescription className="text-xs">
                        {error}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                If you continue to experience connection issues, try using a different network 
                or temporarily disabling your VPN. Contact support if problems persist.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isRunningTest && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Running network diagnostics...</span>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
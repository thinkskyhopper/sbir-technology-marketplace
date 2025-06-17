
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { runStartupVerification, monitorStartupPerformance } from "./utils/startupVerification";

// Start performance monitoring
const perfMonitor = monitorStartupPerformance();

// Run comprehensive startup verification in development
if (import.meta.env.DEV) {
  runStartupVerification().then(status => {
    if (!status.allChecksPass) {
      console.warn('⚠️ Startup verification detected issues. Check logs above for details.');
      
      // Provide specific guidance based on issues
      if (!status.dependenciesHealthy) {
        console.warn('💡 Dependency issues detected. This could cause publishing problems.');
      }
    } else {
      console.log('✅ All startup checks passed successfully');
    }
    
    // Log startup performance
    perfMonitor.getElapsedTime();
  }).catch(err => {
    console.error('❌ Startup verification failed:', err);
    console.warn('💡 This could indicate publishing compatibility issues.');
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

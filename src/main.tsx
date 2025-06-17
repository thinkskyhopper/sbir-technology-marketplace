
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { runFullSystemCheck } from "./utils/buildVerification";

// Run comprehensive system verification on startup
if (import.meta.env.DEV) {
  runFullSystemCheck().then(status => {
    if (!status.allChecksPass) {
      console.warn('⚠️ System verification detected issues. Check logs above for details.');
    }
  }).catch(err => {
    console.error('❌ System verification failed:', err);
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

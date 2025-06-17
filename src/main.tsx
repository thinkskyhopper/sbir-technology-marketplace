
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { verifyBuildHealth } from "./utils/buildVerification";

// Verify build health on startup
if (import.meta.env.DEV) {
  verifyBuildHealth();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

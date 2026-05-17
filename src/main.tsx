import { inject } from '@vercel/analytics';
inject();

import { createRoot } from "react-dom/client";
import React from "react";
import App from "./app/App.tsx";

// Error Boundary for catching React errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("React Error Boundary caught:", error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F9FBE7",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "20px",
          boxSizing: "border-box"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            textAlign: "center"
          }}>
            <h1 style={{ color: "#d32f2f", marginBottom: "16px" }}>Algo salió mal</h1>
            <p style={{ color: "#666", marginBottom: "12px" }}>
              La aplicación encontró un error y necesita reiniciar.
            </p>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1B5E20",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              Recargar aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Mount React app
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element #root in HTML");
}

console.log("Mounting React app...");
const root = createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log("React app mounted successfully");
} catch (error) {
  console.error("Failed to render app:", error);
  rootElement.innerHTML = `
    <div style="height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background-color: #F9FBE7; font-family: system-ui, -apple-system, sans-serif;">
      <div style="padding: 20px; text-align: center;">
        <h1 style="color: #d32f2f;">Error de inicio</h1>
        <p style="color: #666;">No se pudo iniciar la aplicación. Por favor, recarga la página.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 6px; overflow: auto; font-size: 12px; color: #333;">
${error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    </div>
  `;
}

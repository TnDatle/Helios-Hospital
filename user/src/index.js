import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// Global styles
import "./styles/index.css";
import "./styles/toastcontext.css";
// AUTH PROVIDER
import { AuthProvider } from "./auth/AuthContext";
import { ToastProvider } from "./components/ToastContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
      <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);

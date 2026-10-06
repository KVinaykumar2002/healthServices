import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SiteSettingsProvider } from "./lib/siteSettings";
import "./index.css";

const AdminApp = lazy(() => import("./admin/AdminApp"));
const isAdminRoute = /^\/admin(\/|$)/.test(window.location.pathname);

createRoot(document.getElementById("root")!).render(
  isAdminRoute ? (
    <Suspense fallback={null}>
      <AdminApp />
    </Suspense>
  ) : (
    <SiteSettingsProvider>
      <App />
    </SiteSettingsProvider>
  ),
);

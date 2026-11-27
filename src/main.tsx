import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "./AppProviders";
import { preloadQrEngine } from "./lib/qrEngine";
import { BASENAME, normalizePath, toAppPath } from "./routes/paths";
import { routes } from "./routes/routes";
import "./styles/base.css";

// Most pages draw a QR code; start fetching the engine chunk right away.
preloadQrEngine();

const router = createBrowserRouter(routes, { basename: BASENAME });
const container = document.getElementById("root")!;
const app = (
    <AppProviders>
        <RouterProvider router={router} />
    </AppProviders>
);

/*
 * Each route is prerendered at build time and marks the path it was rendered
 * for. Hydrate when that matches the URL. Otherwise (dist/404.html served for
 * an unknown path, or the dev server) render from scratch, which avoids a
 * hydration mismatch.
 */
const prerenderedPath = container.dataset.prerendered;
if (prerenderedPath !== undefined && normalizePath(prerenderedPath) === toAppPath(window.location.pathname)) {
    hydrateRoot(container, app);
} else {
    container.textContent = "";
    createRoot(container).render(app);
}

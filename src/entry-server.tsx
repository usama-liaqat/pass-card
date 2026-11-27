import { prerender } from "react-dom/static";
import { StaticRouterProvider, createStaticHandler, createStaticRouter } from "react-router";
import { AppProviders } from "./AppProviders";
import { BASENAME, NOT_FOUND_RENDER_PATH, PRERENDER_PATHS, getPageMeta } from "./routes/paths";
import type { PageMeta } from "./routes/paths";
import { routes } from "./routes/routes";

export { NOT_FOUND_RENDER_PATH, PRERENDER_PATHS };

export interface RenderResult {
    html: string;
    meta: PageMeta;
    /** True when the page rendered the error page instead of its content. */
    failed: boolean;
}

const { query, dataRoutes } = createStaticHandler(routes, { basename: BASENAME });

/** Renders one app path (without the base path) to HTML for a static file. */
export const render = async (appPath: string): Promise<RenderResult> => {
    const url = new URL(`${BASENAME === "/" ? "" : BASENAME}${appPath}`, "http://localhost");
    const context = await query(new Request(url));
    if (context instanceof Response)
        throw new Error(`Route ${appPath} returned a redirect, which can't be prerendered.`);

    const router = createStaticRouter(dataRoutes, context);
    // prerender waits for Suspense (e.g. the lazily loaded QR engine) before resolving.
    const { prelude } = await prerender(
        <AppProviders>
            {/* No loaders, so there is no data to embed for hydration. */}
            <StaticRouterProvider router={router} context={context} hydrate={false} />
        </AppProviders>
    );
    const html = await new Response(prelude).text();

    return { html, meta: getPageMeta(appPath), failed: html.includes("data-error-page") };
};

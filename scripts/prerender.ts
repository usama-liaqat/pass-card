/*
 * Writes one static HTML file per route after `vite build`, so deep links work
 * on GitHub Pages and Cloudflare Pages without a server:
 *
 *   dist/index.html, dist/bank-card/index.html, …, dist/404.html
 *
 * It renders each route with the server bundle from
 * `vite build --ssr src/entry-server.tsx --outDir dist-ssr`, then deletes that
 * bundle so it is never deployed.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

interface RenderResult {
    html: string;
    meta: { title: string; description: string };
    failed: boolean;
}

interface ServerEntry {
    render: (appPath: string) => Promise<RenderResult>;
    PRERENDER_PATHS: Array<string>;
    NOT_FOUND_RENDER_PATH: string;
}

const root = resolve(import.meta.dirname, "..");
const distDir = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const escapeHtml = (value: string): string =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fillTemplate = (template: string, result: RenderResult, renderedPath: string): string => {
    const head = `<meta name="description" content="${escapeHtml(result.meta.description)}" />`;
    const filled = template
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(result.meta.title)}</title>`)
        .replace("<!--app-head-->", head)
        .replace(
            '<div id="root"><!--app-html--></div>',
            `<div id="root" data-prerendered="${escapeHtml(renderedPath)}">${result.html}</div>`
        );
    if (filled === template || !filled.includes("data-prerendered")) {
        throw new Error("index.html is missing the <!--app-head--> or <!--app-html--> placeholder.");
    }
    return filled;
};

const outputFileFor = (appPath: string): string =>
    appPath === "/" ? join(distDir, "index.html") : join(distDir, appPath.replace(/^\//, ""), "index.html");

const main = async () => {
    const template = await readFile(join(distDir, "index.html"), "utf8");
    const entry = (await import(pathToFileURL(join(ssrDir, "entry-server.js")).href)) as ServerEntry;

    const pages: Array<{ appPath: string; file: string; renderedPath: string }> = [
        ...entry.PRERENDER_PATHS.map(appPath => ({ appPath, file: outputFileFor(appPath), renderedPath: appPath })),
        // Served by both hosts for unknown paths. The client sees the path doesn't
        // match and renders the 404 page for the real URL instead of hydrating.
        {
            appPath: entry.NOT_FOUND_RENDER_PATH,
            file: join(distDir, "404.html"),
            renderedPath: entry.NOT_FOUND_RENDER_PATH
        }
    ];

    for (const page of pages) {
        const result = await entry.render(page.appPath);
        if (result.failed)
            throw new Error(`Prerendering ${page.appPath} showed the error page instead of the content.`);
        await mkdir(dirname(page.file), { recursive: true });
        await writeFile(page.file, fillTemplate(template, result, page.renderedPath));
        console.log(`prerendered ${page.appPath.padEnd(16)} → ${page.file.slice(root.length + 1)}`);
    }

    await rm(ssrDir, { recursive: true, force: true });
};

main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});

import { CARD_TYPES, FUTURE_CARD_TYPES } from "../cards/cardTypes";

export const PATHS = {
    home: "/",
    components: "/components"
} as const;

/**
 * Vite's BASE_URL is "/" locally and "/<repo>/" for a GitHub Pages project
 * site (set through BASE_PATH at build time). React Router wants it without
 * the trailing slash.
 */
export const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

/** Drops a trailing slash (GitHub Pages serves "/bank-card/"), keeping "/" as is. */
export const normalizePath = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, "") || "/" : path);

/** Strips the base path from a browser pathname: "/pass-card/wifi-card/" → "/wifi-card". */
export const toAppPath = (pathname: string): string => {
    const normalized = normalizePath(pathname);
    if (BASENAME === "/") return normalized;
    if (normalized === BASENAME) return "/";
    return normalized.startsWith(`${BASENAME}/`) ? normalized.slice(BASENAME.length) : normalized;
};

export interface PageMeta {
    title: string;
    description: string;
}

const SITE_DESCRIPTION =
    "Create bank account, business, Wi-Fi and social cards for Apple Wallet and Google Wallet. Free, open source and runs in your browser.";

export const NOT_FOUND_META: PageMeta = {
    title: "Page not found · Passcard",
    description: "This page doesn't exist. Pick a card to create instead."
};

/** Title and description per route, used by the prerender script and the client. */
export const getPageMeta = (appPath: string): PageMeta => {
    const path = normalizePath(appPath);
    if (path === PATHS.home) return { title: "Passcard · Create your wallet card", description: SITE_DESCRIPTION };
    if (path === PATHS.components) return { title: "Components · Passcard", description: "Passcard's design system." };
    const type = [...CARD_TYPES, ...FUTURE_CARD_TYPES].find(item => item.route === path);
    if (type?.comingSoon) {
        return {
            title: `${type.title} — coming soon · Passcard`,
            description: `${type.description} Coming soon to Passcard, the free wallet card maker that runs in your browser.`
        };
    }
    if (type) return { title: `${type.title} · Passcard`, description: type.description };
    return NOT_FOUND_META;
};

/** Every route that gets its own prerendered index.html. */
export const PRERENDER_PATHS: Array<string> = [
    PATHS.home,
    ...CARD_TYPES.map(type => type.route),
    ...FUTURE_CARD_TYPES.map(type => type.route),
    PATHS.components
];

/** Any path that matches no route; rendered once as dist/404.html. */
export const NOT_FOUND_RENDER_PATH = "/404";

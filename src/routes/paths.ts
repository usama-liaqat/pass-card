export const PATHS = {
    home: "/",
    about: "/about"
} as const;

export interface NavItem {
    to: string;
    label: string;
    /** Only match this exact path (needed for "/" so it isn't active on every page). */
    end?: boolean;
}

export const NAV_ITEMS: Array<NavItem> = [
    { to: PATHS.home, label: "Home", end: true },
    { to: PATHS.about, label: "About" }
];

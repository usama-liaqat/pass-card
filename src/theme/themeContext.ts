import { createContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
    /** The theme currently applied to the page. */
    theme: Theme;
    /** True once the user has picked a theme instead of following the OS. */
    isOverridden: boolean;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** The theme of the nearest ThemeScope, so portaled content can match it. */
export const ThemeScopeContext = createContext<Theme | null>(null);

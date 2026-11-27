import { memo, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { darkSchemeStore } from "./mediaQueries";
import { ThemeContext } from "./themeContext";
import type { Theme, ThemeContextValue } from "./themeContext";

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Starts from prefers-color-scheme and follows it until the user toggles.
 * The choice lives in memory only: nothing is written to storage, so a
 * reload goes back to the OS preference.
 */
export const ThemeProvider = memo<ThemeProviderProps>(({ children }) => {
    const prefersDark = useSyncExternalStore(
        darkSchemeStore.subscribe,
        darkSchemeStore.getSnapshot,
        darkSchemeStore.getServerSnapshot
    );
    const [override, setOverride] = useState<Theme | null>(null);

    const theme = useMemo<Theme>(() => override ?? (prefersDark ? "dark" : "light"), [override, prefersDark]);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const setTheme = useCallback((next: Theme) => setOverride(next), []);
    const toggleTheme = useCallback(() => setOverride(theme === "dark" ? "light" : "dark"), [theme]);

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, isOverridden: override !== null, setTheme, toggleTheme }),
        [theme, override, setTheme, toggleTheme]
    );

    return <ThemeContext value={value}>{children}</ThemeContext>;
});

ThemeProvider.displayName = "ThemeProvider";

export default ThemeProvider;

import { use, useSyncExternalStore } from "react";
import { reducedMotionStore } from "./mediaQueries";
import { ThemeContext, ThemeScopeContext } from "./themeContext";
import type { Theme, ThemeContextValue } from "./themeContext";

export const useTheme = (): ThemeContextValue => {
    const value = use(ThemeContext);
    if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
    return value;
};

/** The theme that applies where this component renders (a ThemeScope wins over the page theme). */
export const useEffectiveTheme = (): Theme => {
    const scoped = use(ThemeScopeContext);
    const page = use(ThemeContext);
    return scoped ?? page?.theme ?? "light";
};

export const useReducedMotion = (): boolean =>
    useSyncExternalStore(
        reducedMotionStore.subscribe,
        reducedMotionStore.getSnapshot,
        reducedMotionStore.getServerSnapshot
    );

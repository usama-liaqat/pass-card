import { memo } from "react";
import type { ReactNode } from "react";
import { ThemeScopeContext } from "./themeContext";
import type { Theme } from "./themeContext";

interface ThemeScopeProps {
    theme: Theme;
    className?: string;
    children: ReactNode;
}

/** Forces a theme on a subtree, e.g. the light and dark panes of the showcase. */
export const ThemeScope = memo<ThemeScopeProps>(({ theme, className, children }) => {
    return (
        <ThemeScopeContext value={theme}>
            <div data-theme={theme} className={className}>
                {children}
            </div>
        </ThemeScopeContext>
    );
});

ThemeScope.displayName = "ThemeScope";

export default ThemeScope;

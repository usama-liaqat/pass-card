import { StrictMode, memo } from "react";
import type { ReactNode } from "react";
import { ToastProvider } from "./app/ToastProvider";
import { ThemeProvider } from "./theme";

interface AppProvidersProps {
    children: ReactNode;
}

/** Providers shared by the browser entry and the prerenderer. */
export const AppProviders = memo<AppProvidersProps>(({ children }) => {
    return (
        <StrictMode>
            <ThemeProvider>
                <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
        </StrictMode>
    );
});

AppProviders.displayName = "AppProviders";

export default AppProviders;

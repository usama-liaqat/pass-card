import { memo, useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { getPageMeta } from "../../../routes/paths";
import { Header } from "../Header/Header";
import "./AppShell.css";

/** Header and page outlet shared by every route. */
export const AppShell = memo(() => {
    const { pathname } = useLocation();
    const firstPathRef = useRef(pathname);

    // Prerendered files already carry the right <title>; keep it in sync on client navigation.
    // From the first route change on, pages fade in (see .page-enter in base.css).
    useEffect(() => {
        document.title = getPageMeta(pathname).title;
        if (pathname !== firstPathRef.current) document.documentElement.dataset.navigated = "";
    }, [pathname]);

    return (
        <div className="app-shell">
            <a href="#main" className="app-shell__skip">
                Skip to content
            </a>
            <Header />
            <main id="main" className="app-shell__main" tabIndex={-1}>
                <Outlet />
            </main>
            <ScrollRestoration />
        </div>
    );
});

AppShell.displayName = "AppShell";

export default AppShell;

import { Fragment, memo } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { SiteNav } from "../components/SiteNav";

export const RootLayout = memo(() => {
    return (
        <Fragment>
            <SiteNav />
            <main>
                <Outlet />
            </main>
            <ScrollRestoration />
        </Fragment>
    );
});

RootLayout.displayName = "RootLayout";

export default RootLayout;

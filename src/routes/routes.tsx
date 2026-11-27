import type { ComponentType } from "react";
import type { RouteObject } from "react-router";
import { AppShell } from "../components/app/AppShell/AppShell";
import { CARD_TYPES } from "../cards/cardTypes";
import type { CardTypeId } from "../cards/cardTypes";
import { BankCardPage } from "../pages/BankCardPage/BankCardPage";
import { CardPlaceholderPage } from "../pages/CardPlaceholderPage/CardPlaceholderPage";
import { ComponentsPage } from "../pages/ComponentsPage/ComponentsPage";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { PATHS } from "./paths";

/** Card types with a finished page; the rest still use the placeholder page. */
const CARD_PAGES: Partial<Record<CardTypeId, ComponentType>> = {
    bank: BankCardPage
};

const cardElement = (id: CardTypeId) => {
    const Page = CARD_PAGES[id];
    return Page ? <Page /> : <CardPlaceholderPage typeId={id} />;
};

/**
 * Route definitions shared by the browser router (main.tsx) and the
 * prerenderer (entry-server.tsx). Creating a router here would break the
 * server build, so this module only describes routes.
 */
export const routes: Array<RouteObject> = [
    {
        path: PATHS.home,
        element: <AppShell />,
        // Last resort if the shell itself fails: the error page without a header.
        errorElement: <ErrorPage />,
        children: [
            {
                // Pathless layout route: errors in a page render the error page inside the shell.
                errorElement: <ErrorPage />,
                children: [
                    { index: true, element: <HomePage /> },
                    ...CARD_TYPES.map<RouteObject>(type => ({
                        path: type.route,
                        element: cardElement(type.id)
                    })),
                    { path: PATHS.components, element: <ComponentsPage /> },
                    { path: "*", element: <NotFoundPage /> }
                ]
            }
        ]
    }
];

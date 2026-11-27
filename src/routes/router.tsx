import { createBrowserRouter } from "react-router";
import { RootLayout } from "../layouts/RootLayout";
import { AboutPage } from "../pages/AboutPage";
import { ComponentsPage } from "../pages/ComponentsPage/ComponentsPage";
import { HomePage } from "../pages/HomePage";
import { PATHS } from "./paths";

// Vite's BASE_URL is "/" locally and "/pass-card/" on GitHub Pages.
// React Router expects the basename without a trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter(
    [
        {
            path: PATHS.home,
            element: <RootLayout />,
            children: [
                { index: true, element: <HomePage /> },
                { path: PATHS.about, element: <AboutPage /> },
                { path: PATHS.components, element: <ComponentsPage /> }
            ]
        }
    ],
    { basename }
);

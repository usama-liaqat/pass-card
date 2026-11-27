import { memo, useMemo } from "react";
import { House } from "lucide-react";
import { useLocation } from "react-router";
import { StatusPage } from "../../components/app/StatusPage/StatusPage";
import type { StatusAction, StatusLink } from "../../components/app/StatusPage/StatusPage";
import { CARD_TYPES } from "../../cards/cardTypes";
import { useDraftFlags } from "../../cards/draftStore";
import { PATHS } from "../../routes/paths";

const HOME_ACTION: StatusAction = { label: "Go to homepage", icon: House, to: PATHS.home };

export const NotFoundPage = memo(() => {
    const { pathname } = useLocation();
    const drafts = useDraftFlags();

    const links = useMemo<Array<StatusLink>>(
        () =>
            CARD_TYPES.map(type => ({
                id: type.id,
                label: type.title,
                to: type.route,
                icon: type.icon,
                draft: drafts[type.id]
            })),
        [drafts]
    );

    return (
        <div className="wrap page-enter">
            <StatusPage
                tone="not-found"
                code="404 · Page not found"
                title="This card doesn’t exist"
                body="The page you’re looking for may have moved, or the link has a typo. Pick a card below or head back to the homepage."
                path={pathname}
                primary={HOME_ACTION}
                links={links}
                linksTitle="Or start one of these cards"
                note="Your drafts are safe — they stay in this tab while you navigate."
            />
        </div>
    );
});

NotFoundPage.displayName = "NotFoundPage";

export default NotFoundPage;

import { memo, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { StatusPage } from "../../components/app/StatusPage/StatusPage";
import type { StatusAction, StatusLink } from "../../components/app/StatusPage/StatusPage";
import { COMING_SOON_TYPES, LIVE_CARD_TYPES, inlineTitle } from "../../cards/cardTypes";
import type { CardTypeInfo } from "../../cards/cardTypes";
import { useDraftFlags } from "../../cards/draftStore";
import { PATHS } from "../../routes/paths";

const HOME_ACTION: StatusAction = { label: "Back to all cards", icon: ArrowLeft, to: PATHS.home };

interface ComingSoonPageProps {
    type: CardTypeInfo;
}

/** Shown at the URL of any card type that isn't ready yet. */
export const ComingSoonPage = memo<ComingSoonPageProps>(({ type }) => {
    const drafts = useDraftFlags();

    // "See <next>": the next coming-soon card after this one, wrapping around.
    const secondary = useMemo<StatusAction | undefined>(() => {
        const index = COMING_SOON_TYPES.findIndex(item => item.id === type.id);
        const next = COMING_SOON_TYPES[(index + 1) % COMING_SOON_TYPES.length];
        return next && next.id !== type.id ? { label: `See ${inlineTitle(next)}`, to: next.route } : undefined;
    }, [type.id]);

    const links = useMemo<Array<StatusLink>>(
        () =>
            LIVE_CARD_TYPES.map(live => ({
                id: live.id,
                label: live.title,
                to: live.route,
                icon: live.icon,
                draft: drafts[live.id]
            })),
        [drafts]
    );

    const title = useMemo(() => `${type.title}s are on the way`, [type.title]);
    const body = useMemo(
        () =>
            `${type.description} We’re still building this card type. In the meantime, you can create any of the cards below.`,
        [type.description]
    );

    return (
        <div className="wrap page-enter">
            <StatusPage
                tone="coming-soon"
                code="Coming soon"
                title={title}
                body={body}
                primary={HOME_ACTION}
                secondary={secondary}
                points={type.points}
                pointsTitle="What it will do"
                links={links}
                linksTitle="Available now"
                note="Like every Passcard card, it will run entirely in your browser."
            />
        </div>
    );
});

ComingSoonPage.displayName = "ComingSoonPage";

export default ComingSoonPage;

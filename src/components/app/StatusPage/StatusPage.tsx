import { Activity, memo, useMemo } from "react";
import type { ReactNode } from "react";
import { ChevronRight, Copy, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { classNames } from "../../../lib/classNames";
import { Button, Disclosure } from "../../ui";
import { LinkButton } from "../LinkButton/LinkButton";
import "./StatusPage.css";

export type StatusTone = "not-found" | "error";

/** An action is either an in-app link (`to`) or a button (`onClick`). */
export type StatusAction =
    | { label: string; icon?: LucideIcon; to: string; onClick?: never }
    | { label: string; icon?: LucideIcon; onClick: () => void; to?: never };

export interface StatusLink {
    id: string;
    label: string;
    to: string;
    icon: LucideIcon;
    draft: boolean;
}

export interface StatusPageProps {
    tone: StatusTone;
    /** Short badge text, e.g. "404 · Page not found". */
    code: string;
    title: string;
    body: string;
    /** The path that wasn't found, shown in a code chip. */
    path?: string;
    primary: StatusAction;
    secondary?: StatusAction;
    /** Technical details, shown in a collapsible section with a copy button. */
    details?: string;
    onCopyDetails?: () => void;
    links?: Array<StatusLink>;
    linksTitle?: string;
    note: string;
}

const NO_LINKS: Array<StatusLink> = [];

/** The 404 and error pages, from StatusPage.dc.html. */
export const StatusPage = memo<StatusPageProps>(
    ({
        tone,
        code,
        title,
        body,
        path,
        primary,
        secondary,
        details,
        onCopyDetails,
        links = NO_LINKS,
        linksTitle,
        note
    }) => {
        const rootClass = useMemo(() => classNames("status-page", `status-page--${tone}`), [tone]);
        const hasPath = Boolean(path);
        const hasDetails = Boolean(details);
        const hasLinks = links.length > 0;

        return (
            <div className={rootClass} data-error-page={tone === "error" ? "" : undefined}>
                <div className="status-page__inner">
                    <StatusIllustration tone={tone} />

                    <div className="status-page__text">
                        <span className="status-page__code">{code}</span>
                        <h1 className="status-page__title">{title}</h1>
                        <p className="status-page__body">{body}</p>
                        <Activity mode={hasPath ? "visible" : "hidden"}>
                            <code className="status-page__path">{path}</code>
                        </Activity>
                    </div>

                    <div className="status-page__actions">
                        <StatusActionView action={primary} variant="primary" />
                        <Activity mode={secondary ? "visible" : "hidden"}>
                            <StatusActionView action={secondary} variant="secondary" />
                        </Activity>
                    </div>

                    <Activity mode={hasDetails ? "visible" : "hidden"}>
                        <div className="status-page__details">
                            <Disclosure title="Technical details">
                                <pre className="status-page__pre">{details}</pre>
                                <div>
                                    <Button size="sm" icon={Copy} onClick={onCopyDetails}>
                                        Copy details for a bug report
                                    </Button>
                                </div>
                            </Disclosure>
                        </div>
                    </Activity>

                    <Activity mode={hasLinks ? "visible" : "hidden"}>
                        <div className="status-page__links">
                            <div className="status-page__links-title">{linksTitle}</div>
                            <div className="status-page__grid">
                                {links.map(link => (
                                    <StatusLinkCard key={link.id} link={link} />
                                ))}
                            </div>
                        </div>
                    </Activity>

                    <p className="status-page__note">
                        <Shield size={13} aria-hidden="true" />
                        {note}
                    </p>
                </div>
            </div>
        );
    }
);

StatusPage.displayName = "StatusPage";

interface StatusActionViewProps {
    action?: StatusAction;
    variant: "primary" | "secondary";
}

const StatusActionView = memo<StatusActionViewProps>(({ action, variant }) => {
    if (!action) return null;
    if (action.to !== undefined) {
        return (
            <LinkButton to={action.to} variant={variant} size="lg" icon={action.icon}>
                {action.label}
            </LinkButton>
        );
    }
    return (
        <Button variant={variant} size="lg" icon={action.icon} onClick={action.onClick}>
            {action.label}
        </Button>
    );
});

StatusActionView.displayName = "StatusActionView";

interface StatusLinkCardProps {
    link: StatusLink;
}

const StatusLinkCard = memo<StatusLinkCardProps>(({ link }) => {
    const Icon = link.icon;
    return (
        <Link to={link.to} className="status-link">
            <span className="status-link__tile" aria-hidden="true">
                <Icon size={17} />
            </span>
            <span className="status-link__text">
                <span className="status-link__label">
                    {link.label}
                    <Activity mode={link.draft ? "visible" : "hidden"}>
                        <span className="status-link__draft">Draft</span>
                    </Activity>
                </span>
                <span className="status-link__path">{link.to}</span>
            </span>
            <ChevronRight size={15} className="status-link__chevron" aria-hidden="true" />
        </Link>
    );
});

StatusLinkCard.displayName = "StatusLinkCard";

interface StatusIllustrationProps {
    tone: StatusTone;
}

/** Three stacked cards; the front one is dashed (404) or flagged (error). */
const StatusIllustration = memo<StatusIllustrationProps>(({ tone }) => {
    return (
        <div className="status-art" aria-hidden="true">
            <div className="status-art__card status-art__card--back" />
            <div className="status-art__card status-art__card--middle" />
            <div className="status-art__card status-art__card--front">
                <div className="status-art__row">
                    <span className="status-art__tile" />
                    <span className="status-art__bar status-art__bar--title" />
                </div>
                <div className="status-art__row status-art__row--bottom">
                    <div className="status-art__lines">
                        <span className="status-art__bar status-art__bar--short" />
                        <span className="status-art__bar status-art__bar--long" />
                    </div>
                    <span className="status-art__badge">
                        <StatusGlyph tone={tone} />
                    </span>
                </div>
            </div>
        </div>
    );
});

StatusIllustration.displayName = "StatusIllustration";

const GLYPHS: Record<StatusTone, ReactNode> = {
    "not-found": (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </svg>
    ),
    error: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
    )
};

const StatusGlyph = memo<StatusIllustrationProps>(({ tone }) => {
    return GLYPHS[tone];
});

StatusGlyph.displayName = "StatusGlyph";

export default StatusPage;

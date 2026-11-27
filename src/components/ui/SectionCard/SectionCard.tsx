import { Activity, memo, useId, useMemo } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import "./SectionCard.css";

export interface SectionCardProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    /** "accent" tints the icon tile, as used for QR sections on the canvas. */
    iconTone?: "neutral" | "accent";
    /** Rendered at the right of the header, e.g. a Reset button. */
    action?: ReactNode;
    headingLevel?: 2 | 3;
    children?: ReactNode;
}

export const SectionCard = memo<SectionCardProps>(
    ({ title, description, icon: Icon, iconTone = "neutral", action, headingLevel = 2, children }) => {
        const headingId = useId();
        const Heading = headingLevel === 3 ? "h3" : "h2";
        const tileClass = useMemo(
            () => classNames("section-card__tile", `section-card__tile--${iconTone}`),
            [iconTone]
        );
        const hasDescription = Boolean(description);
        const hasAction = action !== undefined && action !== null;
        const hasBody = children !== undefined && children !== null;

        return (
            <section className="section-card" aria-labelledby={headingId}>
                <div className="section-card__header">
                    <div className={tileClass} aria-hidden="true">
                        <Icon size={17} />
                    </div>
                    <div className="section-card__heading">
                        <Heading id={headingId} className="section-card__title">
                            {title}
                        </Heading>
                        <Activity mode={hasDescription ? "visible" : "hidden"}>
                            <p className="section-card__description">{description}</p>
                        </Activity>
                    </div>
                    <Activity mode={hasAction ? "visible" : "hidden"}>
                        <div className="section-card__action">{action}</div>
                    </Activity>
                </div>
                <Activity mode={hasBody ? "visible" : "hidden"}>
                    <div className="section-card__body">{children}</div>
                </Activity>
            </section>
        );
    }
);

SectionCard.displayName = "SectionCard";

export default SectionCard;

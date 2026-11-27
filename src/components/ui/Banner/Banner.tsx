import { Activity, memo, useMemo } from "react";
import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import "./Banner.css";

export type BannerTone = "danger" | "warn" | "success" | "info";

export interface BannerProps {
    tone: BannerTone;
    title?: string;
    children?: ReactNode;
    /** Replaces the tone's default icon. */
    icon?: LucideIcon;
}

const TONE_ICON: Record<BannerTone, LucideIcon> = {
    danger: CircleAlert,
    warn: TriangleAlert,
    success: CircleCheck,
    info: Info
};

export const Banner = memo<BannerProps>(({ tone, title, children, icon }) => {
    const Icon = icon ?? TONE_ICON[tone];
    const className = useMemo(() => classNames("banner", `banner--${tone}`), [tone]);
    // Problems interrupt; success and info are announced politely.
    const role = tone === "danger" || tone === "warn" ? "alert" : "status";
    const hasTitle = Boolean(title);
    const hasBody = children !== undefined && children !== null && children !== false;

    return (
        <div role={role} className={className}>
            <Icon size={18} className="banner__icon" aria-hidden="true" />
            <div className="banner__content">
                <Activity mode={hasTitle ? "visible" : "hidden"}>
                    <div className="banner__title">{title}</div>
                </Activity>
                <Activity mode={hasBody ? "visible" : "hidden"}>
                    <div className="banner__body">{children}</div>
                </Activity>
            </div>
        </div>
    );
});

Banner.displayName = "Banner";

export default Banner;

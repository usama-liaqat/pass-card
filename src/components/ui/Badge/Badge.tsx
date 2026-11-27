import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import { IconSlot } from "../IconSlot/IconSlot";
import "./Badge.css";

export type BadgeTone = "neutral" | "accent" | "success" | "warn" | "danger";

export interface BadgeProps {
    tone?: BadgeTone;
    icon?: LucideIcon;
    children: ReactNode;
}

export const Badge = memo<BadgeProps>(({ tone = "neutral", icon, children }) => {
    const className = useMemo(() => classNames("badge", `badge--${tone}`), [tone]);
    return (
        <span className={className}>
            <IconSlot icon={icon} size={12} strokeWidth={2.25} />
            {children}
        </span>
    );
});

Badge.displayName = "Badge";

export default Badge;

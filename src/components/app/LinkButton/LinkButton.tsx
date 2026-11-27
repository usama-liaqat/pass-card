import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { classNames } from "../../../lib/classNames";
import { IconSlot } from "../../ui";
import type { ButtonSize, ButtonVariant } from "../../ui";
import "../../ui/Button/Button.css";
import "./LinkButton.css";

interface LinkButtonProps {
    to: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    children: ReactNode;
}

/**
 * An in-app link that looks like a Button. It navigates through React Router,
 * so the in-memory drafts survive (a plain <a href> would reload the page).
 */
export const LinkButton = memo<LinkButtonProps>(({ to, variant = "secondary", size = "md", icon, children }) => {
    const className = useMemo(() => classNames("btn", `btn--${variant}`, `btn--${size}`), [variant, size]);
    return (
        <Link to={to} className={className}>
            <IconSlot icon={icon} size={16} />
            <span className="btn__label">{children}</span>
        </Link>
    );
});

LinkButton.displayName = "LinkButton";

export default LinkButton;

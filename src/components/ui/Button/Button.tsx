import { Activity, memo, useMemo } from "react";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { LoaderCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import { IconSlot } from "../IconSlot/IconSlot";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    variant?: ButtonVariant;
    /** sm 34px, md 42px, lg 44px. Smaller sizes keep a 44px hit area. */
    size?: ButtonSize;
    icon?: LucideIcon;
    loading?: boolean;
    /** Text announced and shown while loading. */
    loadingLabel?: string;
    fullWidth?: boolean;
    ref?: Ref<HTMLButtonElement>;
}

interface LabelledButtonProps extends BaseProps {
    children: ReactNode;
    iconOnly?: false;
}

/** Icon-only buttons have no visible text, so an aria-label is required. */
interface IconOnlyButtonProps extends BaseProps {
    iconOnly: true;
    icon: LucideIcon;
    "aria-label": string;
    children?: never;
}

export type ButtonProps = LabelledButtonProps | IconOnlyButtonProps;

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 16 };

export const Button = memo<ButtonProps>(
    ({
        variant = "secondary",
        size = "md",
        icon: Icon,
        iconOnly = false,
        loading = false,
        loadingLabel,
        fullWidth = false,
        disabled,
        className,
        children,
        type = "button",
        ref,
        ...rest
    }) => {
        const classes = useMemo(
            () =>
                classNames(
                    "btn",
                    `btn--${variant}`,
                    `btn--${size}`,
                    iconOnly && "btn--icon",
                    fullWidth && "btn--full",
                    loading && "btn--loading",
                    className
                ),
            [variant, size, iconOnly, fullWidth, loading, className]
        );
        const iconSize = ICON_SIZE[size];
        const showLoadingLabel = loading && !iconOnly && Boolean(loadingLabel);

        return (
            <button
                ref={ref}
                type={type}
                className={classes}
                disabled={disabled || loading}
                aria-busy={loading || undefined}
                {...rest}
            >
                <Activity mode={loading ? "visible" : "hidden"}>
                    <LoaderCircle className="spin" size={iconSize} strokeWidth={2.25} aria-hidden="true" />
                </Activity>
                <Activity mode={!loading && Icon ? "visible" : "hidden"}>
                    <IconSlot icon={Icon} size={iconSize} />
                </Activity>
                <Activity mode={showLoadingLabel ? "visible" : "hidden"}>
                    <span>{loadingLabel}</span>
                </Activity>
                <Activity mode={!iconOnly && !showLoadingLabel ? "visible" : "hidden"}>
                    <span className="btn__label">{children}</span>
                </Activity>
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;

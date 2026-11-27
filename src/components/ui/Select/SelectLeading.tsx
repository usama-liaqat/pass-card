import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { classNames } from "../../../lib/classNames";

/** One rectangle of a simplified flag, in percent of the flag box. */
export interface FlagRect {
    left: number;
    top: number;
    width: number;
    height: number;
    color: string;
    radius?: string;
}

export type SelectLeading =
    | { kind: "flag"; rects: Array<FlagRect> }
    /** A monogram tile, e.g. a bank's short code on its brand color. */
    | { kind: "mono"; text: string; bg: string; fg: string; size?: number }
    | { kind: "icon"; icon: LucideIcon; bg: string };

interface SelectLeadingViewProps {
    leading: SelectLeading;
    /** "trigger" draws the smaller 24px tile used inside the closed control. */
    variant: "trigger" | "option";
}

export const SelectLeadingView = memo<SelectLeadingViewProps>(({ leading, variant }) => {
    if (leading.kind === "flag") return <FlagView rects={leading.rects} />;
    if (leading.kind === "mono") return <MonoTile leading={leading} variant={variant} />;
    return <IconTile leading={leading} variant={variant} />;
});

SelectLeadingView.displayName = "SelectLeadingView";

interface FlagViewProps {
    rects: Array<FlagRect>;
}

const FlagView = memo<FlagViewProps>(({ rects }) => {
    return (
        <span className="select-flag" aria-hidden="true">
            {rects.map(rect => (
                <FlagRectView key={`${rect.left}-${rect.top}-${rect.width}-${rect.height}-${rect.color}`} rect={rect} />
            ))}
        </span>
    );
});

FlagView.displayName = "FlagView";

interface FlagRectViewProps {
    rect: FlagRect;
}

const FlagRectView = memo<FlagRectViewProps>(({ rect }) => {
    const style = useMemo<CSSProperties>(
        () => ({
            left: `${rect.left}%`,
            top: `${rect.top}%`,
            width: `${rect.width}%`,
            height: `${rect.height}%`,
            background: rect.color,
            borderRadius: rect.radius ?? "0"
        }),
        [rect]
    );
    return <span className="select-flag__rect" style={style} />;
});

FlagRectView.displayName = "FlagRectView";

interface MonoTileProps {
    leading: Extract<SelectLeading, { kind: "mono" }>;
    variant: "trigger" | "option";
}

const MonoTile = memo<MonoTileProps>(({ leading, variant }) => {
    const style = useMemo(
        () =>
            ({
                "--tile-bg": leading.bg,
                "--tile-fg": leading.fg,
                "--tile-fs": `${leading.size ?? 10}px`
            }) as CSSProperties,
        [leading.bg, leading.fg, leading.size]
    );
    const className = useMemo(
        () => classNames("select-tile", `select-tile--${variant}`, "select-tile--mono"),
        [variant]
    );
    return (
        <span className={className} style={style} aria-hidden="true">
            {leading.text}
        </span>
    );
});

MonoTile.displayName = "MonoTile";

interface IconTileProps {
    leading: Extract<SelectLeading, { kind: "icon" }>;
    variant: "trigger" | "option";
}

const IconTile = memo<IconTileProps>(({ leading, variant }) => {
    const style = useMemo(() => ({ "--tile-bg": leading.bg }) as CSSProperties, [leading.bg]);
    const className = useMemo(
        () => classNames("select-tile", `select-tile--${variant}`, "select-tile--icon"),
        [variant]
    );
    const Icon = leading.icon;
    return (
        <span className={className} style={style} aria-hidden="true">
            <Icon size={variant === "trigger" ? 14 : 15} />
        </span>
    );
});

IconTile.displayName = "IconTile";

export default SelectLeadingView;

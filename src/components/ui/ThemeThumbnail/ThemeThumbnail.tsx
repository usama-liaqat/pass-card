import { Activity, memo, useCallback, useId, useMemo } from "react";
import type { CSSProperties, ChangeEvent } from "react";
import { Check } from "lucide-react";
import "./ThemeThumbnail.css";

/** Colors of a card theme. These are card data, not app tokens. */
export interface ThumbnailTheme {
    id: string;
    label: string;
    bg: string;
    fg: string;
    /** Secondary text, e.g. the job title. */
    fg2: string;
    border: string;
    tileBg: string;
    tileFg: string;
    avatarBg: string;
    avatarFg: string;
    /** Color dots drawn on the thumbnail, e.g. to mark a "Custom" theme. */
    swatches?: Array<string>;
}

/**
 * "card" draws a mini business card with the sample text; "swatch" draws an
 * abstract pass (logo tile, text bars, QR block), as on the bank card page.
 */
export type ThumbnailVariant = "card" | "swatch";

/** Sample text drawn on every thumbnail so themes can be compared. */
export interface ThumbnailSample {
    mono: string;
    company: string;
    name: string;
    title: string;
    initials: string;
}

export interface ThemeThumbnailGroupProps {
    /** Accessible name of the radio group. */
    label: string;
    themes: Array<ThumbnailTheme>;
    value: string;
    onValueChange: (id: string) => void;
    /** Text for the "card" variant; not used by "swatch". */
    sample?: ThumbnailSample;
    variant?: ThumbnailVariant;
}

const EMPTY_SAMPLE: ThumbnailSample = { mono: "", company: "", name: "", title: "", initials: "" };

/**
 * Radio group of mini card previews. Each option is a native radio input,
 * so arrow keys, Tab and screen readers behave like any radio group.
 */
export const ThemeThumbnailGroup = memo<ThemeThumbnailGroupProps>(
    ({ label, themes, value, onValueChange, sample = EMPTY_SAMPLE, variant = "card" }) => {
        const name = useId();
        const className = useMemo(() => `theme-thumbs theme-thumbs--${variant}`, [variant]);
        return (
            <div role="radiogroup" aria-label={label} className={className}>
                {themes.map(theme => (
                    <ThemeThumbnail
                        key={theme.id}
                        name={name}
                        theme={theme}
                        sample={sample}
                        variant={variant}
                        checked={theme.id === value}
                        onPick={onValueChange}
                    />
                ))}
            </div>
        );
    }
);

ThemeThumbnailGroup.displayName = "ThemeThumbnailGroup";

export interface ThemeThumbnailProps {
    name: string;
    theme: ThumbnailTheme;
    sample: ThumbnailSample;
    variant?: ThumbnailVariant;
    checked: boolean;
    onPick: (id: string) => void;
}

export const ThemeThumbnail = memo<ThemeThumbnailProps>(
    ({ name, theme, sample, variant = "card", checked, onPick }) => {
        const style = useMemo(
            () =>
                ({
                    "--thumb-bg": theme.bg,
                    "--thumb-fg": theme.fg,
                    "--thumb-fg2": theme.fg2,
                    "--thumb-border": theme.border,
                    "--thumb-tile-bg": theme.tileBg,
                    "--thumb-tile-fg": theme.tileFg,
                    "--thumb-avatar-bg": theme.avatarBg,
                    "--thumb-avatar-fg": theme.avatarFg
                }) as CSSProperties,
            [theme]
        );
        const cardClass = useMemo(() => `theme-thumb__card theme-thumb__card--${variant}`, [variant]);
        const handleChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.checked) onPick(theme.id);
            },
            [onPick, theme.id]
        );

        return (
            <label className="theme-thumb">
                <input
                    type="radio"
                    name={name}
                    value={theme.id}
                    checked={checked}
                    onChange={handleChange}
                    className="theme-thumb__input sr-only"
                />
                <span className={cardClass} style={style} aria-hidden="true">
                    <Activity mode={variant === "card" ? "visible" : "hidden"}>
                        <span className="theme-thumb__top">
                            <span className="theme-thumb__tile">{sample.mono}</span>
                            <span className="theme-thumb__company">{sample.company}</span>
                        </span>
                        <span className="theme-thumb__bottom">
                            <span className="theme-thumb__person">
                                <span className="theme-thumb__name">{sample.name}</span>
                                <span className="theme-thumb__title">{sample.title}</span>
                            </span>
                            <span className="theme-thumb__avatar">{sample.initials}</span>
                        </span>
                    </Activity>
                    <Activity mode={variant === "swatch" ? "visible" : "hidden"}>
                        <span className="theme-thumb__swatch-top">
                            <span className="theme-thumb__swatch-tile" />
                            <span className="theme-thumb__swatch-bar theme-thumb__swatch-bar--name" />
                        </span>
                        <span className="theme-thumb__swatch-bar theme-thumb__swatch-bar--label" />
                        <span className="theme-thumb__swatch-bar theme-thumb__swatch-bar--value" />
                        <span className="theme-thumb__swatch-qr" />
                        <span className="theme-thumb__swatches">
                            {(theme.swatches ?? []).map(color => (
                                <ThumbnailSwatch key={color} color={color} />
                            ))}
                        </span>
                    </Activity>
                    <Activity mode={checked ? "visible" : "hidden"}>
                        <span className="theme-thumb__check">
                            <Check size={10} strokeWidth={3.5} />
                        </span>
                    </Activity>
                </span>
                <span className="theme-thumb__label">{theme.label}</span>
            </label>
        );
    }
);

ThemeThumbnail.displayName = "ThemeThumbnail";

interface ThumbnailSwatchProps {
    color: string;
}

const ThumbnailSwatch = memo<ThumbnailSwatchProps>(({ color }) => {
    const style = useMemo(() => ({ background: color }), [color]);
    return <span className="theme-thumb__swatch-dot" style={style} />;
});

ThumbnailSwatch.displayName = "ThumbnailSwatch";

export default ThemeThumbnail;

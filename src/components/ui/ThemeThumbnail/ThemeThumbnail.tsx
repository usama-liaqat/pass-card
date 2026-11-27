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
}

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
    sample: ThumbnailSample;
}

/**
 * Radio group of mini card previews. Each option is a native radio input,
 * so arrow keys, Tab and screen readers behave like any radio group.
 */
export const ThemeThumbnailGroup = memo<ThemeThumbnailGroupProps>(({ label, themes, value, onValueChange, sample }) => {
    const name = useId();
    return (
        <div role="radiogroup" aria-label={label} className="theme-thumbs">
            {themes.map(theme => (
                <ThemeThumbnail
                    key={theme.id}
                    name={name}
                    theme={theme}
                    sample={sample}
                    checked={theme.id === value}
                    onPick={onValueChange}
                />
            ))}
        </div>
    );
});

ThemeThumbnailGroup.displayName = "ThemeThumbnailGroup";

export interface ThemeThumbnailProps {
    name: string;
    theme: ThumbnailTheme;
    sample: ThumbnailSample;
    checked: boolean;
    onPick: (id: string) => void;
}

export const ThemeThumbnail = memo<ThemeThumbnailProps>(({ name, theme, sample, checked, onPick }) => {
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
            <span className="theme-thumb__card" style={style} aria-hidden="true">
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
                <Activity mode={checked ? "visible" : "hidden"}>
                    <span className="theme-thumb__check">
                        <Check size={10} strokeWidth={3.5} />
                    </span>
                </Activity>
            </span>
            <span className="theme-thumb__label">{theme.label}</span>
        </label>
    );
});

ThemeThumbnail.displayName = "ThemeThumbnail";

export default ThemeThumbnail;

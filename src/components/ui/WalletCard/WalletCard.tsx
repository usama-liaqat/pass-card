import { Activity, memo, useCallback, useMemo } from "react";
import type { CSSProperties } from "react";
import { Info } from "lucide-react";
import type { WalletCardData, WalletCardView, WalletField, WalletPlatform } from "./types";
import { WalletDetailRow, WalletFieldView, WalletIconChip, WalletLogoTile, WalletQrPanel } from "./WalletCardParts";
import "./WalletCard.css";

export interface WalletCardProps {
    card: WalletCardData;
    platform: WalletPlatform;
    view: WalletCardView;
    /** Called by the info / Done / Back buttons with the view to switch to. */
    onViewChange?: (view: WalletCardView) => void;
}

/** Apple Wallet shows at most four fields across the secondary and auxiliary rows. */
const APPLE_MAX_FIELDS = 4;

const EMPTY_FIELDS: Array<WalletField> = [];

const DEFAULT_EMPTY_DETAILS = "No additional details yet.";

/**
 * Preview of a generic wallet pass, drawn as Apple Wallet or Google Wallet
 * would show it, with a front and a details view.
 */
export const WalletCard = memo<WalletCardProps>(({ card, platform, view, onViewChange }) => {
    const { theme } = card;

    const style = useMemo(
        () =>
            ({
                "--wc-bg": theme.bg,
                "--wc-fg": theme.fg,
                "--wc-label": theme.label,
                "--wc-border": theme.border,
                "--wc-gfg": theme.googleFg,
                "--wc-glabel": theme.googleLabel,
                "--wc-tile-bg": theme.tileBg,
                "--wc-tile-fg": theme.tileFg,
                "--wc-thumb-bg": theme.thumbBg ?? theme.tileBg,
                "--wc-thumb-fg": theme.thumbFg ?? theme.tileFg,
                "--wc-min-h": `${card.minHeight ?? 470}px`,
                "--wc-primary-size": `${card.primary.size ?? 24}px`,
                "--wc-primary-gsize": `${card.primary.googleSize ?? 24}px`,
                "--wc-title-opacity": card.titleDimmed ? 0.55 : 1,
                "--wc-primary-opacity": card.primary.dimmed ? 0.55 : 1,
                "--wc-sub-opacity": card.googleSubheaderDimmed ? 0.55 : 1
            }) as CSSProperties,
        [theme, card.minHeight, card.primary, card.titleDimmed, card.googleSubheaderDimmed]
    );

    const appleFields = useMemo(() => {
        const secondary = (card.secondary ?? EMPTY_FIELDS).slice(0, APPLE_MAX_FIELDS);
        const auxiliary = (card.auxiliary ?? EMPTY_FIELDS).slice(0, APPLE_MAX_FIELDS - secondary.length);
        return { secondary, auxiliary };
    }, [card.secondary, card.auxiliary]);

    const details = useMemo(() => card.details ?? [], [card.details]);
    const googleRows = useMemo(() => card.googleRows ?? [], [card.googleRows]);
    const iconRow = useMemo(() => card.iconRow ?? [], [card.iconRow]);
    const googleMono = useMemo(
        () => (card.logo.kind === "mono" ? card.logo.text : card.title.slice(0, 2).toUpperCase()),
        [card.logo, card.title]
    );

    const showDetails = useCallback(() => onViewChange?.("details"), [onViewChange]);
    const showFront = useCallback(() => onViewChange?.("front"), [onViewChange]);

    const isApple = platform === "apple";
    const isFront = view === "front";
    const hasHeader = Boolean(card.header);
    const hasPrimaryLabel = Boolean(card.primary.label);
    const hasPrimarySub = Boolean(card.primary.sub);
    const hasThumbImage = Boolean(card.thumbnail?.src);
    const hasThumbInitials = Boolean(card.thumbnail) && !hasThumbImage;
    const hasQr = Boolean(card.qr);
    const hasDetails = details.length > 0;
    const hasDisclaimer = Boolean(card.disclaimer);
    const hasSubheader = Boolean(card.googleSubheader);

    return (
        <div className="wallet-card" style={style}>
            {/* Apple · front */}
            <Activity mode={isApple && isFront ? "visible" : "hidden"}>
                <div className="wc-apple">
                    <div className="wc-apple__top">
                        <div className="wc-brand">
                            <WalletLogoTile logo={card.logo} />
                            <div className="wc-apple__title">{card.title}</div>
                        </div>
                        <Activity mode={hasHeader ? "visible" : "hidden"}>
                            <div className="wc-apple__header">
                                <div className="wc-label">{card.header?.label}</div>
                                <div className="wc-apple__header-value">{card.header?.value}</div>
                            </div>
                        </Activity>
                    </div>

                    <div className="wc-apple__primary-row">
                        <div className="wc-apple__primary">
                            <Activity mode={hasPrimaryLabel ? "visible" : "hidden"}>
                                <div className="wc-label wc-label--primary">{card.primary.label}</div>
                            </Activity>
                            <div className="wc-apple__primary-value">{card.primary.value}</div>
                            <Activity mode={hasPrimarySub ? "visible" : "hidden"}>
                                <div className="wc-apple__primary-sub">{card.primary.sub}</div>
                            </Activity>
                        </div>
                        <Activity mode={hasThumbImage ? "visible" : "hidden"}>
                            <img src={card.thumbnail?.src || undefined} alt="" className="wc-thumb" />
                        </Activity>
                        <Activity mode={hasThumbInitials ? "visible" : "hidden"}>
                            <div className="wc-thumb wc-thumb--initials" aria-hidden="true">
                                {card.thumbnail?.initials}
                            </div>
                        </Activity>
                    </div>

                    <Activity mode={appleFields.secondary.length > 0 ? "visible" : "hidden"}>
                        <div className="wc-row">
                            {appleFields.secondary.map(field => (
                                <WalletFieldView key={field.id} field={field} variant="apple" />
                            ))}
                        </div>
                    </Activity>
                    <Activity mode={appleFields.auxiliary.length > 0 ? "visible" : "hidden"}>
                        <div className="wc-row">
                            {appleFields.auxiliary.map(field => (
                                <WalletFieldView key={field.id} field={field} variant="apple" />
                            ))}
                        </div>
                    </Activity>

                    <div className="wc-spacer" />

                    <Activity mode={hasQr ? "visible" : "hidden"}>
                        <WalletQrSlot card={card} variant="apple" />
                    </Activity>

                    <button
                        type="button"
                        className="wc-info wc-info--apple hit-area"
                        aria-label="Show pass details"
                        onClick={showDetails}
                    >
                        <Info size={20} aria-hidden="true" />
                    </button>
                </div>
            </Activity>

            {/* Apple · details */}
            <Activity mode={isApple && !isFront ? "visible" : "hidden"}>
                <div className="wc-apple-back">
                    <div className="wc-apple-back__top">
                        <div className="wc-apple-back__issuer">{card.title}</div>
                        <button type="button" className="wc-apple-back__done hit-area" onClick={showFront}>
                            Done
                        </button>
                    </div>
                    <div className="wc-apple-back__heading">Pass Details</div>
                    <Activity mode={hasDetails ? "visible" : "hidden"}>
                        <div className="wc-apple-back__list">
                            {details.map(detail => (
                                <WalletDetailRow key={detail.id} detail={detail} variant="apple" />
                            ))}
                        </div>
                    </Activity>
                    <Activity mode={hasDetails ? "hidden" : "visible"}>
                        <div className="wc-apple-back__empty">{card.emptyDetailsText ?? DEFAULT_EMPTY_DETAILS}</div>
                    </Activity>
                    <Activity mode={hasDisclaimer ? "visible" : "hidden"}>
                        <div className="wc-apple-back__note">{card.disclaimer}</div>
                    </Activity>
                </div>
            </Activity>

            {/* Google · front */}
            <Activity mode={!isApple && isFront ? "visible" : "hidden"}>
                <div className="wc-google">
                    <div className="wc-google__top">
                        <WalletLogoTile logo={card.logo} />
                        <div className="wc-google__title">{card.title}</div>
                    </div>
                    <button
                        type="button"
                        className="wc-info wc-info--google"
                        aria-label="Show pass details"
                        onClick={showDetails}
                    >
                        <Info size={20} aria-hidden="true" />
                    </button>
                    <div className="wc-google__primary">
                        <Activity mode={hasSubheader ? "visible" : "hidden"}>
                            <div className="wc-google__subheader">{card.googleSubheader}</div>
                        </Activity>
                        <div className="wc-google__primary-value">{card.primary.value}</div>
                    </div>
                    {googleRows.map(row => (
                        <div key={row.id} className="wc-row">
                            {row.cells.map(field => (
                                <WalletFieldView key={field.id} field={field} variant="google" />
                            ))}
                        </div>
                    ))}
                    <Activity mode={iconRow.length > 0 ? "visible" : "hidden"}>
                        <div className="wc-chips" role="group" aria-label="Profiles">
                            {iconRow.map(item => (
                                <WalletIconChip key={item.id} item={item} />
                            ))}
                        </div>
                    </Activity>
                    <Activity mode={hasQr ? "visible" : "hidden"}>
                        <WalletQrSlot card={card} variant="google" />
                    </Activity>
                </div>
            </Activity>

            {/* Google · details */}
            <Activity mode={!isApple && !isFront ? "visible" : "hidden"}>
                <div className="wc-google-back">
                    <div className="wc-google-back__top">
                        <div className="wc-google-back__mono" aria-hidden="true">
                            {googleMono}
                        </div>
                        <div className="wc-google-back__heading">
                            <div className="wc-google-back__title">Details</div>
                            <div className="wc-google-back__issuer">{card.title}</div>
                        </div>
                        <button type="button" className="wc-google-back__back" onClick={showFront}>
                            Back to pass
                        </button>
                    </div>
                    <Activity mode={hasDetails ? "visible" : "hidden"}>
                        <div className="wc-google-back__list">
                            {details.map(detail => (
                                <WalletDetailRow key={detail.id} detail={detail} variant="google" />
                            ))}
                        </div>
                    </Activity>
                    <Activity mode={hasDetails ? "hidden" : "visible"}>
                        <div className="wc-google-back__empty">{card.emptyDetailsText ?? DEFAULT_EMPTY_DETAILS}</div>
                    </Activity>
                    <Activity mode={hasDisclaimer ? "visible" : "hidden"}>
                        <div className="wc-google-back__note">{card.disclaimer}</div>
                    </Activity>
                </div>
            </Activity>
        </div>
    );
});

WalletCard.displayName = "WalletCard";

interface WalletQrSlotProps {
    card: WalletCardData;
    variant: "apple" | "google";
}

const WalletQrSlot = memo<WalletQrSlotProps>(({ card, variant }) => {
    if (!card.qr) return null;
    const size = variant === "apple" ? (card.qrSizeApple ?? 132) : (card.qrSizeGoogle ?? 148);
    return <WalletQrPanel qr={card.qr} size={size} variant={variant} />;
});

WalletQrSlot.displayName = "WalletQrSlot";

export default WalletCard;

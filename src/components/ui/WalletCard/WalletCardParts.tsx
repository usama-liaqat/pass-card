import { Activity, memo, useMemo } from "react";
import type { CSSProperties } from "react";
import { QrCode, QrPlaceholder } from "../QrCode/QrCode";
import type { WalletDetail, WalletField, WalletIconRowItem, WalletLogo, WalletQr } from "./types";

interface WalletLogoTileProps {
    logo: WalletLogo;
}

/** Logo image, monogram, icon or short text in the card's logo tile. */
export const WalletLogoTile = memo<WalletLogoTileProps>(({ logo }) => {
    const monoStyle = useMemo(
        () => ({ "--wc-mono-size": `${logo.kind === "mono" ? (logo.size ?? 11) : 11}px` }) as CSSProperties,
        [logo]
    );
    if (logo.kind === "image") {
        return <img src={logo.src || undefined} alt="" className="wc-logo wc-logo--image" />;
    }
    if (logo.kind === "mono") {
        return (
            <span className="wc-logo wc-logo--mono" style={monoStyle} aria-hidden="true">
                {logo.text}
            </span>
        );
    }
    if (logo.kind === "icon") {
        const Icon = logo.icon;
        return (
            <span className="wc-logo" aria-hidden="true">
                <Icon size={18} />
            </span>
        );
    }
    return (
        <span className="wc-logo wc-logo--text" aria-hidden="true">
            {logo.text}
        </span>
    );
});

WalletLogoTile.displayName = "WalletLogoTile";

interface WalletFieldViewProps {
    field: WalletField;
    variant: "apple" | "google";
}

export const WalletFieldView = memo<WalletFieldViewProps>(({ field, variant }) => {
    const style = useMemo(
        () =>
            ({
                "--wc-field-flex": variant === "apple" ? (field.flex ?? 1) : 1,
                "--wc-field-align": field.align ?? "left",
                "--wc-field-size": `${field.size ?? 15}px`,
                "--wc-field-opacity": field.dimmed ? 0.55 : 1
            }) as CSSProperties,
        [field.flex, field.align, field.size, field.dimmed, variant]
    );
    return (
        <div className={`wc-field wc-field--${variant}`} style={style}>
            <div className="wc-field__label">{field.label}</div>
            <div className="wc-field__value">{field.value}</div>
        </div>
    );
});

WalletFieldView.displayName = "WalletFieldView";

interface WalletIconChipProps {
    item: WalletIconRowItem;
}

export const WalletIconChip = memo<WalletIconChipProps>(({ item }) => {
    const style = useMemo(
        () => ({ "--wc-chip-bg": item.bg, "--wc-chip-fg": item.fg }) as CSSProperties,
        [item.bg, item.fg]
    );
    const Icon = item.icon;
    return (
        <span className="wc-chip" style={style} title={item.name} role="img" aria-label={item.name}>
            <Activity mode={Icon ? "visible" : "hidden"}>
                <WalletChipIcon item={item} />
            </Activity>
            <Activity mode={Icon ? "hidden" : "visible"}>
                <span aria-hidden="true">{item.mono}</span>
            </Activity>
        </span>
    );
});

WalletIconChip.displayName = "WalletIconChip";

const WalletChipIcon = memo<WalletIconChipProps>(({ item }) => {
    const Icon = item.icon;
    if (!Icon) return null;
    return <Icon size={16} aria-hidden="true" />;
});

WalletChipIcon.displayName = "WalletChipIcon";

interface WalletQrPanelProps {
    qr: WalletQr;
    size: number;
    variant: "apple" | "google";
}

/** The white panel holding the QR code (or its image / placeholder) and caption. */
export const WalletQrPanel = memo<WalletQrPanelProps>(({ qr, size, variant }) => {
    const imageStyle = useMemo(() => ({ width: size, height: size }), [size]);
    const hasImage = Boolean(qr.imageSrc);
    const isPending = !hasImage && Boolean(qr.pending);
    const isGenerated = !hasImage && !isPending;
    return (
        <div className={`wc-qr wc-qr--${variant}`}>
            <Activity mode={isGenerated ? "visible" : "hidden"}>
                <QrCode value={isGenerated ? qr.value : ""} size={size} label={qr.alt} />
            </Activity>
            <Activity mode={hasImage ? "visible" : "hidden"}>
                <img
                    src={qr.imageSrc || undefined}
                    alt={`QR code: ${qr.alt}`}
                    className="wc-qr__image"
                    style={imageStyle}
                />
            </Activity>
            <Activity mode={isPending ? "visible" : "hidden"}>
                <QrPlaceholder size={size} text={qr.pendingText ?? "Your QR here"} tone="pending" />
            </Activity>
            <div className="wc-qr__caption">{qr.alt}</div>
        </div>
    );
});

WalletQrPanel.displayName = "WalletQrPanel";

interface WalletDetailRowProps {
    detail: WalletDetail;
    variant: "apple" | "google";
}

export const WalletDetailRow = memo<WalletDetailRowProps>(({ detail, variant }) => {
    const hasHref = Boolean(detail.href);
    return (
        <div className={`wc-detail wc-detail--${variant}`}>
            <div className="wc-detail__label">{detail.label}</div>
            <div className="wc-detail__value">
                <Activity mode={hasHref ? "visible" : "hidden"}>
                    <a
                        href={detail.href || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wc-detail__link"
                    >
                        {detail.value}
                    </a>
                </Activity>
                <Activity mode={hasHref ? "hidden" : "visible"}>
                    <span>{detail.value}</span>
                </Activity>
            </div>
        </div>
    );
});

WalletDetailRow.displayName = "WalletDetailRow";

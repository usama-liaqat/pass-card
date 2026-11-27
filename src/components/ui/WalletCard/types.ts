import type { LucideIcon } from "lucide-react";

export type WalletPlatform = "apple" | "google";
export type WalletCardView = "front" | "details";

/** Card colors. These come from the card's theme, not from the app tokens. */
export interface WalletCardTheme {
    bg: string;
    fg: string;
    /** Field labels on the Apple pass. */
    label: string;
    border: string;
    /** Text and labels on the Google pass. */
    googleFg: string;
    googleLabel: string;
    /** Logo tile behind a monogram or icon. */
    tileBg: string;
    tileFg: string;
    /** Initials tile used as the Apple thumbnail when there is no photo. */
    thumbBg?: string;
    thumbFg?: string;
}

export type WalletLogo =
    | { kind: "image"; src: string }
    | { kind: "mono"; text: string; size?: number }
    | { kind: "icon"; icon: LucideIcon }
    | { kind: "text"; text: string };

export interface WalletField {
    id: string;
    label: string;
    value: string;
    /** Draws a placeholder value at reduced opacity. */
    dimmed?: boolean;
    /** Relative width within its row (Apple). */
    flex?: number;
    align?: "left" | "right";
    /** Value font size in px. */
    size?: number;
}

export interface WalletGoogleRow {
    id: string;
    cells: Array<WalletField>;
}

export interface WalletIconRowItem {
    id: string;
    name: string;
    bg: string;
    fg: string;
    icon?: LucideIcon;
    /** Short text shown when there is no icon. */
    mono?: string;
}

export interface WalletDetail {
    id: string;
    label: string;
    value: string;
    href?: string;
}

export interface WalletQr {
    /** Text encoded in the QR code. */
    value: string;
    /** Caption under the code and accessible description. */
    alt: string;
    /** An uploaded QR image used instead of generating one. */
    imageSrc?: string;
    /** Shows a dashed "your QR here" box until there is content. */
    pending?: boolean;
    pendingText?: string;
}

export interface WalletCardData {
    theme: WalletCardTheme;
    /** Issuer or company name next to the logo. */
    title: string;
    titleDimmed?: boolean;
    logo: WalletLogo;
    /** Top-right field on the Apple pass. */
    header?: { label: string; value: string };
    primary: {
        label?: string;
        value: string;
        sub?: string;
        dimmed?: boolean;
        /** Apple value size in px (default 24). */
        size?: number;
        /** Google value size in px (default 24). */
        googleSize?: number;
    };
    /** Apple only: a photo, or initials when no photo is set. */
    thumbnail?: { src?: string; initials?: string };
    secondary?: Array<WalletField>;
    auxiliary?: Array<WalletField>;
    googleSubheader?: string;
    googleSubheaderDimmed?: boolean;
    googleRows?: Array<WalletGoogleRow>;
    /** Google only: a row of small profile icons. */
    iconRow?: Array<WalletIconRowItem>;
    qr?: WalletQr;
    qrSizeApple?: number;
    qrSizeGoogle?: number;
    details?: Array<WalletDetail>;
    emptyDetailsText?: string;
    disclaimer?: string;
    /** Apple pass minimum height in px (default 470). */
    minHeight?: number;
}

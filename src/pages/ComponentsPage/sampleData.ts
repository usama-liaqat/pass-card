import { Briefcase, CreditCard, Landmark } from "lucide-react";
import type { SelectOption, ThumbnailSample, ThumbnailTheme } from "../../components/ui";

/** Sample data for the showcase only. Brand colors here are card data, not app tokens. */

export const COUNTRY_OPTIONS: Array<SelectOption> = [
    {
        id: "PK",
        label: "Pakistan",
        sub: "PKR",
        leading: {
            kind: "flag",
            rects: [
                { left: 0, top: 0, width: 100, height: 100, color: "#01411C" },
                { left: 0, top: 0, width: 25, height: 100, color: "#FFFFFF" }
            ]
        }
    },
    {
        id: "AE",
        label: "United Arab Emirates",
        sub: "AED",
        leading: {
            kind: "flag",
            rects: [
                { left: 0, top: 0, width: 100, height: 34, color: "#00732F" },
                { left: 0, top: 33, width: 100, height: 34, color: "#FFFFFF" },
                { left: 0, top: 66, width: 100, height: 34, color: "#000000" },
                { left: 0, top: 0, width: 26, height: 100, color: "#FF0000" }
            ]
        }
    },
    {
        id: "DE",
        label: "Germany",
        sub: "EUR",
        leading: {
            kind: "flag",
            rects: [
                { left: 0, top: 0, width: 100, height: 34, color: "#000000" },
                { left: 0, top: 33, width: 100, height: 34, color: "#DD0000" },
                { left: 0, top: 66, width: 100, height: 34, color: "#FFCE00" }
            ]
        }
    },
    {
        id: "FR",
        label: "France",
        sub: "EUR",
        leading: {
            kind: "flag",
            rects: [
                { left: 0, top: 0, width: 34, height: 100, color: "#002654" },
                { left: 33, top: 0, width: 34, height: 100, color: "#FFFFFF" },
                { left: 66, top: 0, width: 34, height: 100, color: "#CE1126" }
            ]
        }
    },
    {
        id: "XX",
        label: "Unsupported region",
        sub: "Not available yet",
        disabled: true,
        leading: {
            kind: "flag",
            rects: [{ left: 0, top: 0, width: 100, height: 100, color: "#D4D4D8" }]
        }
    }
];

export const BANK_OPTIONS: Array<SelectOption> = [
    {
        id: "alfalah",
        label: "Bank Alfalah",
        sub: "ALFH",
        keywords: "baf",
        leading: { kind: "mono", text: "BAF", bg: "#C8102E", fg: "#FFFFFF" }
    },
    {
        id: "hbl",
        label: "HBL",
        sub: "Habib Bank Limited",
        leading: { kind: "mono", text: "HBL", bg: "#00856F", fg: "#FFFFFF" }
    },
    {
        id: "meezan",
        label: "Meezan Bank",
        sub: "MEZN",
        leading: { kind: "mono", text: "MBL", bg: "#6A1B4D", fg: "#FFFFFF" }
    },
    {
        id: "ubl",
        label: "UBL",
        sub: "United Bank Limited",
        leading: { kind: "mono", text: "UBL", bg: "#0067B1", fg: "#FFFFFF" }
    }
];

export const ACCOUNT_TYPE_OPTIONS: Array<SelectOption> = [
    { id: "current", label: "Current account", leading: { kind: "icon", icon: Landmark, bg: "#3F5BD9" } },
    { id: "savings", label: "Savings account", leading: { kind: "icon", icon: CreditCard, bg: "#12805C" } },
    {
        id: "business",
        label: "Business account",
        sub: "Coming soon",
        disabled: true,
        leading: { kind: "icon", icon: Briefcase, bg: "#6B6B74" }
    }
];

export const THUMBNAIL_SAMPLE: ThumbnailSample = {
    mono: "N",
    company: "Northwind",
    name: "Ayesha Khan",
    title: "Product designer",
    initials: "AK"
};

export const CARD_THEMES: Array<ThumbnailTheme> = [
    {
        id: "graphite",
        label: "Graphite",
        bg: "#18181B",
        fg: "#FFFFFF",
        fg2: "rgba(255,255,255,0.7)",
        border: "#18181B",
        tileBg: "rgba(255,255,255,0.16)",
        tileFg: "#FFFFFF",
        avatarBg: "rgba(255,255,255,0.16)",
        avatarFg: "#FFFFFF"
    },
    {
        id: "paper",
        label: "Paper",
        bg: "#FFFFFF",
        fg: "#0A0A0B",
        fg2: "#6B6B74",
        border: "#E4E4E7",
        tileBg: "#0A0A0B",
        tileFg: "#FFFFFF",
        avatarBg: "#F1F1F3",
        avatarFg: "#0A0A0B"
    },
    {
        id: "ocean",
        label: "Ocean",
        bg: "#1D4ED8",
        fg: "#FFFFFF",
        fg2: "rgba(255,255,255,0.75)",
        border: "#1D4ED8",
        tileBg: "rgba(255,255,255,0.18)",
        tileFg: "#FFFFFF",
        avatarBg: "rgba(255,255,255,0.18)",
        avatarFg: "#FFFFFF"
    },
    {
        id: "forest",
        label: "Forest",
        bg: "#14532D",
        fg: "#FFFFFF",
        fg2: "rgba(255,255,255,0.72)",
        border: "#14532D",
        tileBg: "rgba(255,255,255,0.16)",
        tileFg: "#FFFFFF",
        avatarBg: "rgba(255,255,255,0.16)",
        avatarFg: "#FFFFFF"
    },
    {
        id: "plum",
        label: "Plum",
        bg: "#581C87",
        fg: "#FFFFFF",
        fg2: "rgba(255,255,255,0.72)",
        border: "#581C87",
        tileBg: "rgba(255,255,255,0.16)",
        tileFg: "#FFFFFF",
        avatarBg: "rgba(255,255,255,0.16)",
        avatarFg: "#FFFFFF"
    },
    {
        id: "sand",
        label: "Sand",
        bg: "#F5EBDD",
        fg: "#3D2B1F",
        fg2: "#7A6555",
        border: "#E8DAC6",
        tileBg: "#3D2B1F",
        tileFg: "#F5EBDD",
        avatarBg: "#E8DAC6",
        avatarFg: "#3D2B1F"
    },
    {
        id: "crimson",
        label: "Crimson",
        bg: "#C8102E",
        fg: "#FFFFFF",
        fg2: "rgba(255,255,255,0.74)",
        border: "#C8102E",
        tileBg: "rgba(255,255,255,0.18)",
        tileFg: "#FFFFFF",
        avatarBg: "rgba(255,255,255,0.18)",
        avatarFg: "#FFFFFF"
    },
    {
        id: "midnight",
        label: "Midnight",
        bg: "#0B1026",
        fg: "#E6E9F5",
        fg2: "#9AA3C7",
        border: "#0B1026",
        tileBg: "#7D93FF",
        tileFg: "#0B1026",
        avatarBg: "#1B2246",
        avatarFg: "#E6E9F5"
    }
];

export { SAMPLE_CARDS } from "../../cards/previewSamples";

export const CARD_SAMPLE_OPTIONS: Array<SelectOption> = [
    { id: "bank", label: "Bank account", sub: "Monogram, header field, 4-field limit" },
    { id: "business", label: "Business", sub: "Thumbnail, 2-line clamp, links" },
    { id: "wifi", label: "Wi-Fi", sub: "Icon tile, larger QR, no details" },
    { id: "social", label: "Social", sub: "Icon row, QR placeholder" }
];

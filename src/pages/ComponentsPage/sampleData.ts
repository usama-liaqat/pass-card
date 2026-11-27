import { AtSign, Briefcase, CreditCard, Globe, Landmark, Mail, Phone, Wifi } from "lucide-react";
import type { SelectOption, ThumbnailSample, ThumbnailTheme, WalletCardData } from "../../components/ui";

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

const BANK_DISCLAIMER =
    "This pass shares bank account details only. It is not a debit or credit card and cannot be used for payments.";

export const SAMPLE_CARDS: Record<"bank" | "business" | "wifi" | "social", WalletCardData> = {
    bank: {
        theme: {
            bg: "#C8102E",
            fg: "#FFFFFF",
            label: "rgba(255,255,255,0.74)",
            border: "transparent",
            googleFg: "#FFFFFF",
            googleLabel: "rgba(255,255,255,0.78)",
            tileBg: "rgba(255,255,255,0.18)",
            tileFg: "#FFFFFF"
        },
        title: "Bank Alfalah",
        logo: { kind: "mono", text: "BAF", size: 11 },
        header: { label: "Currency", value: "PKR" },
        primary: { label: "Savings account", value: "Ayesha Raza Khan" },
        secondary: [
            { id: "acc", label: "Account no.", value: "5501 0012 3456 78", flex: 1.4 },
            { id: "branch", label: "Branch", value: "5501", align: "right" }
        ],
        auxiliary: [{ id: "iban", label: "IBAN", value: "PK83 ALFH 0055 0100 1234 5678" }],
        googleSubheader: "Savings account",
        googleRows: [
            {
                id: "r1",
                cells: [
                    { id: "acc", label: "Account number", value: "5501 0012 3456 78" },
                    { id: "cur", label: "Currency", value: "PKR" }
                ]
            },
            { id: "r2", cells: [{ id: "iban", label: "IBAN", value: "PK83 ALFH 0055 0100 1234 5678" }] }
        ],
        qr: { value: "PK83ALFH0055010012345678", alt: "Scan to copy IBAN" },
        details: [
            { id: "bn", label: "Branch name", value: "F-7 Markaz, Islamabad" },
            { id: "swift", label: "SWIFT / BIC", value: "ALFHPKKA" },
            { id: "raast", label: "Raast ID", value: "0300 1234567" }
        ],
        emptyDetailsText:
            "No additional details yet. Add a branch name, SWIFT code, Raast ID or notes under Additional details.",
        disclaimer: BANK_DISCLAIMER
    },
    business: {
        theme: {
            bg: "#18181B",
            fg: "#FFFFFF",
            label: "rgba(255,255,255,0.62)",
            border: "transparent",
            googleFg: "#FFFFFF",
            googleLabel: "rgba(255,255,255,0.7)",
            tileBg: "rgba(255,255,255,0.16)",
            tileFg: "#FFFFFF",
            thumbBg: "rgba(255,255,255,0.12)",
            thumbFg: "#FFFFFF"
        },
        title: "Northwind Studio",
        logo: { kind: "mono", text: "NS", size: 12 },
        primary: {
            label: "Product designer",
            value: "Ayesha Raza Khan, Principal Designer and Brand Systems Lead",
            size: 22
        },
        thumbnail: { initials: "AK" },
        secondary: [
            { id: "phone", label: "Phone", value: "+92 300 1234567" },
            { id: "email", label: "Email", value: "ayesha@northwind.example", align: "right" }
        ],
        auxiliary: [
            { id: "web", label: "Website", value: "northwind.example" },
            { id: "city", label: "City", value: "Lahore", align: "right" },
            { id: "extra", label: "Dropped", value: "Apple shows four fields at most" }
        ],
        googleSubheader: "Product designer",
        googleRows: [
            {
                id: "r1",
                cells: [
                    { id: "phone", label: "Phone", value: "+92 300 1234567" },
                    { id: "city", label: "City", value: "Lahore" }
                ]
            },
            { id: "r2", cells: [{ id: "email", label: "Email", value: "ayesha@northwind.example" }] }
        ],
        qr: { value: "BEGIN:VCARD\nVERSION:3.0\nFN:Ayesha Raza Khan\nEND:VCARD", alt: "Scan to save contact" },
        details: [
            { id: "web", label: "Website", value: "northwind.example", href: "https://northwind.example" },
            { id: "addr", label: "Address", value: "21 Main Boulevard\nGulberg III, Lahore" },
            { id: "bio", label: "About", value: "Designs calm, accessible products." }
        ]
    },
    wifi: {
        theme: {
            bg: "#0B1026",
            fg: "#E6E9F5",
            label: "#9AA3C7",
            border: "transparent",
            googleFg: "#E6E9F5",
            googleLabel: "#9AA3C7",
            tileBg: "#7D93FF",
            tileFg: "#0B1026"
        },
        title: "Home Wi-Fi",
        logo: { kind: "icon", icon: Wifi },
        primary: { label: "Network", value: "Khan Family 5G" },
        secondary: [
            { id: "sec", label: "Security", value: "WPA2" },
            { id: "pw", label: "Password", value: "sunflower-42", align: "right" }
        ],
        googleSubheader: "Network",
        googleRows: [
            {
                id: "r1",
                cells: [
                    { id: "sec", label: "Security", value: "WPA2" },
                    { id: "pw", label: "Password", value: "sunflower-42" }
                ]
            }
        ],
        qr: { value: "WIFI:T:WPA;S:Khan Family 5G;P:sunflower-42;;", alt: "Scan to join" },
        qrSizeApple: 150,
        qrSizeGoogle: 168,
        details: []
    },
    social: {
        theme: {
            bg: "#FFFFFF",
            fg: "#0A0A0B",
            label: "#6B6B74",
            border: "#E4E4E7",
            googleFg: "#0A0A0B",
            googleLabel: "#6B6B74",
            tileBg: "#0A0A0B",
            tileFg: "#FFFFFF"
        },
        title: "@ayesha.designs",
        logo: { kind: "text", text: "AK" },
        primary: { label: "Creator", value: "Ayesha Khan" },
        secondary: [{ id: "handle", label: "Handle", value: "@ayesha.designs" }],
        googleSubheader: "Creator",
        googleRows: [{ id: "r1", cells: [{ id: "handle", label: "Handle", value: "@ayesha.designs" }] }],
        iconRow: [
            { id: "web", name: "Website", bg: "#EEF1FD", fg: "#3F5BD9", icon: Globe },
            { id: "mail", name: "Email", bg: "#E9F8F1", fg: "#12805C", icon: Mail },
            { id: "phone", name: "Phone", bg: "#FFF8EB", fg: "#8A5300", icon: Phone },
            { id: "at", name: "Threads", bg: "#F1F1F3", fg: "#0A0A0B", icon: AtSign },
            { id: "be", name: "Behance", bg: "#0057FF", fg: "#FFFFFF", mono: "Be" }
        ],
        qr: { value: "", alt: "Scan to open profile", pending: true, pendingText: "Add a link to make a QR" },
        details: [{ id: "web", label: "Website", value: "ayesha.example", href: "https://ayesha.example" }]
    }
};

export const CARD_SAMPLE_OPTIONS: Array<SelectOption> = [
    { id: "bank", label: "Bank account", sub: "Monogram, header field, 4-field limit" },
    { id: "business", label: "Business", sub: "Thumbnail, 2-line clamp, links" },
    { id: "wifi", label: "Wi-Fi", sub: "Icon tile, larger QR, no details" },
    { id: "social", label: "Social", sub: "Icon row, QR placeholder" }
];

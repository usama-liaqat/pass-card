import { AtSign, Globe, Mail, Phone, Wifi } from "lucide-react";
import type { WalletCardData } from "../components/ui";
import type { CardTypeId } from "./cardTypes";

/**
 * A finished-looking example card per type. The homepage tiles show these
 * until the user starts a draft, and the placeholder pages fill their preview
 * from them. Brand colors here are card data, not app tokens.
 */
const BANK_DISCLAIMER =
    "This pass shares bank account details only. It is not a debit or credit card and cannot be used for payments.";

export const SAMPLE_CARDS: Record<CardTypeId, WalletCardData> = {
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

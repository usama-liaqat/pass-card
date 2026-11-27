import { AtSign, Globe, Mail, Phone, Wifi } from "lucide-react";
import type { WalletCardData } from "../components/ui";
import { BANK_SAMPLE } from "./bank/bankState";
import { buildBankCard } from "./bank/buildBankCard";
import type { CardTypeId } from "./cardTypes";

/**
 * A finished-looking example card per type. The homepage tiles show these
 * until the user starts a draft, and the placeholder pages fill their preview
 * from them. Brand colors here are card data, not app tokens.
 */
export const SAMPLE_CARDS: Record<CardTypeId, WalletCardData> = {
    bank: buildBankCard(BANK_SAMPLE),
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

import { AtSign, Contact, Landmark, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CardTypeId = "bank" | "business" | "wifi" | "social";

export interface CardTypeConfig {
    id: CardTypeId;
    /** URL path without the base path, e.g. "/bank-card". */
    route: string;
    /** Short label for the header and mobile menu. */
    navLabel: string;
    /** Product name, e.g. on the homepage tile. */
    name: string;
    /** Page heading. */
    title: string;
    description: string;
    icon: LucideIcon;
}

/**
 * Every card type the app offers. The router, header, mobile menu, homepage
 * and 404 links all read from this list, so a new card type is one entry here
 * plus its page.
 */
export const CARD_TYPES: Array<CardTypeConfig> = [
    {
        id: "bank",
        route: "/bank-card",
        navLabel: "Bank card",
        name: "Bank Account Card",
        title: "Bank account card",
        description: "Store and share bank account information.",
        icon: Landmark
    },
    {
        id: "business",
        route: "/business-card",
        navLabel: "Business card",
        name: "Business Card",
        title: "Business card",
        description: "Share professional and contact information.",
        icon: Contact
    },
    {
        id: "wifi",
        route: "/wifi-card",
        navLabel: "Wi-Fi card",
        name: "Wi-Fi Card",
        title: "Wi-Fi card",
        description: "Share Wi-Fi network access through a scannable QR code.",
        icon: Wifi
    },
    {
        id: "social",
        route: "/social-card",
        navLabel: "Social card",
        name: "Social Card",
        title: "Social card",
        description: "Share social media profiles and online identities.",
        icon: AtSign
    }
];

export const CARD_TYPE_IDS: Array<CardTypeId> = CARD_TYPES.map(type => type.id);

export const getCardType = (id: CardTypeId): CardTypeConfig => {
    const found = CARD_TYPES.find(type => type.id === id);
    if (!found) throw new Error(`Unknown card type: ${id}`);
    return found;
};

/**
 * "Create bank account card". Lowercases a plain first word only, so proper
 * forms like "Wi-Fi" keep their capitals.
 */
export const createLabel = (type: CardTypeConfig): string =>
    `Create ${type.title.replace(/^(\w)(?=[a-z]+\s)/, letter => letter.toLowerCase())}`;

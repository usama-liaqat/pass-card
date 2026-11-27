import { AtSign, Contact, Heart, Landmark, Star, UserPlus, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CardTypeId = "bank" | "business" | "wifi" | "social";

/** Fields shared by live card types and the future ones listed as "coming soon". */
export interface CardTypeInfo {
    id: string;
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
    /**
     * True while the card's page is still being built: its URL shows the
     * coming soon page instead. Set to false to bring the real page back.
     */
    comingSoon: boolean;
    /** Three short lines on what the card does, for the coming soon page. */
    points: [string, string, string];
}

export interface CardTypeConfig extends CardTypeInfo {
    id: CardTypeId;
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
        icon: Landmark,
        comingSoon: false,
        points: [
            "Account title, number, IBAN and branch on the pass",
            "A QR code that copies your IBAN or account details",
            "Your bank’s colors and mark, or a theme of your own"
        ]
    },
    {
        id: "business",
        route: "/business-card",
        navLabel: "Business card",
        name: "Business Card",
        title: "Business card",
        description: "Share professional and contact information.",
        icon: Contact,
        comingSoon: true,
        points: [
            "Name, job title, company and contact details on the pass",
            "A QR code that saves you as a contact on any phone",
            "Your photo, logo and brand colors, plus a .vcf contact file"
        ]
    },
    {
        id: "wifi",
        route: "/wifi-card",
        navLabel: "Wi-Fi card",
        name: "Wi-Fi Card",
        title: "Wi-Fi card",
        description: "Share Wi-Fi network access through a scannable QR code.",
        icon: Wifi,
        comingSoon: true,
        points: [
            "Network name and security type on the pass",
            "A QR code guests scan to join without typing the password",
            "The password stays hidden on the card unless you show it"
        ]
    },
    {
        id: "social",
        route: "/social-card",
        navLabel: "Social card",
        name: "Social Card",
        title: "Social card",
        description: "Share social media profiles and online identities.",
        icon: AtSign,
        comingSoon: true,
        points: [
            "Your profiles and handles together in one pass",
            "A QR code that opens your main profile or link page",
            "Platform icons, your photo and colors of your choice"
        ]
    }
];

/** Card types that aren't built yet. Each gets a coming soon page at its route. */
export const FUTURE_CARD_TYPES: Array<CardTypeInfo> = [
    {
        id: "membership",
        route: "/coming-soon/membership",
        navLabel: "Membership card",
        name: "Membership Card",
        title: "Membership card",
        description: "Gym, club and library memberships with a member QR and expiry date.",
        icon: UserPlus,
        comingSoon: true,
        points: [
            "Member name, number, tier and expiry date on the pass",
            "Barcode or QR your venue can scan at the door",
            "Club logo and colors, with the same live Apple and Google previews"
        ]
    },
    {
        id: "loyalty",
        route: "/coming-soon/loyalty",
        navLabel: "Loyalty card",
        name: "Loyalty Card",
        title: "Loyalty card",
        description: "Keep store points and stamp cards in your wallet.",
        icon: Star,
        comingSoon: true,
        points: [
            "Store name, member ID and points or stamps",
            "Works with the barcode format your store uses",
            "Reminder text and store details in the pass"
        ]
    },
    {
        id: "emergency",
        route: "/coming-soon/emergency",
        navLabel: "Emergency contact card",
        name: "Emergency Contact Card",
        title: "Emergency contact card",
        description: "Who to call, blood group and allergies — ready when it matters.",
        icon: Heart,
        comingSoon: true,
        points: [
            "Emergency contacts with one-tap call buttons",
            "Optional medical notes you choose to share",
            "Stays private on your device — nothing is uploaded"
        ]
    }
];

/** Card types you can create today. */
export const LIVE_CARD_TYPES: Array<CardTypeConfig> = CARD_TYPES.filter(type => !type.comingSoon);

/** Everything with a coming soon page, in order: in-progress card types, then future ones. */
export const COMING_SOON_TYPES: Array<CardTypeInfo> = [
    ...CARD_TYPES.filter(type => type.comingSoon),
    ...FUTURE_CARD_TYPES
];

export const CARD_TYPE_IDS: Array<CardTypeId> = CARD_TYPES.map(type => type.id);

export const getCardType = (id: CardTypeId): CardTypeConfig => {
    const found = CARD_TYPES.find(type => type.id === id);
    if (!found) throw new Error(`Unknown card type: ${id}`);
    return found;
};

/** "Bank account card" → "bank account card", keeping proper forms like "Wi-Fi". */
export const inlineTitle = (type: CardTypeInfo): string =>
    type.title.replace(/^(\w)(?=[a-z]+\s)/, letter => letter.toLowerCase());

/** "Create bank account card", "Create Wi-Fi card". */
export const createLabel = (type: CardTypeInfo): string => `Create ${inlineTitle(type)}`;

import type { HTMLAttributes } from "react";
import type { CardTypeId } from "./cardTypes";
import type { CardDraft } from "./draftStore";
import { SAMPLE_CARDS } from "./previewSamples";
import type { WalletCardData } from "../components/ui";

/*
 * Temporary fields for the placeholder card pages. They exist so the shared
 * layout, progress bar, draft store and wallet flow can be exercised now; each
 * card page replaces them with its real form in a later phase.
 */

export interface PlaceholderField {
    id: string;
    label: string;
    placeholder: string;
    required: boolean;
    type?: "text" | "password";
    mono?: boolean;
    inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
    maxLength: number;
}

export interface PlaceholderConfig {
    fields: Array<PlaceholderField>;
    /** Pass description inside the pass file. */
    passDescription: string;
    privacyNote: string;
}

export const PLACEHOLDER_CONFIG: Record<CardTypeId, PlaceholderConfig> = {
    bank: {
        fields: [
            {
                id: "accountTitle",
                label: "Account title",
                placeholder: "e.g. Ayesha Raza Khan",
                required: true,
                maxLength: 70
            },
            {
                id: "accountNumber",
                label: "Account number",
                placeholder: "e.g. 5501 0012 3456 78",
                required: true,
                mono: true,
                inputMode: "numeric",
                maxLength: 26
            },
            {
                id: "nickname",
                label: "Account nickname",
                placeholder: "e.g. Freelance income",
                required: false,
                maxLength: 32
            }
        ],
        passDescription: "Bank account details",
        privacyNote:
            "This pass holds bank account details for receiving transfers. They stay in this browser unless you download or export a file yourself."
    },
    business: {
        fields: [
            { id: "fullName", label: "Full name", placeholder: "e.g. Ayesha Raza Khan", required: true, maxLength: 70 },
            { id: "jobTitle", label: "Job title", placeholder: "e.g. Product designer", required: true, maxLength: 60 },
            { id: "company", label: "Company", placeholder: "e.g. Northwind Studio", required: false, maxLength: 60 }
        ],
        passDescription: "Business card",
        privacyNote:
            "Your contact details are processed only in this browser. Nothing is uploaded or saved unless you download or export a file yourself."
    },
    wifi: {
        fields: [
            {
                id: "ssid",
                label: "Network name (SSID)",
                placeholder: "e.g. Khan Family 5G",
                required: true,
                maxLength: 32
            },
            {
                id: "password",
                label: "Password",
                placeholder: "Leave empty for an open network",
                required: false,
                type: "password",
                maxLength: 63
            }
        ],
        passDescription: "Wi-Fi network",
        privacyNote:
            "Anyone who scans this Wi-Fi QR code may be able to read the network name and password, even if the password is hidden on the card. Wi-Fi cards stay private by default and never leave this browser."
    },
    social: {
        fields: [
            {
                id: "displayName",
                label: "Display name",
                placeholder: "e.g. Ayesha Khan",
                required: true,
                maxLength: 60
            },
            { id: "username", label: "Username", placeholder: "e.g. @ayesha.designs", required: true, maxLength: 40 }
        ],
        passDescription: "Social profiles",
        privacyNote:
            "Your social card is made in this browser. Only profiles you keep visible are included, and nothing is published unless you set up a public page later."
    }
};

const value = (draft: CardDraft, id: string): string => draft.form[id]?.trim() ?? "";

/**
 * Preview card for a placeholder page: the sample card with the typed values
 * swapped in. Empty fields keep the sample text, dimmed, as a hint.
 */
export const buildPlaceholderCard = (type: CardTypeId, draft: CardDraft): WalletCardData => {
    const sample = SAMPLE_CARDS[type];
    const [first, second] = PLACEHOLDER_CONFIG[type].fields;
    const primary = value(draft, first.id);
    const secondary = second ? value(draft, second.id) : "";
    const secondaryShown = second?.type === "password" && secondary ? "••••••••" : secondary;
    const firstSecondary = sample.secondary?.[0];

    return {
        ...sample,
        primary: { ...sample.primary, value: primary || sample.primary.value, dimmed: !primary },
        secondary: firstSecondary
            ? [
                  {
                      ...firstSecondary,
                      label: second?.label ?? firstSecondary.label,
                      value: secondaryShown || firstSecondary.value,
                      dimmed: !secondaryShown
                  },
                  // Drop the sample field this one replaces (e.g. Wi-Fi "Password").
                  ...(sample.secondary ?? []).slice(1).filter(field => field.label !== second?.label)
              ]
            : sample.secondary,
        qr:
            sample.qr && !sample.qr.pending
                ? { ...sample.qr, value: [primary, secondary].filter(Boolean).join(" · ") || sample.qr.value }
                : sample.qr
    };
};

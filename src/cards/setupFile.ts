import { CARD_TYPE_IDS, getCardType } from "./cardTypes";
import type { CardTypeId } from "./cardTypes";
import { createEmptyDraft } from "./draftStore";
import type { CardDraft, DraftValue } from "./draftStore";

/*
 * "Export setup" saves a card's draft as a JSON file the user keeps; "Import
 * setup" reads it back. The file never leaves the user's device.
 */

const SETUP_APP = "passcard";
const SETUP_VERSION = 1;

interface SetupFile {
    app: typeof SETUP_APP;
    version: number;
    cardType: CardTypeId;
    draft: CardDraft;
}

export const serializeSetup = (cardType: CardTypeId, draft: CardDraft): string =>
    JSON.stringify({ app: SETUP_APP, version: SETUP_VERSION, cardType, draft } satisfies SetupFile, null, 2);

export type ParseSetupResult = { ok: true; draft: CardDraft } | { ok: false; message: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const pickStrings = (value: unknown): Record<string, string> =>
    isRecord(value)
        ? Object.fromEntries(
              Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string")
          )
        : {};

const pickValues = (value: unknown): Record<string, DraftValue> =>
    isRecord(value)
        ? Object.fromEntries(
              Object.entries(value).filter(
                  (entry): entry is [string, DraftValue] =>
                      typeof entry[1] === "string" || typeof entry[1] === "boolean"
              )
          )
        : {};

/** Reads an exported setup, keeping only values of the expected types. */
export const parseSetup = (text: string, expected: CardTypeId): ParseSetupResult => {
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        return { ok: false, message: "That file isn’t a Passcard setup." };
    }
    if (!isRecord(data) || data.app !== SETUP_APP || !isRecord(data.draft)) {
        return { ok: false, message: "That file isn’t a Passcard setup." };
    }
    if (typeof data.version !== "number" || data.version > SETUP_VERSION) {
        return { ok: false, message: "This setup was made by a newer version of Passcard." };
    }
    const cardType = data.cardType;
    if (typeof cardType !== "string" || !CARD_TYPE_IDS.includes(cardType as CardTypeId)) {
        return { ok: false, message: "That setup is for an unknown card type." };
    }
    if (cardType !== expected) {
        return {
            ok: false,
            message: `That setup belongs to the ${getCardType(cardType as CardTypeId).navLabel} page.`
        };
    }

    const draft = data.draft;
    const empty = createEmptyDraft();
    return {
        ok: true,
        draft: {
            form: pickStrings(draft.form),
            appearance: pickValues(draft.appearance),
            qr: pickValues(draft.qr),
            platform: draft.platform === "google" ? "google" : empty.platform,
            view: empty.view
        }
    };
};

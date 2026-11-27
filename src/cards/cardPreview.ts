import type { WalletCardData } from "../components/ui";
import type { CardTypeId } from "./cardTypes";
import { readBankState } from "./bank/bankState";
import { buildBankCard } from "./bank/buildBankCard";
import { hasDraftContent } from "./draftStore";
import type { CardDraft } from "./draftStore";
import { buildPlaceholderCard } from "./placeholderCards";
import { SAMPLE_CARDS } from "./previewSamples";

/**
 * The card to show for a type outside its own page (e.g. a homepage tile):
 * the user's draft when there is one, otherwise the realistic sample card.
 * Each type with a finished page uses its real builder; the rest use the placeholder.
 */
export const buildCardPreview = (type: CardTypeId, draft: CardDraft): WalletCardData => {
    if (!hasDraftContent(draft)) return SAMPLE_CARDS[type];
    if (type === "bank") return buildBankCard(readBankState(draft));
    return buildPlaceholderCard(type, draft);
};

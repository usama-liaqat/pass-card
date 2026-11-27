import type { WalletCardData } from "../components/ui";
import type { CardTypeId } from "./cardTypes";
import { hasDraftContent } from "./draftStore";
import type { CardDraft } from "./draftStore";
import { buildPlaceholderCard } from "./placeholderCards";
import { SAMPLE_CARDS } from "./previewSamples";

/**
 * The card to show for a type outside its own page (e.g. a homepage tile):
 * the user's draft when there is one, otherwise the realistic sample card.
 * Swap buildPlaceholderCard for each type's real builder as its page lands.
 */
export const buildCardPreview = (type: CardTypeId, draft: CardDraft): WalletCardData =>
    hasDraftContent(draft) ? buildPlaceholderCard(type, draft) : SAMPLE_CARDS[type];

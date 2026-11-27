import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { WalletCardView, WalletPlatform } from "../components/ui";
import { CARD_TYPE_IDS } from "./cardTypes";
import type { CardTypeId } from "./cardTypes";

export type DraftValue = string | boolean;

/** Everything the user has entered for one card type. */
export interface CardDraft {
    /** Form field values, keyed by field id. */
    form: Record<string, string>;
    /** Theme, colors, images and "show on card" choices. */
    appearance: Record<string, DraftValue>;
    /** QR code settings. */
    qr: Record<string, DraftValue>;
    /** Preview state, kept so the preview looks the same when you come back. */
    platform: WalletPlatform;
    view: WalletCardView;
}

export type DraftSection = "form" | "appearance" | "qr";

type DraftState = Record<CardTypeId, CardDraft>;

export const createEmptyDraft = (): CardDraft => ({
    form: {},
    appearance: {},
    qr: {},
    platform: "apple",
    view: "front"
});

const createInitialState = (): DraftState =>
    Object.fromEntries(CARD_TYPE_IDS.map(id => [id, createEmptyDraft()])) as DraftState;

/*
 * One in-memory store for the whole tab. Nothing is written to localStorage or
 * sessionStorage: drafts survive page changes but not a reload or a new tab.
 */
const INITIAL_STATE = createInitialState();
let state: DraftState = INITIAL_STATE;
const listeners = new Set<() => void>();

const setState = (next: DraftState) => {
    state = next;
    listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => state;
/** Prerendering and hydration always start from empty drafts. */
const getServerSnapshot = () => INITIAL_STATE;

export const draftActions = {
    update: (type: CardTypeId, section: DraftSection, patch: Record<string, DraftValue>) => {
        const draft = state[type];
        setState({ ...state, [type]: { ...draft, [section]: { ...draft[section], ...patch } } });
    },
    setPreview: (type: CardTypeId, patch: Partial<Pick<CardDraft, "platform" | "view">>) => {
        setState({ ...state, [type]: { ...state[type], ...patch } });
    },
    replace: (type: CardTypeId, draft: CardDraft) => {
        setState({ ...state, [type]: draft });
    },
    reset: (type: CardTypeId) => {
        // Keep the chosen wallet platform; clear everything the user entered.
        setState({ ...state, [type]: { ...createEmptyDraft(), platform: state[type].platform } });
    }
};

/** True once the user has entered something worth calling a draft. */
export const hasDraftContent = (draft: CardDraft): boolean =>
    Object.values(draft.form).some(value => value.trim() !== "") ||
    Object.keys(draft.appearance).length > 0 ||
    Object.keys(draft.qr).length > 0;

export interface CardDraftApi {
    draft: CardDraft;
    update: (section: DraftSection, patch: Record<string, DraftValue>) => void;
    setPreview: (patch: Partial<Pick<CardDraft, "platform" | "view">>) => void;
    replace: (draft: CardDraft) => void;
    reset: () => void;
}

/** The draft of one card type plus actions bound to it. */
export const useCardDraft = (type: CardTypeId): CardDraftApi => {
    const selectDraft = useCallback(() => getSnapshot()[type], [type]);
    const selectServerDraft = useCallback(() => getServerSnapshot()[type], [type]);
    const draft = useSyncExternalStore(subscribe, selectDraft, selectServerDraft);

    const update = useCallback(
        (section: DraftSection, patch: Record<string, DraftValue>) => draftActions.update(type, section, patch),
        [type]
    );
    const setPreview = useCallback(
        (patch: Partial<Pick<CardDraft, "platform" | "view">>) => draftActions.setPreview(type, patch),
        [type]
    );
    const replace = useCallback((next: CardDraft) => draftActions.replace(type, next), [type]);
    const reset = useCallback(() => draftActions.reset(type), [type]);

    return useMemo(() => ({ draft, update, setPreview, replace, reset }), [draft, update, setPreview, replace, reset]);
};

/** Which card types currently hold a draft, for the "Draft" dots and labels. */
export const useDraftFlags = (): Record<CardTypeId, boolean> => {
    const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return useMemo(
        () =>
            Object.fromEntries(CARD_TYPE_IDS.map(id => [id, hasDraftContent(all[id])])) as Record<CardTypeId, boolean>,
        [all]
    );
};

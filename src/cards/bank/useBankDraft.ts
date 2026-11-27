import { useCallback, useMemo } from "react";
import { useCardDraft } from "../draftStore";
import type { CardDraftApi, DraftValue } from "../draftStore";
import { readBankState, toFormPatch } from "./bankState";
import type { BankForm, BankLook, BankQr, BankState } from "./bankState";

export interface BankDraftApi {
    api: CardDraftApi;
    state: BankState;
    setForm: (patch: Partial<BankForm>) => void;
    setLook: (patch: Partial<BankLook>) => void;
    setQr: (patch: Partial<BankQr>) => void;
    /** Back to the default appearance and QR settings, keeping the details. */
    resetLook: () => void;
}

/** The bank card's draft as typed state, with setters for each section. */
export const useBankDraft = (): BankDraftApi => {
    const api = useCardDraft("bank");
    const { draft, update, replace } = api;
    const state = useMemo(() => readBankState(draft), [draft]);

    const setForm = useCallback((patch: Partial<BankForm>) => update("form", toFormPatch(patch)), [update]);
    const setLook = useCallback(
        (patch: Partial<BankLook>) => update("appearance", patch as Record<string, DraftValue>),
        [update]
    );
    const setQr = useCallback((patch: Partial<BankQr>) => update("qr", patch as Record<string, DraftValue>), [update]);
    const resetLook = useCallback(() => replace({ ...draft, appearance: {}, qr: {} }), [replace, draft]);

    return useMemo(
        () => ({ api, state, setForm, setLook, setQr, resetLook }),
        [api, state, setForm, setLook, setQr, resetLook]
    );
};

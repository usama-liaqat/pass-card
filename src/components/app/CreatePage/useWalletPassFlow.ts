import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WalletCardData, WalletPlatform } from "../../ui";
import { useToast } from "../../../app/toast";
import { saveFile, toFileSlug } from "../../../lib/download";
import { buildApplePassJson, buildGooglePassObject } from "../../../lib/passFile";

/** Short pause so "Preparing your … pass" is readable; the work itself is instant. */
const PREPARE_DELAY_MS = 900;

export const PLATFORM_NAMES: Record<WalletPlatform, string> = { apple: "Apple Wallet", google: "Google Wallet" };

interface WalletPassFlowOptions {
    card: WalletCardData;
    /** Pass description, e.g. "Bank account details". */
    description: string;
    /** Returns false (and shows the errors) when required details are missing. */
    validate: () => boolean;
}

export interface WalletPassFlow {
    /** The platform being prepared, or null. */
    preparing: WalletPlatform | null;
    /** The platform whose pass is ready (opens the dialog), or null. */
    prepared: WalletPlatform | null;
    start: (platform: WalletPlatform) => void;
    close: () => void;
    download: () => void;
}

/** Validate → "Preparing your … pass" → "Wallet pass prepared" dialog → download the unsigned file. */
export const useWalletPassFlow = ({ card, description, validate }: WalletPassFlowOptions): WalletPassFlow => {
    const { showToast } = useToast();
    const [preparing, setPreparing] = useState<WalletPlatform | null>(null);
    const [prepared, setPrepared] = useState<WalletPlatform | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        []
    );

    const start = useCallback(
        (platform: WalletPlatform) => {
            if (preparing) return;
            if (!validate()) {
                showToast("Fill in the highlighted details first", "error");
                return;
            }
            setPreparing(platform);
            timerRef.current = setTimeout(() => {
                setPreparing(null);
                setPrepared(platform);
            }, PREPARE_DELAY_MS);
        },
        [preparing, validate, showToast]
    );

    const close = useCallback(() => setPrepared(null), []);

    const download = useCallback(() => {
        if (!prepared) return;
        if (prepared === "apple") {
            saveFile("pass.json", JSON.stringify(buildApplePassJson(card, description), null, 2), "application/json");
            showToast("pass.json downloaded");
        } else {
            const name = `${toFileSlug(card.title)}-google-object.json`;
            saveFile(name, JSON.stringify(buildGooglePassObject(card), null, 2), "application/json");
            showToast("Pass object downloaded");
        }
    }, [prepared, card, description, showToast]);

    return useMemo(
        () => ({ preparing, prepared, start, close, download }),
        [preparing, prepared, start, close, download]
    );
};

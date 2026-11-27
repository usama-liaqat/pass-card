import { useSyncExternalStore } from "react";
import type { WalletPlatform } from "../components/ui";

/**
 * The wallet app this device can add passes to: Apple Wallet on iPhone and
 * iPad, Google Wallet on Android, none on desktop (or anything else).
 */
export const detectDeviceWallet = (): WalletPlatform | null => {
    if (typeof navigator === "undefined") return null;
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return "apple";
    // iPadOS reports itself as a Mac; a touch screen gives it away.
    if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "apple";
    if (/Android/i.test(ua)) return "google";
    return null;
};

// The device can't change while the page is open, so there is nothing to subscribe to.
const subscribe = () => () => undefined;
const getSnapshot = detectDeviceWallet;
/** Prerendered HTML and hydration show no wallet button; the real one appears right after. */
const getServerSnapshot = (): WalletPlatform | null => null;

export const useDeviceWallet = (): WalletPlatform | null =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

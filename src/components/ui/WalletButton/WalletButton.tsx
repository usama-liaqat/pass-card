import { Activity, memo, useMemo } from "react";
import { LoaderCircle } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import type { WalletPlatform } from "../WalletCard/types";
import "./WalletButton.css";

export interface WalletButtonProps {
    platform: WalletPlatform;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

const NAMES: Record<WalletPlatform, string> = { apple: "Apple Wallet", google: "Google Wallet" };

/**
 * Placeholder "Add to … Wallet" buttons. Swap the marks for the official
 * badge artwork once it is added; the platforms' guidelines require it.
 */
export const WalletButton = memo<WalletButtonProps>(({ platform, onPress, loading = false, disabled = false }) => {
    const name = NAMES[platform];
    const className = useMemo(() => classNames("wallet-btn", `wallet-btn--${platform}`), [platform]);
    const ariaLabel = loading ? "Creating pass" : `Add to ${name}`;

    return (
        <button
            type="button"
            className={className}
            onClick={onPress}
            disabled={loading || disabled}
            aria-busy={loading || undefined}
            aria-label={ariaLabel}
        >
            <Activity mode={loading ? "visible" : "hidden"}>
                <LoaderCircle size={18} strokeWidth={2.25} className="spin" aria-hidden="true" />
                <span className="wallet-btn__busy">Creating pass…</span>
            </Activity>
            <Activity mode={!loading && platform === "apple" ? "visible" : "hidden"}>
                <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden="true" className="wallet-btn__mark">
                    <rect
                        x="1"
                        y="1"
                        width="24"
                        height="20"
                        rx="4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <rect x="4" y="5" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.55" />
                    <rect x="4" y="9.5" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.8" />
                    <rect x="4" y="14" width="18" height="3" rx="1.5" fill="currentColor" />
                </svg>
            </Activity>
            <Activity mode={!loading && platform === "google" ? "visible" : "hidden"}>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="wallet-btn__mark"
                >
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
            </Activity>
            <Activity mode={loading ? "hidden" : "visible"}>
                <span className="wallet-btn__text" aria-hidden="true">
                    <span className="wallet-btn__add">Add to</span>
                    <span className="wallet-btn__name">{name}</span>
                </span>
            </Activity>
        </button>
    );
});

WalletButton.displayName = "WalletButton";

export default WalletButton;
